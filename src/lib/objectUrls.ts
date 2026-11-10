const urls = new Map<string, string>()

export function registerFileUrl(id: string, file: File): string {
  const url = URL.createObjectURL(file)
  urls.set(id, url)
  return url
}

export function getFileUrl(id: string): string | undefined {
  return urls.get(id)
}
