import { useEffect, useRef } from "react";

export default function MoonCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    let frame = 0;

    // Ajuste responsivo: menos estrelas em telas pequenas
    const starCount = window.innerWidth < 768 ? 100 : 200;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.5,
      phase: Math.random() * Math.PI * 2,
    }));

    function drawMoon() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fundo preto
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Estrelas piscando suavemente
      stars.forEach((star) => {
        const opacity = 0.6 + Math.sin(frame * 0.005 + star.phase) * 0.4;
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Posição e raio da lua adaptativo
      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.25;
      const radius = window.innerWidth < 768 ? 100 : 160; // menor em mobile

      // Glow suave
      const glow = ctx.createRadialGradient(
        centerX, centerY, radius * 0.5,
        centerX, centerY, radius * 3
      );
      glow.addColorStop(0, "rgba(255,255,220,0.3)");
      glow.addColorStop(1, "rgba(255,255,220,0)");

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Corpo da lua com gradiente
      const moonGradient = ctx.createRadialGradient(
        centerX, centerY, radius * 0.2,
        centerX, centerY, radius
      );
      moonGradient.addColorStop(0, "#f8f8f8");
      moonGradient.addColorStop(1, "#b0b0b0");

      ctx.fillStyle = moonGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Textura leve (ruído difuso)
      const textureCount = window.innerWidth < 768 ? 150 : 300;
      for (let i = 0; i < textureCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * radius;
        const tx = centerX + Math.cos(angle) * dist;
        const ty = centerY + Math.sin(angle) * dist;
        const tr = Math.random() * 2 + 0.5;

        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`;
        ctx.beginPath();
        ctx.arc(tx, ty, tr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sombra lateral (fase da lua)
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath();
      ctx.ellipse(
        centerX + radius * 0.3,
        centerY,
        radius * 0.9,
        radius,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      frame++;
      requestAnimationFrame(drawMoon);
    }

    drawMoon();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
}