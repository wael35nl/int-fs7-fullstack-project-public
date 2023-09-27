import {RequestHandler, Request, Response, NextFunction} from 'express';
import createError from 'http-errors';
import mongoose from 'mongoose';
import slugify from 'slugify';

import {Product} from "../models/product";
import { Categories, Category } from '../models/category';
import { successResponse } from '../helpers/responseHandler';

const createProduct: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const image = req.file ? req.file.filename : 'default-product.jpg';

        const productExists = await Product.exists({title: req.body.title});
        if (productExists) throw createError(409, 'A product with this title already exists');

        const category = await Category.findOne({name: req.body.category});
        if (!category) throw createError(404, 'This category doesn\'t exist');

        const product = await Product.create({ ...req.body, category: category._id, slug: slugify(req.body.title), image });
        if (!product) throw createError(400, 'Product is not created');

        return successResponse(res, { statusCode: 201, message: 'Product is created' });
    } catch (error: any) {
        next(error);
    }
}

const getAllProducts: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit = 4 }: number | any = req.query;
        let products;

        if (page) {
            const {name} = req.body;

            const categories = await Category.find();
            const filtered = categories.some(category => category.name === name);
            if (filtered) {
                const category = await Category.findOne({name}) as Categories;
                const count = await Product.find({category: category._id}).countDocuments();
                const totalPages = Math.ceil(count / limit);
                products = await Product.find({category: category._id}).populate('category').skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
                return successResponse(res, { statusCode: 200, message: 'All products, filtered', payload: { products, totalPages } });
            } else {
                const count = await Product.find().countDocuments();
                const totalPages = Math.ceil(count / limit);
                products = await Product.find().populate('category').skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
                return successResponse(res, { statusCode: 200, message: 'All products, filtered', payload: { products, totalPages } });
            }
        }

        products = await Product.find().populate('category').sort({ createdAt: -1 });

        return successResponse(res, { statusCode: 200, message: 'All products', payload: { products } });
    } catch (error) {
        next(error);
    }
}

const updateProduct: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;

        const product = await Product.findByIdAndUpdate(id, {...req.body}, {new: true});
        if (!product) throw createError(404, 'Product not found');

        if (req.body.productCategory) {
            const category = await Category.findOne({name: req.body.productCategory}) as Categories;
            if (!category) throw createError(404, 'Category not found');
            product.category = category._id;
        }

        const updatedSlug = req.body.title ? slugify(req.body.title) : product.slug;
        product.slug = updatedSlug;

        const image = req.file ? req.file.filename : product.image;
        product.image = image;

        await product.save();

        successResponse(res, { statusCode: 200, message: 'Product updated', payload: {product} });
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            next(createError(400, 'Invalid id'));
            return;
        }
        next(error);
    }
}

const deleteProduct: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await Product.findByIdAndDelete(id);
        if (!result) throw createError(404, 'Product not found');
        successResponse(res, { statusCode: 200, message: 'Product deleted' });
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            next(createError(400, 'Invalid id'));
            return;
        }
        next(error);
    }
}

export { createProduct, getAllProducts, updateProduct, deleteProduct };