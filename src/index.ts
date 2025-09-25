/****
 * Unofficial Netfly Peppol SDK client
 * Implements methods based on the provided OpenAPI description.
 * Note: Requires a bearer token (apiKey) from your OAuth2 flow.
 */

// Basic error type surfaced by the SDK for non-2xx responses
export class NetflyApiError extends Error {
    readonly status: number
    readonly code?: string
    readonly responseBody?: unknown

    constructor(message: string, status: number, code?: string, responseBody?: unknown) {
        super(message)
        this.name = 'NetflyApiError'
        this.status = status
        this.code = code
        this.responseBody = responseBody
    }
}

// Schemas (types) derived from OpenAPI
export type ApiResult = {
    success: boolean
    code: string
    message: string
}

export type DocumentFlow = 'in' | 'out'

export type DocumentTypeName =
    | 'PEPPOL_BIS_BILLING_UBL_INVOICE_V3'
    | 'PEPPOL_BIS_BILLING_UBL_CREDITNOTE_V3'
    | 'PEPPOL_INVOICE_RESPONSE_3'
    | 'PEPPOL_ORDER_TRANSACTION_3'
    | 'EN_16931_CII_INVOICE'
    | 'PEPPOL_MESSAGE_LEVEL_STATUS_1'

export type Participant = {
    name: string
    country: string
    participantId: string
    participantScheme: string
    participantPrefix: 'iso6523-actorid-upis'
    webURI?: string
    contactType?: string
    contactName?: string
    contactPhone?: string
    contactEmail: string
    documentTypes: DocumentTypeName[]
}

export type ParticipantUpdateResult = ApiResult & {
    addedDocumentTypes?: DocumentTypeName[]
    deletedDocumentTypes?: DocumentTypeName[]
}

export type ParticipantDeleteResult = ApiResult & {
    deletedParticipantId?: number
}

export type ParticipantLookupResult = {
    success: boolean
    code: string
    participantID: string
    environment: 'digittest' | 'digitprod'
    exists: boolean
    sml?: string
    smpHostURI?: string
    documentTypes: {
        documentTypeID: string
        niceName?: string
        state?: string
        isDeprecated?: boolean
    }[]
    queryDurations?: {
        helgerMillis?: number
        smpToolMillis?: number
    }
}

export type Webhook = {
    url: string
    includeXmlPayload: boolean
}

export type WebhookConfigResponse = {
    success: boolean
    webhookUrl: string
    includeXmlPayload: boolean
    inputDate: string
    webhookSecret: string
}

export type DocumentsListItem = {
    id: number
    inputDate?: string
    clientNumber?: string
    sender?: string
    recipient?: string
    documentId?: string
    documentType?: string
    documentVesid?: string
    country?: string
    status?: string
    feedback?: string
    retries?: number
    lastTry?: string
    fileName?: string
    apMessage?: string
}

export type NetflyClientOptions = {
    baseUrl?: string
    apiKey?: string // Bearer token
}

export class NetflyClient {
    readonly baseUrl: string
    readonly apiKey?: string

    constructor(options: NetflyClientOptions = {}) {
        // Default to staging server per spec
        this.baseUrl = options.baseUrl ?? 'https://peppol2.netfly.be/netfly'
        this.apiKey = options.apiKey
    }

    // POST /sendDocument (XML -> JSON ApiResult)
    sendDocument(xml: string): Promise<ApiResult> {
        const url = this.buildUrl('/sendDocument')
        return this.requestJSON<ApiResult>(url, {
            method: 'POST',
            headers: this.buildHeaders({'Content-Type': 'application/xml'}),
            body: xml,
        })
    }

    // GET /documentsList
    documentsList(params: { startDate: string; endDate: string; flow: DocumentFlow }): Promise<DocumentsListItem[]> {
        const url = this.buildUrl('/documentsList', params)
        return this.requestJSON<DocumentsListItem[]>(url, {method: 'GET', headers: this.buildHeaders()})
    }

    // GET /receiveDocument -> XML string
    receiveDocument(docId: number, flow: DocumentFlow): Promise<string> {
        const url = this.buildUrl('/receiveDocument', {docId, flow})
        return this.requestText(url, {method: 'GET', headers: this.buildHeaders()})
    }

    // POST /participantManagement
    createParticipant(participant: Participant): Promise<ApiResult> {
        const url = this.buildUrl('/participantManagement')
        return this.requestJSON<ApiResult>(url, {
            method: 'POST',
            headers: this.buildHeaders({'Content-Type': 'application/json'}),
            body: JSON.stringify(participant),
        })
    }


    // ========== Endpoints ==========

