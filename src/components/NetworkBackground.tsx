import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
}

interface Packet {
  from: number
  to: number
  t: number
  speed: number
}

const NODE_COUNT = 46
const LINK_DIST = 150
const PACKET_COUNT = 14

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf = 0
    let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const nodes: Node[] = []
    const packets: Packet[] = []

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const init = () => {
      nodes.length = 0
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
        })
      }
      packets.length = 0
      for (let i = 0; i < PACKET_COUNT; i++) {
        packets.push({
          from: Math.floor(Math.random() * NODE_COUNT),
          to: Math.floor(Math.random() * NODE_COUNT),
          t: Math.random(),
          speed: 0.0025 + Math.random() * 0.003,
        })
      }
    }

    resize()
    init()

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current.x = e.clientX - rect.left
      mouse.current.y = e.clientY - rect.top
    }
    const onLeave = () => {
      mouse.current.x = -9999
      mouse.current.y = -9999
    }

    window.addEventListener('resize', () => {
      resize()
    })
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)

    const accent = 'rgba(34, 211, 238,'
    const accent2 = 'rgba(167, 139, 250,'
    const edge = 'rgba(90, 110, 150,'

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < 0 || n.x > width) n.vx *= -1
          if (n.y < 0 || n.y > height) n.vy *= -1
        }
        const dx = n.x - mouse.current.x
        const dy = n.y - mouse.current.y
        const dist = Math.hypot(dx, dy)
        if (dist < 120) {
          const force = (120 - dist) / 120
          n.x += (dx / dist) * force * 0.6
          n.y += (dy / dist) * force * 0.6
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.35
            ctx.strokeStyle = `${edge}${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = `${edge}0.9)`
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reduced) {
        for (const p of packets) {
          p.t += p.speed
          if (p.t >= 1) {
            p.t = 0
            p.from = p.to
            p.to = Math.floor(Math.random() * NODE_COUNT)
          }
          const a = nodes[p.from]
          const b = nodes[p.to]
          if (!a || !b) continue
          const x = a.x + (b.x - a.x) * p.t
          const y = a.y + (b.y - a.y) * p.t
          const color = p.from % 2 === 0 ? accent : accent2
          const grad = ctx.createRadialGradient(x, y, 0, x, y, 8)
          grad.addColorStop(0, `${color}0.9)`)
          grad.addColorStop(1, `${color}0)`)
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(x, y, 8, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = `${color}1)`
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}
