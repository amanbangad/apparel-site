/**
 * Utility to hash strings with SHA-256 for Meta Pixel advanced matching.
 * Meta requires SHA-256 hashing (not base64) for email, phone, etc.
 */

export async function sha256Hex(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}
