'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AnalysisResultsList from '../components/AnalysisResultsList'
import SkeletonUI from '@/components/SkeletonUI'

function SearchResults() {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState([])
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const query = searchParams.get('query')

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query || '')}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setResults(data.results)
      } catch (error) {
        console.error('Error fetching results:', error)
        setError('An error occurred while fetching search results. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-8">Search Results</h1>
      {loading ? (
        <SkeletonUI />
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : results.length > 0 ? (
        <AnalysisResultsList results={results} />
      ) : (
        <p className="text-center">No results found.</p>
      )}
    </div>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<SkeletonUI />}>
      <SearchResults />
    </Suspense>
  )
}

