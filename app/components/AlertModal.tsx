import { X } from "lucide-react"

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
}

export function AlertModal({ isOpen, onClose, message }: AlertModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl relative max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Alert</h2>
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

