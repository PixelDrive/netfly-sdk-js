// Schemas (types) derived from OpenAPI
export type ApiResult = {
    success: boolean;
    code: string;
    message: string;
};
export type DocumentFlow = 'in' | 'out';
export type DocumentTypeName =
    | 'PEPPOL_BIS_BILLING_UBL_INVOICE_V3'
    | 'PEPPOL_BIS_BILLING_UBL_CREDITNOTE_V3'
    | 'PEPPOL_INVOICE_RESPONSE_3'
    | 'PEPPOL_ORDER_TRANSACTION_3'
    | 'EN_16931_CII_INVOICE'
    | 'PEPPOL_MESSAGE_LEVEL_STATUS_1';
export type Participant = {
    name: string;
    country: string;
    participantId: string;
    participantScheme: string;
    participantPrefix: 'iso6523-actorid-upis';
    webURI?: string;
    contactType?: string;
    contactName?: string;
    contactPhone?: string;
    contactEmail: string;
    documentTypes: DocumentTypeName[];
};
export type ParticipantUpdateResult = ApiResult & {
    addedDocumentTypes?: DocumentTypeName[];
    deletedDocumentTypes?: DocumentTypeName[];
};
export type ParticipantDeleteResult = ApiResult & {
    deletedParticipantId?: number;
};
export type ParticipantLookupResult = {
    success: boolean;
    code: string;
    participantID: string;
    environment: 'digittest' | 'digitprod';
    exists: boolean;
    sml?: string;
    smpHostURI?: string;
    documentTypes: {
        documentTypeID: string;
        niceName?: string;
        state?: string;
        isDeprecated?: boolean;
    }[];
    queryDurations?: {
        helgerMillis?: number;
        smpToolMillis?: number;
    };
};
export type Webhook = {
    url: string;
    includeXmlPayload: boolean;
};
export type WebhookConfigResponse = {
    success: boolean;
    webhookUrl: string;
    includeXmlPayload: boolean;
    inputDate: string;
    webhookSecret: string;
};
export type DocumentsListItem = {
    id: number;
    inputDate?: string;
    clientNumber?: string;
    sender?: string;
    recipient?: string;
    documentId?: string;
    documentType?: string;
    documentVesid?: string;
    country?: string;
    status?: string;
    feedback?: string;
    retries?: number;
    lastTry?: string;
    fileName?: string;
    apMessage?: string;
};
export type NetflyClientOptions = {
    baseUrl?: string;
    apiKey?: string; // Bearer token
};
