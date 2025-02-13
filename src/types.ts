export enum UPLOAD_FOLDER {
    UPLOADS = "uploads",
}

export interface JWTPayload {
    id: string
    name: string
    iat?: number
    exp?: number
}
