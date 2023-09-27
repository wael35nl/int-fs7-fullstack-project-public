import { body } from 'express-validator';

const validateCategory = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 31 })
        .withMessage('Category name should be at least 3-31 characters long')
];

export default validateCategory;