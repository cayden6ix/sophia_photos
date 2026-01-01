import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import UploadPage from './pages/UploadPage'
import GalleryPage from './pages/GalleryPage'

function App() {
  return (
    <div className="min-h-screen bg-safari-cream">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/galeria" element={<GalleryPage />} />
        </Routes>
      </main>

      {/* Footer com creditos */}
      <footer className="text-center py-4 text-safari-brown/50 text-sm">
        <p>Feito com 💚 pelo papai e pela mamãe</p>
      </footer>
    </div>
  )
}

export default App
