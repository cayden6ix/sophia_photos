import PhotoGallery from '../components/PhotoGallery'

function GalleryPage() {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 pb-20 sm:pb-24">
      {/* Titulo da pagina */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex justify-center gap-2 mb-2">
          <span className="text-2xl sm:text-3xl">📸</span>
          <span className="text-2xl sm:text-3xl">🖼️</span>
          <span className="text-2xl sm:text-3xl">💚</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-safari-brown drop-shadow-sm px-2">
          Álbum do Safari da Soso
        </h2>
        <p className="text-safari-brown/70 mt-2 sm:mt-3 text-sm sm:text-lg max-w-2xl mx-auto px-4">
          Reviva os momentos magicos registrados pelos amigos e familiares da Sophia!
        </p>
        <div className="flex justify-center gap-1 mt-2">
          <span className="text-base sm:text-xl">🍃</span>
          <span className="text-base sm:text-xl">🌸</span>
          <span className="text-base sm:text-xl">🍃</span>
        </div>
      </div>

      {/* Componente de Galeria */}
      <PhotoGallery />

      {/* Decoracao de fundo com tema safari bebe - menor em mobile */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none overflow-hidden">
        <div className="flex justify-between items-end px-2 sm:px-4 pb-1 sm:pb-2">
          <div className="text-2xl sm:text-4xl md:text-6xl opacity-15 sm:opacity-20">🌴</div>
          <div className="text-xl sm:text-3xl md:text-4xl opacity-10 sm:opacity-15 hidden xs:block">🦁</div>
          <div className="text-2xl sm:text-4xl md:text-6xl opacity-15 sm:opacity-20">🌳</div>
          <div className="text-xl sm:text-3xl md:text-4xl opacity-10 sm:opacity-15 hidden xs:block">🦒</div>
          <div className="text-2xl sm:text-4xl md:text-6xl opacity-15 sm:opacity-20">🌴</div>
        </div>
      </div>
    </div>
  )
}

export default GalleryPage
