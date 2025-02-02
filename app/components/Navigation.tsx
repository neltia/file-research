'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from './ThemeContext'
import { ThemeToggle } from './ThemeToggle'

export function Navigation() {
  const { isDarkMode } = useTheme()

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image
                src={isDarkMode ? "/logo_dark.png" : "/logo_light.png"}
                alt="Logo"
                width={64}
                height={64}
              />
            </Link>
            <Link href="/" className="text-xl font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-200">
              Anlay-Pix
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              href="/recent"
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

