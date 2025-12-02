"use client"

import { useEffect } from "react"

export function CodeBlockCopy() {
  useEffect(() => {
    const handleCopy = async (e: MouseEvent) => {
      const button = e.target as HTMLElement
      if (!button.classList.contains('copy-button')) return
      
      const wrapper = button.closest('.code-block-wrapper')
      if (!wrapper) return
      
      const codeElement = wrapper.querySelector('pre code')
      if (!codeElement) return
      
      const code = codeElement.textContent || ''
      
      try {
        await navigator.clipboard.writeText(code)
        
        // Visual feedback
        const originalText = button.textContent
        button.textContent = 'Copied!'
        button.classList.add('text-green-500')
        
        setTimeout(() => {
          button.textContent = originalText
          button.classList.remove('text-green-500')
        }, 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
        button.textContent = 'Failed'
        setTimeout(() => {
          button.textContent = 'Copy'
        }, 2000)
      }
    }

    document.addEventListener('click', handleCopy)
    return () => document.removeEventListener('click', handleCopy)
  }, [])

  return null
}
