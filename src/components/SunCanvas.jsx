import { useEffect, useRef } from "react"

export default function SunCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    let frame = 0

    function draw() {
      frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 🌅 Céu quente e vibrante
      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height)
      sky.addColorStop(0, "#38bdf8") // azul claro
      sky.addColorStop(0.5, "#fde047") // amarelo vibrante
      sky.addColorStop(1, "#f97316")   // laranja quente
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 🔆 Posição deslocada (acima e lateral direita)
      const cx = canvas.width * 0.7
      const cy = canvas.height * 0.3
      const baseRadius = 120
      const pulse = Math.sin(frame * 0.02) * 8

      // ☀️ Núcleo radiante
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius + pulse)
      core.addColorStop(0, "rgba(255,255,255,0.95)") // branco intenso
      core.addColorStop(0.5, "rgba(255,230,100,0.8)") // amarelo forte
      core.addColorStop(1, "rgba(255,150,50,0.5)")    // laranja suave
      ctx.fillStyle = core
      ctx.beginPath()
      ctx.arc(cx, cy, baseRadius + pulse, 0, Math.PI * 2)
      ctx.fill()

      // 🌟 Raios irradiando estilo calor
      for (let i = 0; i < 48; i++) {
        const angle = (Math.PI * 2 / 48) * i
        const length = baseRadius + 220 + Math.sin(frame * 0.03 + i) * 40

        ctx.strokeStyle = `rgba(255, 200, 80, ${0.2 + Math.sin(frame * 0.02 + i) * 0.2})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(
          cx + Math.cos(angle) * (baseRadius + 10),
          cy + Math.sin(angle) * (baseRadius + 10)
        )
        ctx.lineTo(
          cx + Math.cos(angle) * length,
          cy + Math.sin(angle) * length
        )
        ctx.stroke()
      }

      requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}