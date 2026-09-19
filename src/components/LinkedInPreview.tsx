import { useState } from 'react'

export default function LinkedInPreview({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-edge bg-surface">
      <div className="flex items-center justify-between border-b border-edge bg-surface-2 px-5 py-3">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden>
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
          </svg>
          <span className="font-mono text-xs text-muted">versão para o LinkedIn</span>
        </div>
        <button
          onClick={copy}
          className="rounded-full border border-edge px-3 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {copied ? 'copiado ✓' : 'copiar texto'}
        </button>
      </div>
      <div className="px-5 py-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 font-display text-sm font-bold text-ink">
            PL
          </div>
          <div>
            <p className="text-sm font-semibold text-paper">PacketLog</p>
            <p className="font-mono text-[11px] text-muted">Redes de Computadores · agora</p>
          </div>
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed text-paper/90">{text}</p>
      </div>
    </div>
  )
}
