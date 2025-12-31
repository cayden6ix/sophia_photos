import PhotoGallery from '../components/PhotoGallery'

function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título da página */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-safari-brown drop-shadow-sm">
          Galeria do Safari 🖼️
        </h2>
        <p className="text-safari-brown/70 mt-2 text-lg">
          Veja todas as fotos compartilhadas pelos amigos
        </p>
      </div>

      {/* Componente de Galeria */}
      <PhotoGallery />

      {/* Decoração de fundo */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none overflow-hidden">
        <div className="flex justify-between items-end px-4 pb-2">
          <div className="text-4xl md:text-6xl opacity-30">🌴</div>
          <div className="text-3xl md:text-5xl opacity-30">🌳</div>
          <div className="text-4xl md:text-6xl opacity-30">🌿</div>
          <div className="text-3xl md:text-5xl opacity-30">🌴</div>
          <div className="text-4xl md:text-6xl opacity-30">🌳</div>
        </div>
      </div>
    </div>
  )
}

export default GalleryPage
