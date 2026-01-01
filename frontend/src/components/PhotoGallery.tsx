import { useState, useEffect, useRef, memo } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const PHOTOS_PER_PAGE = 20

// Gera URL de thumbnail usando Supabase Image Transformations
const getThumbnailUrl = (originalUrl: string, width: number = 400): string => {
  // Supabase Storage URLs podem usar transformações via query params
  // Formato: /storage/v1/render/image/public/bucket/file?width=400&height=400&resize=cover
  if (originalUrl.includes('supabase.co/storage')) {
    // Converte URL pública para URL de render com transformação
    const renderUrl = originalUrl.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    )
    return `${renderUrl}?width=${width}&height=${width}&resize=cover&quality=80`
  }
  return originalUrl
}

interface Photo {
  id: string
  file_name: string
  file_url: string
  created_at: string
}

interface PhotoCardProps {
  photo: Photo
  isSelected: boolean
  selectionMode: boolean
  onSelect: (id: string) => void
  onClick: (photo: Photo) => void
  formatDate: (date: string) => string
}

// Componente memoizado para evitar re-renders desnecessários
const PhotoCard = memo(function PhotoCard({
  photo,
  isSelected,
  selectionMode,
  onSelect,
  onClick,
  formatDate,
}: PhotoCardProps) {
  const thumbnailUrl = getThumbnailUrl(photo.file_url, 400)

  return (
    <div
      onClick={() => (selectionMode ? onSelect(photo.id) : onClick(photo))}
      className={`relative group cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg bg-white transform hover:scale-105 active:scale-[0.98] transition-all duration-300 border-2 ${
        isSelected
          ? 'border-safari-green ring-2 ring-safari-green'
          : 'border-safari-cream-dark hover:border-safari-green-light'
      }`}
    >
      <img
        src={thumbnailUrl}
        alt={photo.file_name}
        className="w-full aspect-square sm:h-48 object-cover"
        loading="lazy"
        decoding="async"
      />
      {/* Checkbox de seleção */}
      {selectionMode && (
        <div className="absolute top-2 left-2 z-10">
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              isSelected
                ? 'bg-safari-green border-safari-green text-white'
                : 'bg-white/80 border-safari-brown/50'
            }`}
          >
            {isSelected && '✓'}
          </div>
        </div>
      )}
      {/* Overlay com info */}
      <div className="absolute inset-0 bg-gradient-to-t from-safari-brown/70 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white">
          <p className="text-xs sm:text-sm font-semibold truncate">{photo.file_name}</p>
          <p className="text-[10px] sm:text-xs opacity-80 hidden sm:block">
            {formatDate(photo.created_at)}
          </p>
        </div>
      </div>
      {/* Icone de zoom - apenas em desktop */}
      {!selectionMode && (
        <div className="absolute top-2 right-2 bg-safari-cream/90 rounded-full p-1.5 sm:p-2 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex">
          🔍
        </div>
      )}
    </div>
  )
})

function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())
  const [isDownloading, setIsDownloading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const loaderRef = useRef<HTMLDivElement>(null)

  // Fetch inicial
  useEffect(() => {
    fetchPhotos(1, true)
  }, [])

  // Intersection Observer para infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setPage((prev) => prev + 1)
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loadingMore, loading])

  // Carregar mais fotos quando page mudar
  useEffect(() => {
    if (page > 1) {
      fetchPhotos(page, false)
    }
  }, [page])

  const fetchPhotos = async (pageNum: number, isInitial: boolean) => {
    if (isInitial) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const response = await axios.get(
        `${API_URL}/photos?page=${pageNum}&limit=${PHOTOS_PER_PAGE}`
      )
      const { photos: newPhotos, total: totalPhotos, hasMore: more } = response.data

      if (isInitial) {
        setPhotos(newPhotos)
      } else {
        setPhotos((prev) => [...prev, ...newPhotos])
      }

      setTotal(totalPhotos)
      setHasMore(more)
    } catch (error) {
      console.error('Erro ao carregar fotos:', error)
    } finally {
      if (isInitial) {
        setLoading(false)
      } else {
        setLoadingMore(false)
      }
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

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode)
    setSelectedPhotos(new Set())
  }

  const togglePhotoSelection = (photoId: string) => {
    const newSelection = new Set(selectedPhotos)
    if (newSelection.has(photoId)) {
      newSelection.delete(photoId)
    } else {
      newSelection.add(photoId)
    }
    setSelectedPhotos(newSelection)
  }

  const selectAllPhotos = () => {
    setSelectedPhotos(new Set(photos.map((p) => p.id)))
  }

  const downloadSinglePhoto = async (photo: Photo) => {
    try {
      const response = await axios.get(`${API_URL}/photos/download/${photo.id}`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(response.data)
      const a = document.createElement('a')
      a.href = url
      a.download = photo.file_name
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao baixar foto:', error)
    }
  }

  const downloadSelectedPhotos = async (photoIds: string[]) => {
    if (photoIds.length === 0) return
    setIsDownloading(true)
    try {
      const response = await axios.post(
        `${API_URL}/photos/download-zip`,
        { photoIds },
        { responseType: 'blob' }
      )
      const url = window.URL.createObjectURL(response.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `sophia_photos_${new Date().toISOString().slice(0, 10)}.zip`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao baixar fotos:', error)
    } finally {
      setIsDownloading(false)
      setSelectionMode(false)
      setSelectedPhotos(new Set())
    }
  }

  const downloadAllPhotos = () => {
    downloadSelectedPhotos(photos.map((p) => p.id))
  }

  // Bloquear scroll do body quando modal esta aberto
  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedPhoto])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-20">
        <div className="text-5xl sm:text-6xl animate-bounce">🦁</div>
        <p className="text-lg sm:text-xl font-bold text-safari-brown mt-4 text-center px-4">
          Carregando momentos do Safari...
        </p>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 sm:py-20 bg-white/50 rounded-2xl sm:rounded-3xl mx-2 sm:mx-0">
        <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">🦒</div>
        <h2 className="text-xl sm:text-2xl font-bold text-safari-brown mb-2 px-4">
          O álbum ainda esta vazio!
        </h2>
        <p className="text-safari-brown/60 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base px-4">
          Seja o primeiro a compartilhar um momento especial no cha de bebe da Sophia!
        </p>
        <a
          href="/"
          className="inline-block bg-safari-green text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full hover:bg-safari-green-dark active:bg-safari-green-dark transition-colors shadow-lg text-sm sm:text-base"
        >
          📸 Enviar Primeira Foto
        </a>
      </div>
    )
  }

  return (
    <>
      {/* Toolbar de Seleção */}
      <div className="flex flex-wrap justify-between items-center mb-4 px-2 sm:px-0 gap-2">
        <div className="flex items-center gap-2">
          {selectionMode && (
            <>
              <span className="text-safari-brown font-semibold text-sm sm:text-base">
                {selectedPhotos.size} selecionada(s)
              </span>
              <button
                onClick={selectAllPhotos}
                className="text-safari-green font-semibold text-sm hover:underline"
              >
                Selecionar Todas
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!selectionMode && (
            <button
              onClick={downloadAllPhotos}
              disabled={isDownloading}
              className="bg-safari-green text-white font-bold py-2 px-4 rounded-full hover:bg-safari-green-dark active:bg-safari-green-dark transition-colors text-sm flex items-center gap-1"
            >
              <span>⬇️</span>
              <span>{isDownloading ? 'Baixando...' : 'Baixar Todas'}</span>
            </button>
          )}
          <button
            onClick={toggleSelectionMode}
            className={`font-bold py-2 px-4 rounded-full transition-colors text-sm ${
              selectionMode
                ? 'bg-safari-brown text-white hover:bg-safari-brown-dark'
                : 'bg-safari-cream text-safari-brown hover:bg-safari-cream-dark'
            }`}
          >
            {selectionMode ? 'Cancelar' : 'Selecionar'}
          </button>
        </div>
      </div>

      {/* Grid de Fotos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 px-2 sm:px-0">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            isSelected={selectedPhotos.has(photo.id)}
            selectionMode={selectionMode}
            onSelect={togglePhotoSelection}
            onClick={setSelectedPhoto}
            formatDate={formatDate}
          />
        ))}
      </div>

      {/* Loader para infinite scroll */}
      <div ref={loaderRef} className="flex justify-center py-8">
        {loadingMore && (
          <div className="flex flex-col items-center">
            <div className="text-4xl animate-bounce">🦓</div>
            <p className="text-safari-brown font-semibold mt-2">Carregando mais fotos...</p>
          </div>
        )}
        {!hasMore && photos.length > 0 && (
          <p className="text-safari-brown/60 text-sm">Todas as fotos foram carregadas</p>
        )}
      </div>

      {/* Contador de fotos */}
      <div className="text-center flex justify-center">
        <div className="bg-safari-cream-dark/50 rounded-full py-2 sm:py-3 px-4 sm:px-6">
          <p className="text-safari-brown font-semibold flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
            <span>🦁</span>
            <span>
              {photos.length} de {total} momento{total !== 1 ? 's' : ''}
            </span>
            <span>🦒</span>
          </p>
        </div>
      </div>

      {/* Modal de foto ampliada - Otimizado para mobile */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-safari-brown-dark/95 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-safari-cream flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Container da imagem */}
            <div className="flex-1 flex items-center justify-center bg-black/5 min-h-0 overflow-hidden">
              <img
                src={selectedPhoto.file_url}
                alt={selectedPhoto.file_name}
                className="max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain"
              />
            </div>

            {/* Info da foto */}
            <div className="p-3 sm:p-4 bg-safari-cream flex-shrink-0 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-safari-brown flex items-center gap-2 text-sm sm:text-base truncate">
                  <span>📸</span>
                  <span className="truncate">{selectedPhoto.file_name}</span>
                </p>
                <p className="text-xs sm:text-sm text-safari-brown/60">
                  {formatDate(selectedPhoto.created_at)}
                </p>
              </div>
              <button
                onClick={() => downloadSinglePhoto(selectedPhoto)}
                className="bg-safari-green text-white font-bold py-2 px-4 rounded-full hover:bg-safari-green-dark active:bg-safari-green-dark transition-colors flex items-center gap-1 text-sm shrink-0"
              >
                <span>⬇️</span>
                <span className="hidden sm:inline">Baixar</span>
              </button>
            </div>

            {/* Botao fechar - maior e mais acessivel em mobile */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-safari-brown text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl shadow-lg hover:bg-safari-brown-dark active:bg-safari-brown-dark transition-colors"
              aria-label="Fechar"
            >
              x
            </button>
          </div>
        </div>
      )}

      {/* Barra de ação flutuante - aparece quando há fotos selecionadas */}
      {selectionMode && selectedPhotos.size > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 bg-safari-brown text-white rounded-full px-4 sm:px-6 py-3 shadow-xl flex items-center gap-3 sm:gap-4">
          <span className="font-semibold text-sm sm:text-base">
            {selectedPhotos.size} foto{selectedPhotos.size !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => downloadSelectedPhotos(Array.from(selectedPhotos))}
            disabled={isDownloading}
            className="bg-safari-green px-4 py-2 rounded-full font-bold text-sm hover:bg-safari-green-dark active:bg-safari-green-dark transition-colors flex items-center gap-1"
          >
            <span>⬇️</span>
            <span>{isDownloading ? 'Baixando...' : 'Baixar ZIP'}</span>
          </button>
        </div>
      )}
    </>
  )
}

export default PhotoGallery
