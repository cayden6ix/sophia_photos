import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface Photo {
  id: string
  file_name: string
  file_url: string
  created_at: string
}

function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(`${API_URL}/photos`)
      setPhotos(response.data.photos)
    } catch (error) {
      console.error('Erro ao carregar fotos:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl animate-bounce">🦁</div>
        <p className="text-xl font-bold text-safari-brown mt-4">
          Carregando fotos...
        </p>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-8xl mb-6">🦒</div>
        <h2 className="text-2xl font-bold text-safari-brown mb-2">
          Nenhuma foto ainda!
        </h2>
        <p className="text-safari-brown/70 mb-6">
          Seja o primeiro a enviar uma foto para o safari!
        </p>
        <a
          href="/"
          className="inline-block bg-safari-green text-white font-bold py-3 px-8 rounded-full hover:bg-safari-green-dark transition-colors shadow-lg"
        >
          📸 Enviar Fotos
        </a>
      </div>
    )
  }

  return (
    <>
      {/* Grid de Fotos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg bg-white transform hover:scale-105 transition-all duration-300"
          >
            <img
              src={photo.file_url}
              alt={photo.file_name}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="text-sm font-semibold truncate">{photo.file_name}</p>
                <p className="text-xs opacity-80">{formatDate(photo.created_at)}</p>
              </div>
            </div>
            {/* Ícone de zoom */}
            <div className="absolute top-2 right-2 bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              🔍
            </div>
          </div>
        ))}
      </div>

      {/* Contador de fotos */}
      <div className="mt-8 text-center">
        <p className="text-safari-brown font-semibold">
          🖼️ {photos.length} foto{photos.length !== 1 ? 's' : ''} no safari
        </p>
      </div>

      {/* Modal de foto ampliada */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.file_url}
              alt={selectedPhoto.file_name}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="p-4 bg-safari-sand">
              <p className="font-bold text-safari-brown">{selectedPhoto.file_name}</p>
              <p className="text-sm text-safari-brown/70">
                {formatDate(selectedPhoto.created_at)}
              </p>
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-lg hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default PhotoGallery
