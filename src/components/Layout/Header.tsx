import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IV</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Informed Vote</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/about"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
            <Link
              to="/methodology"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Methodology
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
