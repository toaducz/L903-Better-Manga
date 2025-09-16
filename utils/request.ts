const BASE_URL = "https://api.mangadex.org"

export async function request<T, P extends Record<string, unknown> = Record<string, unknown>>(
  endpoint: string,
  method: 'GET' | 'POST',
  payload?: P,
  headers = {}
): Promise<T> {
  const searchParams = new URLSearchParams()

  if (method === 'GET' && payload) {
    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(val => searchParams.append(key, String(val)))
      } else {
        searchParams.append(key, String(value))
      }
    })
  }

  const url = `${BASE_URL}/${endpoint}?${searchParams.toString()}`

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      accept: '*/*',
      ...headers
    }
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Request failed: ${response.status} - ${errorBody}`)
  }

  return (await response.json()) as T
}
