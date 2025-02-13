import mongoose, { Schema, Document } from "mongoose"
import { z } from "zod"
import bcrypt from "bcrypt"

export const LoginValidator = z.object({
    email: z.string({
        invalid_type_error: "Email must be a string!",
        required_error: "Email is required!",
    }),
    password: z.string({
        invalid_type_error: "Password must be a string!",
        required_error: "Password is required!",
    }),
})

export const InsertUserValidator = z.object({
    name: z.string({
        invalid_type_error: "Name must be a string!",
        required_error: "Name is required!",
    }),
    email: z.string({
        invalid_type_error: "Email must be a string!",
        required_error: "Email is required!",
    }),
    mobile_no: z.string({
        invalid_type_error: "Mobile number must be a string!",
        required_error: "Mobile number is required!",
    }),
    password: z.string({
        invalid_type_error: "Password must be a string!",
        required_error: "Password is required!",
    }),
})

export const UpdateUserValidator = InsertUserValidator.extend({
    id: z.number({
        invalid_type_error: "Id must be a number!",
        required_error: "Id is required!",
    }),
})

export const ResetMyPasswordValidator = z.object({
    password: z.string({
        invalid_type_error: "Password must be a string!",
        required_error: "Password is required!",
    }),
})

export interface User extends Document {
    name: string
    email: string
    mobile_number: string
    password: string
}

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [
                /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                "Please enter a valid email address",
            ],
        },
        mobile_number: {
            type: String,
            required: [true, "Mobile number is required"],
            unique: true,
            match: [
                /^[0-9]{10}$/,
                "Please enter a valid 10-digit mobile number",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },
    },
    { timestamps: true }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error: any) {
        next(error)
    }
})

export const User = mongoose.model<User>("User", userSchema)
