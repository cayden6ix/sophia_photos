import { useState, useRef, useCallback } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface UploadedPhoto {
  url: string
  fileName: string
  error?: string
}

function PhotoUpload() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadedPhoto[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    )

    setSelectedFiles((prev) => [...prev, ...newFiles])

    newFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setUploading(true)
    setUploadResult([])

    const formData = new FormData()
    selectedFiles.forEach((file) => {
      formData.append('photos', file)
    })

    try {
      const response = await axios.post(`${API_URL}/photos/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setUploadResult(response.data.photos)
      setSelectedFiles([])
      setPreviews([])
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao enviar fotos. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0">
      {/* Area de Drop */}
      <div
        className={`relative border-3 sm:border-4 border-dashed rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-safari-sand bg-safari-sand/30 scale-[1.02]'
            : 'border-safari-brown/30 bg-white/60 hover:border-safari-green hover:bg-safari-cream-dark/50 active:bg-safari-cream-dark/60'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="space-y-3 sm:space-y-4">
          <div className="text-5xl sm:text-6xl animate-bounce">🦒</div>
          <h3 className="text-lg sm:text-2xl font-bold text-safari-brown px-2">
            Toque para adicionar fotos!
          </h3>
          <p className="text-safari-brown/60 text-sm sm:text-base px-2 hidden sm:block">
            ou arraste suas fotos para ca
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-safari-green hover:bg-safari-green-dark active:bg-safari-green-dark text-white font-bold py-3 px-6 sm:px-8 rounded-full shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 inline-flex items-center gap-2 text-sm sm:text-base"
          >
            <span>📷</span>
            Escolher Fotos
          </button>
        </div>

        {/* Animais decorativos - menores em mobile */}
        <div className="absolute -left-1 sm:-left-2 bottom-1 sm:bottom-2 text-2xl sm:text-3xl opacity-60">🐘</div>
        <div className="absolute -right-1 sm:-right-2 bottom-1 sm:bottom-2 text-2xl sm:text-3xl opacity-60">🦓</div>
      </div>

      {/* Preview das fotos selecionadas */}
      {previews.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <h3 className="text-lg sm:text-xl font-bold text-safari-brown mb-3 sm:mb-4 flex items-center gap-2">
            <span>🐵</span>
            <span className="truncate">Momentos capturados ({previews.length})</span>
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-4">
            {previews.map((preview, index) => (
              <div
                key={index}
                className="relative group rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg bg-white border-2 border-safari-cream-dark aspect-square"
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center font-bold shadow-lg text-sm sm:text-base"
                >
                  x
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-safari-brown/70 text-white text-[10px] sm:text-xs p-1 sm:p-2 truncate hidden sm:block">
                  {selectedFiles[index]?.name}
                </div>
              </div>
            ))}
          </div>

          {/* Botao de Upload */}
          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`w-full sm:w-auto py-3 sm:py-4 px-6 sm:px-12 rounded-full font-bold text-base sm:text-xl shadow-xl transform transition-all duration-200 inline-flex items-center justify-center gap-2 sm:gap-3 ${
                uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-safari-sand hover:bg-safari-sand-dark active:bg-safari-sand-dark text-safari-brown-dark hover:scale-105 active:scale-95'
              }`}
            >
              {uploading ? (
                <>
                  <span className="animate-spin">🔄</span>
                  <span className="text-sm sm:text-xl">Enviando...</span>
                </>
              ) : (
                <>
                  <span>🦁</span>
                  <span>Enviar {previews.length} foto{previews.length > 1 ? 's' : ''}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Resultado do Upload */}
      {uploadResult.length > 0 && (
        <div className="mt-6 sm:mt-8 bg-safari-cream-dark/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border-2 border-safari-green-light">
          <h3 className="text-lg sm:text-xl font-bold text-safari-green mb-3 sm:mb-4 flex items-center gap-2">
            <span>🎉</span>
            Fotos enviadas!
          </h3>
          <p className="text-safari-brown text-sm sm:text-base">
            {uploadResult.filter((r) => !r.error).length} foto(s) no album da Soso!
          </p>
          <a
            href="/galeria"
            className="inline-block mt-3 sm:mt-4 bg-safari-green text-white font-bold py-2 px-4 sm:px-6 rounded-full hover:bg-safari-green-dark active:bg-safari-green-dark transition-colors text-sm sm:text-base"
          >
            Ver Album 🖼️
          </a>
        </div>
      )}
    </div>
  )
}

export default PhotoUpload
