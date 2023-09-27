import { Schema, model, Document } from "mongoose";

export type Users = Document & {
    firstName: string,
    lastName: string,
    username: string,
    age: string,
    email: string,
    password: string,
    phone: string,
    image: string,
    is_admin: boolean,
    is_banned: boolean,
}

const userSchema: Schema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'Please Enter your first name'],
        minlength: [3, 'Your first name is too short'],
        maxlength: [9, 'Your first name is too long']
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Please Enter your last name'],
        minlength: [3, 'Your last name is too short'],
        maxlength: [18, 'Your last name is too long']
    },
    username: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
    },
    age: {
        type: String,
        default: '01012000',
        required: [true, 'Please enter your age'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (valid: string) => {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(valid);
            },
            message: 'Please enter a valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password should be at least 8 characters long'],
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
    },
    image: {
        type: String,
        default: 'default-image.png'
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    is_banned: {
        type: Boolean,
        default: false
    }
},
{ timestamps: true });

export const User = model<Users>('users', userSchema);