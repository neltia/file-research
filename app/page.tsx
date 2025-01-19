import { Navigation } from './components/Navigation'
import SearchUpload from './components/SearchUpload'
import { ThemeProvider } from './components/ThemeContext'

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <Navigation />
        <main className="container mx-auto px-4 pt-16">
          <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">Search and Upload</h1>
          <SearchUpload />
        </main>
      </div>
    </ThemeProvider>
  )
}

