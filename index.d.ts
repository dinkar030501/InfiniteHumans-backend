import { Express } from "express-serve-static-core"

declare module "express-serve-static-core" {
    interface Response {
        handleErrorAndRemoveFiles: (statusCode: number, error: string) => void
    }
    interface Request {
        authUser: Object
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APP_MODE: "PROD" | "LOCAL"

            LOCAL_MONGODB_URI: string
            PROD_MONGODB_URI: string

            JWT_SECRET: string
        }
    }
}
