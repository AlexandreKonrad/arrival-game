import { Link } from 'react-router-dom';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard Arrival 🚀</h1>
          <Link to="/" className="text-red-500 hover:underline">
            Sair
          </Link>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p>Se você está vendo isso, o Roteamento funcionou!</p>
          <p className="mt-2 text-sm text-gray-500">Aqui ficará o jogo.</p>
        </div>
      </div>
    </div>
  );
}