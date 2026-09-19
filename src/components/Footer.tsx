export default function Footer() {
  return (
    <footer className="border-t border-edge">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" />
            <span>status: online · uptime 99.98%</span>
          </div>
          <p className="font-mono text-xs text-muted">
            PacketLog © {new Date().getFullYear()} — notas de estudo sobre redes de computadores
          </p>
          <div className="flex gap-4 font-mono text-xs text-muted">
            <a href="https://www.linkedin.com/in/joaovlopesmartins/" target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
              linkedin
            </a>
            <a href="https://github.com/joaovlopes" target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
              github
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
