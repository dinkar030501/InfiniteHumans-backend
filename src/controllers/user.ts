import { Request, Response } from "express"

import { InsertUserValidator, UpdateUserValidator } from "@/models/user"
import { asyncHandler } from "@/middlewares/asyncHandler"
import { User } from "@/models/user"

class UserController {
    getAllUsers = asyncHandler(async (req: Request, res: Response) => {
        const users = await User.find()
        return res.status(200).json(users)
    })

    addUser = asyncHandler(async (req: Request, res: Response) => {
        const parsedBody = InsertUserValidator.safeParse(req.body)
        if (!parsedBody.success) {
            return res
                .status(400)
                .json({ error: parsedBody.error.issues[0].message })
        }

        const parsedData = parsedBody.data

        const userEmailOrMobileNoExists = await User.findOne({
            $or: [
                { email: parsedData.email },
                { mobile_number: parsedData.mobile_no },
            ],
        })

        if (userEmailOrMobileNoExists) {
            const errorMsg =
                userEmailOrMobileNoExists.email === parsedData.email
                    ? "Email already exists!"
                    : "Mobile number already exists!"

            return res.status(400).json({ error: errorMsg })
        }

        const newUser = new User(parsedData)
        await newUser.save()

        const { password, ...userData } = newUser.toObject()

        res.status(200).json(userData)
    })

    updateUser = asyncHandler(async (req: Request, res: Response) => {
        const parsedBody = UpdateUserValidator.safeParse(req.body)
        if (!parsedBody.success) {
            return res
                .status(400)
                .json({ error: parsedBody.error.issues[0].message })
        }

        const parsedData = parsedBody.data

        const userEmailOrMobileNoExists = await User.findOne({
            _id: { $ne: parsedData.id },
            $or: [
                { email: parsedData.email },
                { mobile_number: parsedData.mobile_no },
            ],
        })

        if (userEmailOrMobileNoExists) {
            const errorMsg =
                userEmailOrMobileNoExists.email === parsedData.email
                    ? "Email already exists!"
                    : "Mobile number already exists!"

            return res.status(400).json({ error: errorMsg })
        }

        const updatedUser = await User.findByIdAndUpdate(
            parsedData.id,
            parsedData,
            { new: true }
        )

        res.status(200).json(updatedUser)
    })
}

export const userController = new UserController()
