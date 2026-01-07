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

    const drops = Array.from({ length: 200 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 4 + 4,
    }));

    let animationFrameId;

    const drawRain = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 🎨 Branco com leve tom azulado
      ctx.strokeStyle = "rgba(220, 235, 255, 0.85)";
      ctx.lineWidth = 2;

      // ✨ Efeito de blur/sombra para dar sensação de movimento
      ctx.shadowColor = "rgba(180, 200, 255, 0.6)";
      ctx.shadowBlur = 4;

      drops.forEach((drop) => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
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
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}