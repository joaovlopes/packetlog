import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm text-accent">ICMP: Destination Unreachable</p>
      <h1 className="mt-4 font-display text-6xl font-bold text-paper">404</h1>
      <p className="mt-3 max-w-sm text-muted">
        O pacote que você enviou não encontrou rota até esse destino.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-105"
      >
        Voltar ao início
      </Link>
    </div>
  )
}
