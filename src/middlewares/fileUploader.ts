import { NextFunction, Request, Response } from 'express'
import multer from 'multer'

import { UPLOAD_FOLDER } from '@/types'
import { FILE_SIZE_LIMIT } from '@/utils/constants'
import { ALLOWED_MIME_TYPES } from '@/utils/constants'

const FILE_TYPE_ERRORS = {
    image: 'Only JPEG, JPG, WEBP & PNG allowed!',
    pdf: 'Only PDF is allowed!',
    image_or_pdf: 'Only PDF, JPEG, JPG, WEBP & PNG is allowed!',
}

const multerConfig = (dest: UPLOAD_FOLDER, type: 'IMAGE' | 'PDF' | 'IMAGE_OR_PDF') => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./public/images/${dest}`)
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)
        },
    })

    let fileSizeLimit = FILE_SIZE_LIMIT.image
    let validMimeTypes = ALLOWED_MIME_TYPES.image
    let errorMsg = FILE_TYPE_ERRORS.image

    if (type === 'PDF') {
        fileSizeLimit = FILE_SIZE_LIMIT.pdf
        validMimeTypes = ALLOWED_MIME_TYPES.pdf
        errorMsg = FILE_TYPE_ERRORS.pdf
    } else if (type === 'IMAGE_OR_PDF') {
        fileSizeLimit = FILE_SIZE_LIMIT.pdf
        validMimeTypes = [...ALLOWED_MIME_TYPES.image, ...ALLOWED_MIME_TYPES.pdf]
        errorMsg = FILE_TYPE_ERRORS.image_or_pdf
    }

    const upload = multer({
        storage,
        fileFilter: function (req, file, cb) {
            if (!validMimeTypes.includes(file.mimetype)) {
                return cb(new Error(errorMsg))
            }
            if (file.size > fileSizeLimit) {
                return cb(
                    new Error(
                        `File must be less than ${fileSizeLimit / (1024 * 1024)}MB!`
                    )
                )
            }
            return cb(null, true) // Accept the file
        },
    })

    return upload
}

export const fileUploader = (
    fieldNames: multer.Field[],
    dest: UPLOAD_FOLDER,
    type: 'IMAGE' | 'PDF' | 'IMAGE_OR_PDF'
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const upload = multerConfig(dest, type)

        const isUploaded = upload.fields(fieldNames)

        isUploaded(req, res, function (error) {
            if (error) {
                return res.status(400).json({ error: error.message })
            }
            next()
        })
    }
}
