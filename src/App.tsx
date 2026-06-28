import { Routes, Route } from 'react-router-dom'
import NavPill from './components/NavPill'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Practice from './pages/Practice'
import CertExam from './pages/CertExam'
import Labs from './pages/Labs'

export default function App() {
  return (
    <div className="min-h-screen bg-void">
      <main
        id="main-content"
        className="pb-24 scroll-smooth"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/topics" element={<Learn />} />
          <Route path="/definitions" element={<Learn />} />
          <Route path="/guides" element={<Learn />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/cert-exam" element={<CertExam />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/build" element={<Labs />} />
          <Route path="/home-test" element={<Labs />} />
        </Routes>
      </main>
      <NavPill />
      <ScrollToTop />
    </div>
  )
}
