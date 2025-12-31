import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation()

  return (
    <header className="bg-safari-green shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Título */}
          <Link to="/" className="flex items-center gap-3">
            <div className="text-4xl">🦁</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-md">
                Safari das Fotos
              </h1>
              <p className="text-safari-yellow text-sm font-semibold">
                Sophia
              </p>
            </div>
          </Link>

          {/* Navegação */}
          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-full font-bold transition-all duration-200 flex items-center gap-2 ${
                location.pathname === '/'
                  ? 'bg-safari-yellow text-safari-brown shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <span>📸</span>
              <span className="hidden sm:inline">Enviar</span>
            </Link>
            <Link
              to="/galeria"
              className={`px-4 py-2 rounded-full font-bold transition-all duration-200 flex items-center gap-2 ${
                location.pathname === '/galeria'
                  ? 'bg-safari-yellow text-safari-brown shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <span>🖼️</span>
              <span className="hidden sm:inline">Galeria</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Decoração de grama */}
      <div className="h-4 bg-gradient-to-b from-safari-green to-safari-green-dark relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-6 flex justify-around">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-2 bg-green-600 rounded-t-full"
              style={{
                height: `${Math.random() * 12 + 8}px`,
                marginTop: 'auto',
              }}
            />
          ))}
        </div>
      </div>
    </header>
  )
}

export default Header
