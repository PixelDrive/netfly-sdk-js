export type NetflyClientOptions = {
  baseUrl?: string
  apiKey?: string
}

export class NetflyClient {
  readonly baseUrl: string
  readonly apiKey?: string

  constructor(options: NetflyClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? 'https://api.netfly.example'
    this.apiKey = options.apiKey
  }
}

export function createClient(options: NetflyClientOptions = {}): NetflyClient {
  return new NetflyClient(options)
}

// Default export for convenience in some import styles
export default {
  NetflyClient,
  createClient,
}
