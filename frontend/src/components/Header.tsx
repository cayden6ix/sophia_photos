import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation()

  return (
    <header className="bg-gradient-to-b from-safari-green to-safari-green-dark shadow-lg relative overflow-hidden">
      {/* Folhas decorativas no topo - escondidas em mobile pequeno */}
      <div className="absolute top-0 left-0 right-0 flex justify-between px-4 opacity-60 hidden xs:flex">
        <span className="text-lg sm:text-2xl">🌿</span>
        <span className="text-base sm:text-xl mt-1">🍃</span>
        <span className="text-lg sm:text-2xl">🌿</span>
        <span className="text-base sm:text-xl mt-2 hidden sm:block">🍃</span>
        <span className="text-lg sm:text-2xl hidden sm:block">🌿</span>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-5">
        <div className="flex items-center justify-between gap-2">
          {/* Logo e Titulo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-shrink">
            <div className="text-3xl sm:text-4xl md:text-5xl transform group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              🦁
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white drop-shadow-md tracking-wide truncate">
                Safari da Soso
              </h1>
              <p className="text-safari-sand text-xs sm:text-sm font-semibold flex items-center gap-1">
                <span className="text-xs hidden sm:inline">🌸</span>
                <span className="truncate">Cha de Bebe</span>
                <span className="text-xs hidden sm:inline">🌸</span>
              </p>
            </div>
          </Link>

          {/* Navegacao */}
          <nav className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Link
              to="/"
              className={`px-3 sm:px-4 py-2 rounded-full font-bold transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
                location.pathname === '/'
                  ? 'bg-safari-sand text-safari-brown-dark shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30 active:bg-white/40'
              }`}
            >
              <span>📸</span>
              <span className="hidden sm:inline">Enviar</span>
            </Link>
            <Link
              to="/galeria"
              className={`px-3 sm:px-4 py-2 rounded-full font-bold transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
                location.pathname === '/galeria'
                  ? 'bg-safari-sand text-safari-brown-dark shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30 active:bg-white/40'
              }`}
            >
              <span>🖼️</span>
              <span className="hidden sm:inline">Galeria</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Decoracao de grama/vegetacao */}
      <div className="h-4 sm:h-6 bg-gradient-to-b from-safari-green-dark to-safari-leaf relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="bg-safari-vine rounded-t-full"
              style={{
                width: `${Math.random() * 4 + 3}px`,
                height: `${Math.random() * 12 + 8}px`,
                opacity: 0.7 + Math.random() * 0.3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Animais decorativos nos cantos - apenas em telas maiores */}
      <div className="absolute bottom-8 left-4 text-2xl opacity-70 hidden lg:block">🐘</div>
      <div className="absolute bottom-8 right-4 text-2xl opacity-70 hidden lg:block">🦒</div>
    </header>
  )
}

export default Header
