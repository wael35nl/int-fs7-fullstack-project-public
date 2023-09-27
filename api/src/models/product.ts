import { Schema, model, Document } from "mongoose";

export type Products = Document & {
    category: Schema.Types.ObjectId,
    title: string,
    slug: string,
    description: string,
    image: string,
    price: number,
    quantity: number,
    order: number,
    sold: number,
    shipping: boolean,
}

const productSchema: Schema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        unique: true,
        minlength: [3, 'Product title must be at least 3 characters'],
        maxlength: [50, 'Product title can be maximum 50 characters']
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        minlength: [100, 'Product description must be at least 100 characters'],
        trim: true
    },
    image: {
        type: String,
        default: 'default-product.jpg'
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        trim: true,
        validatE: {
            validator: (value: number) => {
                return value > 0
            },
            message: 'Product price can\'t be 0'
        }
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
        default: 1
    },
    order: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    shipping: {
        type: Boolean,
        default: false
    },
},
{ timestamps: true });

export const Product = model<Products>('products', productSchema);