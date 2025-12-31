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
    <div className="max-w-4xl mx-auto">
      {/* Área de Drop */}
      <div
        className={`relative border-4 border-dashed rounded-3xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-safari-yellow bg-safari-yellow/20 scale-105'
            : 'border-safari-brown/40 bg-white/50 hover:border-safari-green'
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

        <div className="space-y-4">
          <div className="text-6xl animate-bounce">🦒</div>
          <h3 className="text-2xl font-bold text-safari-brown">
            Arraste suas fotos aqui!
          </h3>
          <p className="text-safari-brown/70">
            ou clique no botão abaixo para selecionar
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-safari-green hover:bg-safari-green-dark text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center gap-2"
          >
            <span>📷</span>
            Escolher Fotos
          </button>
        </div>

        {/* Animais decorativos */}
        <div className="absolute -left-4 bottom-0 text-4xl">🐘</div>
        <div className="absolute -right-4 bottom-0 text-4xl">🦓</div>
      </div>

      {/* Preview das fotos selecionadas */}
      {previews.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-safari-brown mb-4 flex items-center gap-2">
            <span>🐵</span>
            Fotos selecionadas ({previews.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div
                key={index}
                className="relative group rounded-2xl overflow-hidden shadow-lg bg-white"
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center font-bold shadow-lg"
                >
                  ×
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 truncate">
                  {selectedFiles[index]?.name}
                </div>
              </div>
            ))}
          </div>

          {/* Botão de Upload */}
          <div className="mt-6 text-center">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`py-4 px-12 rounded-full font-bold text-xl shadow-xl transform transition-all duration-200 inline-flex items-center gap-3 ${
                uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-safari-yellow hover:bg-safari-yellow-dark text-safari-brown hover:scale-105'
              }`}
            >
              {uploading ? (
                <>
                  <span className="animate-spin">🔄</span>
                  Enviando...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Enviar {previews.length} foto{previews.length > 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Resultado do Upload */}
      {uploadResult.length > 0 && (
        <div className="mt-8 bg-white/80 rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-safari-green mb-4 flex items-center gap-2">
            <span>✅</span>
            Upload concluído!
          </h3>
          <p className="text-safari-brown">
            {uploadResult.filter((r) => !r.error).length} foto(s) enviada(s) com
            sucesso!
          </p>
          <a
            href="/galeria"
            className="inline-block mt-4 bg-safari-green text-white font-bold py-2 px-6 rounded-full hover:bg-safari-green-dark transition-colors"
          >
            Ver na Galeria 🖼️
          </a>
        </div>
      )}
    </div>
  )
}

export default PhotoUpload
