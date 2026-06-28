import { Routes, Route } from 'react-router-dom'
import NavPill from './components/NavPill'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Topics from './pages/Topics'
import Definitions from './pages/Definitions'
import Guides from './pages/Guides'
import Practice from './pages/Practice'
import CertExam from './pages/CertExam'
import Build from './pages/Build'
import HomeTest from './pages/HomeTest'
import Scripts from './pages/Scripts'

export default function App() {
  return (
    <div className="min-h-screen bg-void">
      <main
        id="main-content"
        className="pb-24 scroll-smooth"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/definitions" element={<Definitions />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/cert-exam" element={<CertExam />} />
          <Route path="/build" element={<Build />} />
          <Route path="/home-test" element={<HomeTest />} />
          <Route path="/scripts" element={<Scripts />} />
        </Routes>
      </main>
      <NavPill />
      <ScrollToTop />
    </div>
  )
}
