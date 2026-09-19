import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import History from './pages/History'
import NewPost from './pages/NewPost'
import NotFound from './pages/NotFound'

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/post/:slug" element={<PageTransition><PostDetail /></PageTransition>} />
            <Route path="/historico" element={<PageTransition><History /></PageTransition>} />
            {import.meta.env.DEV && (
              <Route path="/novo-artigo" element={<PageTransition><NewPost /></PageTransition>} />
            )}
            <Route path="/404" element={<PageTransition><NotFound /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
