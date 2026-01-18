import { Link } from 'react-router-dom';

export function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-blue-500">Login Arrival</h1>
        <p>Esta é a página pública.</p>
        
        <Link 
          to="/dashboard" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Entrar (Simular)
        </Link>
      </div>
    </div>
  );
}