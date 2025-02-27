/**
 * A simple implementation to generate unique IDs for Edge runtime
 * Uses Web Crypto API which is available in Edge environments
 */
export function nanoid(size: number = 21): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let id = ""

  // Crypto API for more secure random values when available
  if (typeof crypto !== "undefined") {
    const bytes = new Uint8Array(size)
    crypto.getRandomValues(bytes)

    for (let i = 0; i < size; i++) {
      id += alphabet[bytes[i] % alphabet.length]
    }
    return id
  }

  // Fallback to Math.random() if crypto is not available
  for (let i = 0; i < size; i++) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)]
  }

  return id
}
