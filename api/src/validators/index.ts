import { Request, Response, NextFunction} from 'express';
import { validationResult } from "express-validator";

const runValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                message: errors.array()[0].msg
            });
        }
        return next();
    } catch (error) {
        return next(error);
    }
}

export default runValidation;