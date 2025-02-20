import { Response, Request } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import { LoginValidator, ResetMyPasswordValidator, User, UserModel } from "@/models/user"
import { COOKIE_NAME, COOKIE_OPTIONS, JWT_EXPIRY } from "@/utils/constants"
import { asyncHandler } from "@/middlewares/asyncHandler"
import { JWTPayload } from "@/types"

class AuthController {
    login = asyncHandler(async (req: Request, res: Response) => {
        const parsedBody = LoginValidator.safeParse(req.body)
        if (!parsedBody.success) {
            return res.status(400).json({ error: parsedBody.error.issues[0].message })
        }

        const parsedData = parsedBody.data

        const user = await UserModel.findOne({ email: parsedData.email }).select(
            "+password"
        )

        if (!user) {
            return res.status(400).json({ error: "User not found!" })
        }

        const isPasswordCorrect = await bcrypt.compare(parsedData.password, user.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid password!" })
        }
        const jwtPayload: JWTPayload = { id: user.id, name: user.name }

        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
            expiresIn: JWT_EXPIRY,
        })

        res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)

        res.status(200).json({ success: true })
    })

    logout = asyncHandler(async (req: Request, res: Response) => {
        res.cookie(COOKIE_NAME, "", COOKIE_OPTIONS)
        return res.status(200).json({ success: true })
    })

    getLoggedInUser = asyncHandler(async (req: Request, res: Response) => {
        const token =
            req.cookies?.innfinexBackend ?? req.headers.authorization?.split(" ")[1]

        if (!token) {
            return res.status(400).json({ error: "Token missing!" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload

        const user = await UserModel.findById(decoded.id)

        if (!user) {
            return res.status(400).json({ error: "User not found!" })
        }

        return res.status(200).json(user)
    })

    resetMyPassword = asyncHandler(async (req: Request, res: Response) => {
        const parsedBody = ResetMyPasswordValidator.safeParse(req.body)
        if (!parsedBody.success) {
            return res.status(400).json({ error: parsedBody.error.issues[0].message })
        }

        const authUser = req.authUser as User

        const parsedData = parsedBody.data

        const user = await UserModel.findById(authUser.id)

        if (!user) {
            return res.status(400).json({ error: "User not found!" })
        }

        const hashedPassword = bcrypt.hashSync(parsedData.password, 10)
        user.password = hashedPassword

        await user.save()

        res.status(200).json({ success: true })
    })
}

export const authController = new AuthController()
