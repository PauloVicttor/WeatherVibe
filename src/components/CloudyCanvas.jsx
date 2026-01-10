import { useEffect, useRef } from "react";

export default function CloudyCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    // Escala adaptativa para mobile
    const baseSize = window.innerWidth < 768 ? 60 : 100; // menor em telas pequenas
    const clouds = [];
    for (let i = 0; i < 12; i++) {
      clouds.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 0.6,
        size: baseSize + Math.random() * (window.innerWidth < 768 ? 80 : 150),
        speed: 0.1 + Math.random() * 0.3,
        opacity: 0.25 + Math.random() * 0.3,
      });
    }

    function drawCloud(x, y, size, opacity) {
      const gradient = ctx.createRadialGradient(
        x, y, size * 0.3,
        x, y, size
      );
      gradient.addColorStop(0, `rgba(255,255,255,${opacity})`);
      gradient.addColorStop(1, `rgba(220,220,220,0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fundo responsivo
      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.addColorStop(0, "#475569");
      bg.addColorStop(1, "#94a3b8");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Nuvens
      clouds.forEach((cloud) => {
        drawCloud(cloud.x, cloud.y, cloud.size, cloud.opacity);
        cloud.x += cloud.speed;
        if (cloud.x - cloud.size > canvas.width) {
          cloud.x = -cloud.size;
          cloud.y = Math.random() * canvas.height * 0.6;
        }
      });

      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Canvas ocupa toda a tela, responsivo
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0"
    />
  );
}