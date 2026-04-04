import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">

      {/* HERO */}
      <section className="bg-white px-8 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-primary-light text-primary text-sm font-medium px-4 py-1 rounded-full mb-6">
            Sin sorpresas duplicadas 🎁
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary leading-tight mb-6">
            La forma más fácil de pedir lo que realmente quieres
          </h1>
          <p className="text-xl text-text-secondary mb-10 leading-relaxed">
            Crea tu lista de regalos, compártela con quien quieras y deja que tus seres queridos reserven sin spoilers. Sin duplicados, sin sorpresas arruinadas.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors duration-200 text-lg"
              >
                Ir a mis listas →
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors duration-200 text-lg"
                >
                  Crear mi lista gratis
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white text-text-primary font-medium rounded-lg border border-border hover:bg-bg transition-colors duration-200 text-lg"
                >
                  Iniciar sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="bg-bg px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Tan fácil como 1, 2, 3
            </h2>
            <p className="text-text-secondary text-lg">
              Sin complicaciones. Sin registros obligatorios para ver tu lista.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border border-border p-8 text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-text-primary mb-3">1. Crea tu lista</h3>
              <p className="text-text-secondary">
                Añade los productos que deseas con enlaces a diferentes tiendas y sus precios para que puedan elegir dónde comprarlo.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-border p-8 text-center">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-bold text-text-primary mb-3">2. Comparte el enlace</h3>
              <p className="text-text-secondary">
                Comparte tu lista con un enlace único. Cualquiera puede verla sin necesidad de registrarse.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-border p-8 text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-text-primary mb-3">3. Sin duplicados</h3>
              <p className="text-text-secondary">
                Tus seres queridos reservan los productos que van a regalar. Así nadie regala lo mismo dos veces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section className="bg-white px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-text-secondary text-lg">
              Diseñado para que regalar sea una experiencia sin estrés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-6 rounded-xl border border-border">
              <span className="text-2xl">🛍️</span>
              <div>
                <h3 className="font-bold text-text-primary mb-1">Compara precios</h3>
                <p className="text-text-secondary text-sm">Añade el mismo producto en varias tiendas para que puedan elegir dónde comprarlo más barato.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-xl border border-border">
              <span className="text-2xl">🎭</span>
              <div>
                <h3 className="font-bold text-text-primary mb-1">Modo sorpresa</h3>
                <p className="text-text-secondary text-sm">Activa el modo sorpresa y sabrás que tus regalos están reservados sin saber quién te los va a dar.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-xl border border-border">
              <span className="text-2xl">🔒</span>
              <div>
                <h3 className="font-bold text-text-primary mb-1">Reservas protegidas</h3>
                <p className="text-text-secondary text-sm">Cada producto solo puede ser reservado por una persona. Sin duplicados garantizado.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-xl border border-border">
              <span className="text-2xl">📱</span>
              <div>
                <h3 className="font-bold text-text-primary mb-1">Desde cualquier dispositivo</h3>
                <p className="text-text-secondary text-sm">Accede y gestiona tus listas desde el móvil, tablet o escritorio sin perder ningún detalle.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-xl border border-border">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="font-bold text-text-primary mb-1">Múltiples listas</h3>
                <p className="text-text-secondary text-sm">Crea listas para cada ocasión: cumpleaños, Navidad, boda... todas organizadas en un solo lugar.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-xl border border-border">
              <span className="text-2xl">✨</span>
              <div>
                <h3 className="font-bold text-text-primary mb-1">Gratis y sin complicaciones</h3>
                <p className="text-text-secondary text-sm">Regístrate en segundos y empieza a crear tus listas sin necesidad de tarjeta de crédito.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-primary px-8 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para recibir los regalos que realmente quieres?
          </h2>
          <p className="text-primary-light text-lg mb-10">
            Únete a miles de personas que ya usan WishList App para organizar sus listas de regalos.
          </p>
          {user ? (
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-white text-primary font-medium rounded-lg hover:bg-primary-light transition-colors duration-200 text-lg inline-block"
            >
              Ir a mis listas →
            </Link>
          ) : (
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-primary font-medium rounded-lg hover:bg-primary-light transition-colors duration-200 text-lg inline-block"
            >
              Crear mi lista gratis →
            </Link>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-border px-8 py-8">
        <div className="flex items-center justify-between">
          <p className="text-text-secondary text-sm">
            © 2026 WishList App. Hecho con ❤️
          </p>
          <div className="flex gap-6">
            <Link to="/login" className="text-text-secondary text-sm hover:text-text-primary transition-colors duration-200">
              Iniciar sesión
            </Link>
            <Link to="/register" className="text-text-secondary text-sm hover:text-text-primary transition-colors duration-200">
              Registrarse
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}