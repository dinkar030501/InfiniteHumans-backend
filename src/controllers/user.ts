import { Request, Response } from "express"

import { InsertUserValidator, UpdateUserValidator, UserModel } from "@/models/user"
import { asyncHandler } from "@/middlewares/asyncHandler"
import { UpdateUserProfileValidator, UserProfileModel } from "@/models/userProfile"
import mongoose from "mongoose"

class UserController {
    getAllUsers = asyncHandler(async (req: Request, res: Response) => {
        const users = await UserModel.find()
        return res.status(200).json(users)
    })

    addUser = asyncHandler(async (req: Request, res: Response) => {
        const parsedBody = InsertUserValidator.safeParse(req.body)
        if (!parsedBody.success) {
            return res.status(400).json({ error: parsedBody.error.issues[0].message })
        }

        const parsedData = parsedBody.data

        const userEmailOrMobileNoExists = await UserModel.findOne({
            $or: [
                { email: parsedData.email },
                { mobile_number: parsedData.mobile_number },
            ],
        })

        if (userEmailOrMobileNoExists) {
            const errorMsg =
                userEmailOrMobileNoExists.email === parsedData.email
                    ? "Email already exists!"
                    : "Mobile number already exists!"

            return res.status(400).json({ error: errorMsg })
        }

        const newUser = new UserModel(parsedData)
        await newUser.save()

        const { password, ...userData } = newUser.toObject()

        res.status(200).json(userData)
    })

    updateUser = asyncHandler(async (req: Request, res: Response) => {
        const parsedBody = UpdateUserValidator.safeParse(req.body)
        if (!parsedBody.success) {
            return res.status(400).json({ error: parsedBody.error.issues[0].message })
        }

        const parsedData = parsedBody.data

        const userEmailOrMobileNoExists = await UserModel.findOne({
            _id: { $ne: parsedData.id },
            $or: [
                { email: parsedData.email },
                { mobile_number: parsedData.mobile_number },
            ],
        })

        if (userEmailOrMobileNoExists) {
            const errorMsg =
                userEmailOrMobileNoExists.email === parsedData.email
                    ? "Email already exists!"
                    : "Mobile number already exists!"

            return res.status(400).json({ error: errorMsg })
        }

        const updatedUser = await UserModel.findByIdAndUpdate(parsedData.id, parsedData, {
            new: true,
        })

        res.status(200).json(updatedUser)
    })

    // User Profile APIs

    getUserProfileByUserId = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" })
        }

        const userProfile = await UserProfileModel.findOne({
            user_id: new mongoose.Types.ObjectId(userId),
        })

        if (!userProfile) {
            return res.status(404).json({ error: "User profile not found" })
        }

        return res.status(200).json(userProfile)
    })

    updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
        const parsedBody = UpdateUserProfileValidator.safeParse(req.body)
        if (!parsedBody.success) {
            return res.status(400).json({ error: parsedBody.error.issues[0].message })
        }

        const parsedData = parsedBody.data

        const userProfile = await UserProfileModel.findOne({
            user_id: new mongoose.Types.ObjectId(parsedData.user_id),
        })

        if (!userProfile) {
            return res.status(404).json({ error: "User profile not found" })
        }

        const updatedUserProfile = await UserProfileModel.findByIdAndUpdate(
            userProfile._id,
            parsedData,
            { new: true }
        )

        return res.status(200).json(updatedUserProfile)
    })
}

export const userController = new UserController()
