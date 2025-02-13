import fs from "fs"

import { UPLOAD_FOLDER } from "@/types"

export const fileRemover = async (
    dest: UPLOAD_FOLDER,
    fileName: string | null
) => {
    const filePath = `./public/images/${dest}/${fileName}`
    if (fileName && fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath)
        } catch (error) {
            console.error(error)
        }
    }
}

export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000)
}

export const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
}