    // PUT /participantManagement
    updateParticipant(participant: Participant): Promise<ParticipantUpdateResult> {
        const url = this.buildUrl('/participantManagement')
        return this.requestJSON<ParticipantUpdateResult>(url, {
            method: 'PUT',
            headers: this.buildHeaders({'Content-Type': 'application/json'}),
            body: JSON.stringify(participant),
        })
    }

    // DELETE /participantManagement?id=...
    deleteParticipant(id: number): Promise<ParticipantDeleteResult> {
        const url = this.buildUrl('/participantManagement', {id})
        return this.requestJSON<ParticipantDeleteResult>(url, {method: 'DELETE', headers: this.buildHeaders()})
    }

    // GET /participantsList
    participantsList(filters?: Partial<Pick<Participant, 'name' | 'contactName' | 'contactEmail' | 'participantId'>>): Promise<Participant[]> {
        const url = this.buildUrl('/participantsList', filters as any)
        return this.requestJSON<Participant[]>(url, {method: 'GET', headers: this.buildHeaders()})
    }

    // GET /participantLookup?scheme=...&participant_id=...
    participantLookup(scheme: string, participantId: string): Promise<ParticipantLookupResult> {
        const url = this.buildUrl('/participantLookup', {scheme, participant_id: participantId})
        return this.requestJSON<ParticipantLookupResult>(url, {method: 'GET', headers: this.buildHeaders()})
    }

    // POST /webhook
    async setWebhook(config: Webhook): Promise<void> {
        const url = this.buildUrl('/webhook')
        await this.requestJSON<any>(url, {
            method: 'POST',
            headers: this.buildHeaders({'Content-Type': 'application/json'}),
            body: JSON.stringify(config),
        })
    }

    // GET /webhook
    getWebhook(): Promise<WebhookConfigResponse> {
        const url = this.buildUrl('/webhook')
        return this.requestJSON<WebhookConfigResponse>(url, {method: 'GET', headers: this.buildHeaders()})
    }

    // DELETE /webhook
    async deleteWebhook(): Promise<void> {
        const url = this.buildUrl('/webhook')
        await this.requestJSON<any>(url, {method: 'DELETE', headers: this.buildHeaders()})
    }

    // POST /validate/{vesid} (XML -> JSON passthrough)
    validate(vesid: string, xml: string): Promise<Record<string, unknown>> {
        const url = this.buildUrl(`/validate/${encodeURIComponent(vesid)}`)
        return this.requestJSON<Record<string, unknown>>(url, {
            method: 'POST',
            headers: this.buildHeaders({'Content-Type': 'application/xml'}),
            body: xml,
        })
    }

    // Utilities
    private buildHeaders(extra?: Record<string, string>): Record<string, string> {
        const headers: Record<string, string> = {...extra}
        if (this.apiKey) headers['Authorization'] = `Bearer ${this.apiKey}`
        return headers
    }

    private buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>): string {
        const url = new URL(path.replace(/^\//, ''), this.baseUrl.endsWith('/') ? this.baseUrl : this.baseUrl + '/')
        if (query) {
            for (const [k, v] of Object.entries(query)) {
                if (v !== undefined && v !== null) url.searchParams.append(k, String(v))
            }
        }
        return url.toString()
    }

    // Note: avoid depending on lib DOM types; type the init as any for portability
    private async requestJSON<T>(input: string, init?: any): Promise<T> {
        const res: Response = await (globalThis as any).fetch(input, init)
        const contentType = res.headers.get('content-type') ?? ''
        if (!res.ok) {
            let body: any = undefined
            try {
                body = contentType.includes('application/json') ? await res.json() : await res.text()
            } catch (e: unknown) {
                console.error(e)
            }
            const code = body && typeof body === 'object' ? (body.code as string | undefined) : undefined
            const message = body && typeof body === 'object' && body.message ? (body.message as string) : res.statusText
            throw new NetflyApiError(message, res.status, code, body)
        }
        if (contentType.includes('application/json')) return (await res.json()) as T
        // Fallback if server returns 200 without content-type
        return (await res.json()) as T
    }

    private async requestText(input: string, init?: any): Promise<string> {
        const res: Response = await (globalThis as any).fetch(input, init)
        const contentType = res.headers.get('content-type') ?? ''
        const text = await res.text()
        if (!res.ok) {
            let body: any = undefined
            try {
                body = contentType.includes('application/json') ? JSON.parse(text) : text
            } catch {
                body = text
            }
            const code = body && typeof body === 'object' ? (body.code as string | undefined) : undefined
            const message = body && typeof body === 'object' && body.message ? (body.message as string) : res.statusText
            throw new NetflyApiError(message, res.status, code, body)
        }
        return text
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
