import { ThemeProvider } from './contexts/ThemeContext'
import SearchUpload from './components/SearchUpload'
import { ThemeToggle } from './components/ThemeToggle'

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <header className="container mx-auto px-4 pt-8 pb-4">
          <div className="flex justify-end mb-8">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">Search and Upload</h1>
        </header>
        <main className="container mx-auto px-4">
          <SearchUpload />
        </main>
      </div>
    </ThemeProvider>
  )
}

