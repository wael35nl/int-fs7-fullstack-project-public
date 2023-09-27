import mongoose, { Schema, model } from 'mongoose';

export type Categories = Document & {
    _id: mongoose.Schema.Types.ObjectId
    name: string,
    slug: string
}

const categorySchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            unique: true,
            minlength: [3, 'Category name must be at least 3 characters'],
            maxlength: [31, 'Category name can be maximum 31 characters']
        },
        slug: {
            type: String,
            required: [true, 'Category slug is required'],
            lowercase: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export const Category = model<Categories>('categories', categorySchema);