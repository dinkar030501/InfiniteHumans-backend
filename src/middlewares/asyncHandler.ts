import { Request, Response } from 'express'
import fs from 'fs'
type ControllerFunction = (req: Request, res: Response) => Promise<any>

export const asyncHandler = (fn: ControllerFunction) => {
    return async (req: Request, res: Response) => {
        try {
            await fn(req, res)
        } catch (error) {
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
            console.error(error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }
}
