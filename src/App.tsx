import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Topics from './pages/Topics'
import Definitions from './pages/Definitions'
import Guides from './pages/Guides'
import Practice from './pages/Practice'

export default function App() {
  return (
    <div className="flex h-screen bg-void">
      <Sidebar />
      <main
        id="main-content"
        className="flex-1 overflow-y-auto scroll-smooth"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/definitions" element={<Definitions />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/practice" element={<Practice />} />
        </Routes>
      </main>
      <ScrollToTop />
    </div>
  )
}
