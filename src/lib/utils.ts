import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatText(text: string): string {
  return text.trim().replace(/\s+/g, ' ')
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function downloadText(text: string, filename: string = 'transformed-text.txt'): void {
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function validateInput(text: string): { isValid: boolean; error?: string } {
  if (!text.trim()) {
    return { isValid: false, error: 'Please enter some text to transform' }
  }
  
  if (text.length > 10000) {
    return { isValid: false, error: 'Text is too long. Please limit to 10,000 characters.' }
  }
  
  return { isValid: true }
}

export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

export function getCharacterCount(text: string): number {
  return text.length
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const wordCount = getWordCount(text)
  return Math.ceil(wordCount / wordsPerMinute)
}

