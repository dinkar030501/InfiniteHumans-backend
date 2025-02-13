import { NextFunction, Request, Response } from 'express'
import fs from 'fs'

export const handleErrorAndRemoveFiles = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.handleErrorAndRemoveFiles = (statusCode: number, error: string) => {
        if (req.files) {
            // @ts-ignore
            Object.values(req.files)
                .flat()
                .forEach((file) => {
                    if (fs.existsSync(file.path)) {
                        try {
                            fs.unlinkSync(file.path)
                        } catch (error) {
                            console.error(error)
                        }
                    }
                })
        }
        return res.status(statusCode).json({ error })
    }

    next()
}
