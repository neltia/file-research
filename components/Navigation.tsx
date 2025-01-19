import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from './ThemeToggle'

export function Navigation() {
  return (
    <nav className="bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image src="/icon.ico" alt="Logo" width={32} height={32} />
            </Link>
          </div>
          <div className="flex items-center">
            <Link 
              href="/search-results" 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              최신 분석 결과
            </Link>
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

