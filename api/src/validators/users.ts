import { ValidationChain, body } from 'express-validator';

const validateUserRegistration: ValidationChain[] = [
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('Please Enter your first name')
        .isLength({ min: 3, max: 9 })
        .withMessage('First name should be 3-9 characters long'),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Please Enter your last name')
        .isLength({ min: 3, max: 18 })
        .withMessage('Last name should be 3-18 characters long'),
    body('age')
        .trim()
        .notEmpty()
        .withMessage('Please enter your age'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Please enter your email')
        .isEmail()
        .withMessage('Invalid email address'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Please enter your password')
        .isLength({ min: 8 })
        .withMessage('Password should be at least 8 characters long'),
    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Please enter your phone number'),
    body('image')
        .optional()
        .isString(),
];

const validateUserLogin: ValidationChain[] = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Please enter your name'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Please enter your password')
        .isLength({ min: 8 })
        .withMessage('Password should be at least 8 characters long'),
];

const validateUserResetPassword: ValidationChain[] = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Please enter your email')
        .isEmail()
        .withMessage('Invalid email address'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Please enter your password')
        .isLength({ min: 8 })
        .withMessage('Password should be at least 8 characters long'),
];

export { validateUserRegistration, validateUserLogin, validateUserResetPassword };