import { body } from "express-validator";
import { validateErrors } from "./validate.error.js"

export const loginValidator = [
    body('userLoggin','Username cannot be empty').notEmpty().toLowerCase(),
    body('password', 'Password cannont be empty').notEmpty().isStrongPassword()
    .withMessage("The password must be strong").isLength({min: 8}),
    validateErrors
]

export const registerValidator = [
    body('name', 'Name cannot be empty').notEmpty(),
    body('lastname', 'Lastname cannot be empty').notEmpty(),
    body('username', 'Username cannot be empty').notEmpty(),
    body('email', 'Email cannot be empty').notEmpty().isEmail(),
    body('password', 'Password cannot be empty').notEmpty().isStrongPassword()
    .withMessage("The password must be strong").isLength({min: 8}),
    body('phone', 'Phone cannot be empty').notEmpty().isMobilePhone(),
    validateErrors
]

export const updateValidator = [
    body('name', 'Name cannot be empty').notEmpty(),
    body('lastname', 'Lastname cannot be empty').notEmpty(),
    body('username', 'Username cannot be empty').notEmpty(),
    body('email', 'Email cannot be empty').notEmpty().isEmail(),
    body('phone', 'Phone cannot be empty').notEmpty().isMobilePhone(),
    validateErrors
]

export const deleteValidator = [
    body('status', 'Status cannot be empty').notEmpty().isBoolean(),
    validateErrors
]

export const productValidator = [
    body('name', 'Name cannot be empty').notEmpty(),
    body('description', 'Description cannot be empty').notEmpty(),
    body('price', 'Price cannot be empty').notEmpty().isNumeric(),
    body('stock', 'Stock cannot be empty').notEmpty().isNumeric(),
    body('category', 'Category cannot be empty').notEmpty(),
    validateErrors
]

export const categoryValidator = [
    body('name', 'Name cannot be empty').notEmpty(),
    validateErrors
]

export const categoryUpdateValidator = [
    body('name', 'Name cannot be empty').optional(),
    validateErrors
]

export const categoryDeleteValidator = [
    body('status', 'Status cannot be empty').notEmpty().isBoolean(),
    validateErrors
]

export const cartValidator = [
    body('product', 'Product cannot be empty').notEmpty(),
    body('quantity', 'Quantity cannot be empty').notEmpty().isNumeric(),
    validateErrors
]

export const cartDeleteValidator = [
    body('product', 'Product cannot be empty').notEmpty(),
    validateErrors
]

export const cartClearValidator = [
    body('status', 'Status cannot be empty').notEmpty().isBoolean(),
    validateErrors
]

export const factureValidator = [
    body('products', 'Products cannot be empty').notEmpty(),
    body('total', 'Total cannot be empty').notEmpty().isNumeric(),
    validateErrors
]

export const factureDeleteValidator = [
    body('status', 'Status cannot be empty').notEmpty().isBoolean(),
    validateErrors
]

export const factureUpdateValidator = [
    body('status', 'Status cannot be empty').notEmpty().isBoolean(),
    validateErrors
]

export const productUpdateValidator = [
    body('name', 'Name cannot be empty').optional(),
    body('description', 'Description cannot be empty').optional(),
    body('price', 'Price cannot be empty').optional().isNumeric(),
    body('stock', 'Stock cannot be empty').optional().isNumeric(),
    body('category', 'Category cannot be empty').optional(),
    validateErrors
]

export const productDeleteValidator = [
    body('status', 'Status cannot be empty').notEmpty().isBoolean(),
    validateErrors
]

export const createAdminValidator = [
    body('name', 'Name cannot be empty').notEmpty(),
    body('lastname', 'Lastname cannot be empty').notEmpty(),
    body('username', 'Username cannot be empty').notEmpty(),
    body('email', 'Email cannot be empty').notEmpty().isEmail(),
    body('password', 'Password cannot be empty').notEmpty().isStrongPassword()
    .withMessage("The password must be strong").isLength({min: 8}),
    body('phone', 'Phone cannot be empty').notEmpty().isMobilePhone(),
    validateErrors
]

export const deleteMyUserValidator = [
    body('status', 'Status cannot be empty').notEmpty().isBoolean(),
    validateErrors
]

