export function openURL(url: string) {
    const canOpenNewTab = window.open(url, '_blank')
  
    // if the browser blocks the new tab, open the url in the current tab
    if (!canOpenNewTab) {
      window.location.href = url
    }
  }
  