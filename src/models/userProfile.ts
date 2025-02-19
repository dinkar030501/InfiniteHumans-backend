import { JobCommitment } from "@/types"
import mongoose, { Schema, Document } from "mongoose"
import { z } from "zod"

export const UpdateUserProfileValidator = z.object({
    user_id: z.string({
        invalid_type_error: "User ID must be a string!",
        required_error: "User ID is required!",
    }),
    // profile_picture: z.string({
    //     invalid_type_error: "Profile picture must be a string!",
    //     required_error: "Profile picture is required!",
    // }),
    country: z.string({
        invalid_type_error: "Country must be a string!",
        required_error: "Country is required!",
    }),
    about: z.string({
        invalid_type_error: "About must be a string!",
        required_error: "About is required!",
    }),
    github_url: z.string({
        invalid_type_error: "Github URL must be a string!",
        required_error: "Github URL is required!",
    }),
    linkedin_url: z.string({
        invalid_type_error: "Linkedin URL must be a string!",
        required_error: "Linkedin URL is required!",
    }),
    x_url: z.string({
        invalid_type_error: "X URL must be a string!",
        required_error: "X URL is required!",
    }),
    website_url: z.string({
        invalid_type_error: "Website URL must be a string!",
        required_error: "Website URL is required!",
    }),
    skills: z.string().array(),
    experience: z
        .object({
            company_name: z.string(),
            designation: z.string(),
            start_date: z.date(),
            end_date: z.date().nullable(),
            description: z.string(),
            pursuing: z.boolean(),
        })
        .array(),
    education: z
        .object({
            college_name: z.string(),
            degree: z.string(),
            start_date: z.date(),
            end_date: z.date().nullable(),
            pursuing: z.boolean(),
        })
        .array(),
    commitment: z.nativeEnum(JobCommitment, {
        invalid_type_error: "Commitment must be a valid job commitment!",
        required_error: "Commitment is required!",
    }),
    resume_url: z.string(),
})

export interface UserProfile extends Document {
    user_id: string
    // profile_picture: string
    country: string
    about: string
    github_url: string
    linkedin_url: string
    x_url: string
    website_url: string

    skills: string[]

    experience: {
        company_name: string
        designation: string
        start_date: Date
        end_date: Date | null
        description: string
        pursuing: boolean
    }[]

    education: {
        college_name: string
        degree: string
        start_date: Date
        end_date: Date | null
        pursuing: boolean
    }[]

    commitment: JobCommitment

    resume_url: string
}

const userProfileSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
        // profile_picture: {
        //     type: String,
        //     required: [true, "Profile picture is required"],
        // },
        country: {
            type: String,
            required: [true, "Country is required"],
        },
        about: {
            type: String,
            required: [true, "About is required"],
        },
        github_url: {
            type: String,
            required: [true, "Github URL is required"],
        },
        linkedin_url: {
            type: String,
            required: [true, "Linkedin URL is required"],
        },
        x_url: {
            type: String,
            required: [true, "X URL is required"],
        },
        website_url: {
            type: String,
            required: [true, "Website URL is required"],
        },
        skills: {
            type: [String],
            required: [true, "Skills are required"],
        },
        experience: {
            type: [
                {
                    company_name: String,
                    designation: String,
                    start_date: Date,
                    end_date: { type: Date, default: null },
                    description: String,
                    pursuing: { type: Boolean, default: false },
                },
            ],
        },
        education: {
            type: [
                {
                    college_name: String,
                    degree: String,
                    start_date: Date,
                    end_date: { type: Date, default: null },
                    pursuing: { type: Boolean, default: false },
                },
            ],
        },
        commitment: {
            type: String,
            enum: ["part-time", "full-time", "freelance"],
            required: [true, "Commitment is required"],
        },
        resume_url: {
            type: String,
            required: [true, "Resume URL is required"],
        },
    },
    { timestamps: true }
)

export const UserProfileModel = mongoose.model<UserProfile>(
    "UserProfile",
    userProfileSchema
)
