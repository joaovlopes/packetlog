import { useEffect, useState } from 'react'

export default function LiveCounter({ start = 184320, min = 2, max = 14, intervalMs = 650 }: {
  start?: number
  min?: number
  max?: number
  intervalMs?: number
}) {
  const [count, setCount] = useState(start)

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * (max - min + 1)) + min)
    }, intervalMs)
    return () => clearInterval(id)
  }, [min, max, intervalMs])

  return <span className="font-mono tabular-nums">{count.toLocaleString('pt-BR')}</span>
}
