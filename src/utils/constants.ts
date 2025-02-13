export const COOKIE_NAME = "innfinexBackend"

export const JWT_EXPIRY = "1d" // 1 day

export const COOKIE_OPTIONS = {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: "none" as const,
    httpOnly: true,
    secure: true,
}

export const FILE_SIZE_LIMIT = {
    pdf: 1024 * 1024 * 5, // 5 MB
    image: 1024 * 1024 * 3, // 3 MB
}

export const ALLOWED_MIME_TYPES = {
    image: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    pdf: ["application/pdf"],
}
