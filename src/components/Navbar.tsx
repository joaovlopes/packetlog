import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const links = [
  { to: '/', label: 'Início' },
  { to: '/historico', label: 'Histórico' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-ink/80 backdrop-blur-lg border-b border-edge' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-paper">
            Packet<span className="text-accent">Log</span>
          </span>
        </NavLink>

        <div className="flex items-center gap-1 rounded-full border border-edge bg-surface/60 p-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive ? 'text-ink' : 'text-muted hover:text-paper'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://www.linkedin.com/in/joaovlopesmartins/"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full border border-edge px-4 py-1.5 text-sm font-medium text-muted transition-all hover:border-accent hover:text-accent sm:inline-block"
          >
            LinkedIn ↗
          </a>
          {import.meta.env.DEV && (
            <NavLink
              to="/novo-artigo"
              className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-ink transition-transform hover:scale-105 active:scale-95"
            >
              + Novo artigo
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  )
}
