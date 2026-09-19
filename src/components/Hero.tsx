import { motion } from 'framer-motion'
import NetworkBackground from './NetworkBackground'

const ticker = [
  'TCP/IP', 'DNS', 'BGP', 'OSPF', 'VLAN', 'IPv6', 'QUIC', 'TLS 1.3',
  'SDN', 'MPLS', 'NAT', 'ICMP', 'HTTP/3', 'CIDR', 'VPN', 'Firewall',
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-edge">
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
      <div className="absolute inset-0">
        <NetworkBackground />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink/20 to-ink" />

      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface/70 px-4 py-1.5 font-mono text-xs text-muted backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse-dot" />
            bem-vindo à camada mais interessante da internet
          </span>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-paper sm:text-6xl">
            Estudando <span className="text-accent text-glow">redes</span>,{' '}
            <span className="text-accent-2">um pacote</span> de cada vez.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
            Entre o clique e a resposta chegando na sua tela existe um mundo inteiro de pacotes,
            rotas e decisões que ninguém vê. Eu desmonto esse mundo aqui — em artigos completos,
            resumos direto no LinkedIn e um histórico aberto de tudo que já foi publicado.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#posts"
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-105 active:scale-95"
            >
              Ver artigos
            </a>
            <a
              href="/historico"
              className="rounded-full border border-edge px-6 py-2.5 text-sm font-semibold text-paper transition-colors hover:border-accent hover:text-accent"
            >
              Histórico de publicações
            </a>
          </div>
        </motion.div>
      </div>

      <div className="relative border-t border-edge bg-surface/40 py-3 backdrop-blur">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-8 pr-8 font-mono text-xs text-muted">
            {[...ticker, ...ticker].map((item, i) => (
              <span key={i} className="flex items-center gap-2 whitespace-nowrap">
                <span className="h-1 w-1 rounded-full bg-accent/60" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
