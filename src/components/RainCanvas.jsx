import { useEffect, useRef } from "react";

export default function RainCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const dropCount = window.innerWidth < 768 ? 100 : 180;
    const drops = Array.from({ length: dropCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 18 + 8,
      speed: Math.random() * 3 + 3,
    }));

    const ripples = [];

    let animationFrameId;

    const drawRain = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fundo escuro
      ctx.fillStyle = "rgba(15,20,30,1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Chuva
      ctx.strokeStyle = "rgba(220, 235, 255, 0.85)";
      ctx.lineWidth = 1.5;

      drops.forEach((drop) => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > canvas.height - 40) {
          // Criar ripple na poça
          ripples.push({
            x: drop.x,
            y: canvas.height - 25,
            radius: 2,
            alpha: 0.5,
          });

          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });

      // Poça d’água sutil (gradiente translúcido)
      const puddle = ctx.createLinearGradient(
        0, canvas.height - 40,
        0, canvas.height
      );
      puddle.addColorStop(0, "rgba(50,70,100,0.3)");
      puddle.addColorStop(1, "rgba(30,40,60,0.6)");
      ctx.fillStyle = puddle;
      ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

      // Reflexo suave das gotas
      drops.forEach((drop) => {
        if (drop.y > canvas.height - 60) {
          ctx.strokeStyle = "rgba(200,220,255,0.15)";
          ctx.beginPath();
          ctx.moveTo(drop.x, canvas.height - 40);
          ctx.lineTo(drop.x, canvas.height - 40 - drop.length * 0.5);
          ctx.stroke();
        }
      });

      // Ondas discretas
      ripples.forEach((ripple, i) => {
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(220,235,255,${ripple.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ripple.radius += 0.5;
        ripple.alpha -= 0.01;

        if (ripple.alpha <= 0) {
          ripples.splice(i, 1);
        }
      });

      animationFrameId = requestAnimationFrame(drawRain);
    };

    drawRain();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
}