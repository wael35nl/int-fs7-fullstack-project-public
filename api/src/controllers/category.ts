import {RequestHandler, Request, Response, NextFunction} from 'express';
import slugify from 'slugify';
import createError from 'http-errors';

import {Category} from '../models/category';
import { successResponse } from '../helpers/responseHandler';
import { Product } from '../models/product';

const createCategory: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;

        const exists = await Category.findOne({name});
        if (exists) throw createError(400, 'This category name is already in use!');

        const category = await Category.create({
            name,
            slug: slugify(name)
        });

        successResponse(res, { statusCode: 201, message: 'Category is created', payload: { category } });
    } catch (error: any) {
        if (error.message.includes('E11000')) {
            next(createError(400, 'A category with this name already exists'));
            return;
        }
        next(error);
    }
}

const getAllCategories: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await Category.find().select('name slug');
        successResponse(res, { statusCode: 200, message: 'All categories', payload: { categories } });
    } catch (error) {
        next(error);
    }
}

const updateCategory: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updates = {
            $set: {
                name,
                slug: slugify(name),
            }
        };
        const options = { new: true };

        const category = await Category.findByIdAndUpdate(id, updates, options);
        if (!category) throw createError(404, 'Category not found');

        successResponse(res, { statusCode: 200, message: 'Category updated', payload: {category} });
    } catch (error) {
        next(error);
    }
}

const deleteCategory: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (category) {
            const products = await Product.find();
            const notEmpty = products.find(product => JSON.stringify(product.category) === JSON.stringify(category._id));
            if (notEmpty) throw createError(400, 'There are still products under this category');
        }

        const result = await Category.findByIdAndDelete(id);
        if (!result) throw createError(404, 'Category not found');

        successResponse(res, { statusCode: 200, message: 'Category is deleted', payload: {category} });
    } catch (error) {
        next(error);
    }
}

export { createCategory, getAllCategories, updateCategory, deleteCategory };