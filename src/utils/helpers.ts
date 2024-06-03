export function openURL(url: string) {
  const canOpenNewTab = window.open(url, '_blank')

  // if the browser blocks the new tab, open the url in the current tab
  if (!canOpenNewTab) {
    window.location.href = url
  }
}
export async function writeToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
    console.log('Text copied to clipboard:', text)
  } catch (err) {
    console.error('Failed to write to clipboard:', err)
    throw err
  }
}
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  } as T
}
