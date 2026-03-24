import { Outlet, NavLink } from 'react-router-dom'

export default function Layout() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-amber-700 border-b-2 border-amber-700' : 'text-stone-600 hover:text-amber-700'
    }`

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-stone-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <NavLink to="/" className="group">
            <p className="text-xs text-stone-400 font-sans uppercase tracking-widest">Around the World in</p>
            <h1 className="font-serif text-2xl text-stone-800 leading-tight group-hover:text-amber-700 transition-colors">
              195 Dishes
            </h1>
          </NavLink>
          <nav className="flex gap-6 items-center">
            <NavLink to="/" end className={linkClass}>
              Recipes
            </NavLink>
            <NavLink to="/blog" className={linkClass}>
              Blog
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-stone-200 bg-white py-6 mt-12">
        <p className="text-center text-stone-400 text-sm font-sans">
          One country. One dish. One week at a time.
        </p>
      </footer>
    </div>
  )
}
