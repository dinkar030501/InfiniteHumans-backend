import "module-alias/register" // For @ aliases support
import express, { Express, Request, Response } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
import fs from "fs"
import rateLimit from "express-rate-limit"
import morgan from "morgan"
import helmet from "helmet"
import dotenv from "dotenv"
dotenv.config()

import "reflect-metadata" // Required for typeORM

import { connectDB } from "@/config/dbConfig"
import { UPLOAD_FOLDER } from "@/types"
import { handleErrorAndRemoveFiles } from "@/middlewares/handleErrorAndRemoveFiles"
import { seedUser } from "@/seeders/users"

const app: Express = express()
const port = 4040

const CORS_DOMAINS = []

if (process.env.APP_MODE !== "PROD") {
    CORS_DOMAINS.push("http://localhost:3000")
}

const BASE_ROUTERS_DIR_PATH = path.join(__dirname, "routers")

const UPLOAD_FOLDERS = [
    path.join(__dirname, `../public/images/${UPLOAD_FOLDER.UPLOADS}/`),
]

const initializeRouters = () => {
    fs.readdirSync(BASE_ROUTERS_DIR_PATH).map(async (fileName) => {
        if (fileName.endsWith(".ts") || fileName.endsWith(".js")) {
            try {
                const routerFilePath = path.join(
                    BASE_ROUTERS_DIR_PATH,
                    fileName
                )
                const router = await import(routerFilePath)
                app.use("/api", router.default)
            } catch (error) {
                console.log(error)
            }
        }
    })
}

const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 300 requests per windowMs
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    handler: (req, res) => {
        res.status(429).json({
            message:
                "You are making too many requests. Please try again later.",
        })
    },
})

app.use(express.static(path.join(__dirname, "..", "public")))

app.use(cors({ origin: CORS_DOMAINS, credentials: true }))

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                // Default fallback for unlisted resource types
                defaultSrc: ["'self'"],
                // Allow images from our domains and data/blob URLs (for file previews)
                imgSrc: ["'self'", "data:", "blob:", ...CORS_DOMAINS],
            },
        },
        crossOriginResourcePolicy: { policy: "cross-origin" },
        crossOriginEmbedderPolicy: false,

        // Prevent click-jacking
        frameguard: { action: "deny" },
    })
)

app.disable("x-powered-by") // Hide the Powered by Express line

app.use(
    morgan(
        ":method | :url | :status | :res[content-length] - :response-time ms"
    )
)
app.use(rateLimiter)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(handleErrorAndRemoveFiles)

app.get("/", (_: Request, res: Response) => {
    res.status(200).send("Vehicle Distribution - Node.js + TypeScript Server")
})

connectDB().then(() => {
    console.log("Database initialized")

    initializeRouters()

    seedUser()

    console.log("Routers & seeders initialized")

    UPLOAD_FOLDERS.forEach((folderPath) => {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true })
        }
    })
    console.log("Upload folders created!")
})

app.listen(port, () => {
    console.log(`[SERVER]: Server is running at http://localhost:${port}`)
})
