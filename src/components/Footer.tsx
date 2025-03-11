export function Footer() {
    return (
      <footer className="bg-[#2c2c2c] text-gray-300 py-6 shadow-inner">
        {/* Centralização do texto principal */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col items-center space-y-4 font-extrabold">
          <p className="text-sm text-center">
            © {new Date().getFullYear()} LM Barbearia. Todos os direitos reservados.
          </p>
        </div>
  
        {/* Linha separadora e link do GitHub */}
        <div className="mt-4 border-t border-gray-300 dark:border-gray-700 pt-4 text-center text-xs text-gray-600 font-extrabold dark:text-gray-400">
          Desenvolvido por{' '}
          <a
            href="https://github.com/Bielhsn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline"
          >
            Gabriel Souza
          </a>
        </div>
      </footer>
    );
  }
  