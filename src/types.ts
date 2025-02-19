export enum UPLOAD_FOLDER {
    UPLOADS = "uploads",
}

export interface JWTPayload {
    id: string
    name: string
    iat?: number
    exp?: number
}

export enum JobCommitment {
    PART_TIME = "part-time",
    FULL_TIME = "full-time",
    FREELANCE = "freelance",
    CONTRACT = "contract",
}
