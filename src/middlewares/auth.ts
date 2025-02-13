import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

import { JWTPayload } from "@/types"
import { User } from "@/models/user"
import { COOKIE_NAME, COOKIE_OPTIONS } from "@/utils/constants"

export const authenticateUser = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token: string | undefined =
            req.cookies?.innfinexBackend ??
            req.headers.authorization?.split(" ")[1]

        if (!token) {
            return res.status(401).json({ error: "Token missing!" })
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            ) as JWTPayload

            const authUser = await User.findById(decoded.id)

            if (!authUser) {
                res.cookie(COOKIE_NAME, "", COOKIE_OPTIONS)
                return res.status(401).json({ error: "User not found!" })
            }

            req.authUser = authUser

            next()
        } catch (error) {
            return res.status(401).json({ error: "Token verification failed!" })
        }
    }
}
