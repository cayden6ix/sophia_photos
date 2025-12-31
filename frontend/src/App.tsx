import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import UploadPage from './pages/UploadPage'
import GalleryPage from './pages/GalleryPage'

function App() {
  return (
    <div className="min-h-screen bg-safari-sky">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/galeria" element={<GalleryPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
