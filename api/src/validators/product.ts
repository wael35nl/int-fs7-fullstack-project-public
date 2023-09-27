import { ValidationChain, body } from 'express-validator';

const validateProduct: ValidationChain[] = [
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Product category is required'),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Product title is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('Product title should be at least 3-50 characters long'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Product description is required')
        .isLength({ min: 100 })
        .withMessage('Product description should be at least 100 characters long'),
    body('price')
        .notEmpty()
        .withMessage('Product price is required')
        .isNumeric()
        .trim(),
    body('quantity')
        .notEmpty()
        .withMessage('Product quantity is required')
        .trim()
];

export {validateProduct};