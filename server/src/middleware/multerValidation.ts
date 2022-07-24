import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

export const validateMulter = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof (req.file) === 'undefined') {
            return res.status(400).json({
                errors: 'Please upload an image'
            })
        }

        if (!(req.file.mimetype).includes('jpeg') && !(req.file.mimetype).includes('png') && !(req.file.mimetype).includes('jpg')) {
            fs.unlinkSync(req.file.path)
            return res.status(400).json({
                errors: "Image not supported"
            })
        }

        if (req.file.size > 500000) {
            fs.unlinkSync(req.file.path)
            return res.status(400).json({
                errors: "Image is Too large. "
            })
        }
    } catch (error: any) {
        console.error(error.message)
    }

    next()
}