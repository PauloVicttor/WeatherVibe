import { useEffect, useRef } from "react";

export default function SunCanvas() {
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

    let frame = 0;

    function draw() {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 🌅 Céu suave (azul → dourado)
      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
      sky.addColorStop(0, "#0ea5e9");   // azul claro
      sky.addColorStop(1, "#fde68a");   // dourado suave
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ☀️ Posição do sol (mais acima e lateral direita)
      const cx = canvas.width * 0.7;
      const cy = canvas.height * 0.25;

      // Raio adaptativo para mobile
      const baseRadius = window.innerWidth < 768 ? 100 : 160;
      const pulse = Math.sin(frame * 0.02) * (window.innerWidth < 768 ? 4 : 6);

      // Núcleo radiante
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius + pulse);
      core.addColorStop(0, "rgba(255,255,255,0.95)");
      core.addColorStop(1, "rgba(255,200,80,0.8)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius + pulse, 0, Math.PI * 2);
      ctx.fill();

      // Halo difuso ao redor
      const halo = ctx.createRadialGradient(cx, cy, baseRadius, cx, cy, baseRadius * 3);
      halo.addColorStop(0, "rgba(255,220,120,0.25)");
      halo.addColorStop(1, "rgba(255,220,120,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 3, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
}