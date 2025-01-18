import Link from 'next/link'
import SearchUpload from './components/SearchUpload'
import { ThemeToggle } from './components/ThemeToggle'
import { ThemeProvider } from './contexts/ThemeContext'

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <header className="container mx-auto px-4 pt-8 pb-4">
          <div className="flex justify-between items-center mb-8">
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/" className="text-blue-500 hover:text-blue-600">Home</Link>
                </li>
                <li>
                  <Link href="/search-results" className="text-blue-500 hover:text-blue-600">Results</Link>
                </li>
              </ul>
            </nav>
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">File Research</h1>
        </header>
        <main className="container mx-auto px-4">
          <SearchUpload />
        </main>
      </div>
    </ThemeProvider>
  )
}

