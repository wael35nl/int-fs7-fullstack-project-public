import {RequestHandler, Request, Response, NextFunction} from 'express';
import createError from 'http-errors';
import mongoose from 'mongoose';

import {User, Users} from "../models/users";
import dev from '../config/index';
import { successResponse } from '../helpers/responseHandler';
import { securePassword, comparePassword } from '../helpers/securePassword';
import { createJsonWebToken, verifyJsonWebToken } from '../helpers/token';
import { sendEmailWithNodeMailer } from '../helpers/email';

const registerUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, age, email, password, phone } = req.body
        const image = req.file;
        if (!firstName || firstName.length < 3 || firstName.length > 9) throw createError(404, 'Please enter your first name, first name must be between 3 and 9 characters long');
        if (!lastName || lastName.length < 3 || lastName.length > 18) throw createError(404, 'Please enter your last name, last name must be between 3 and 18 characters long');
        if (!age) throw createError(404, 'Please enter your age');
        if (!email) throw createError(404, 'Please enter your email');
        if (!password || password.length < 8) throw createError(404, 'Please enter your password. password must be at least 8 characters');
        if (!phone) throw createError(404, 'Please enter your phone number');
        if (image && image.size > Math.pow(1024, 2)) throw createError(404, 'Maximum size for image-upload is 2mb');

        const user = await User.findOne({ email });
        if (user) throw createError(400, `User with this email ${email} already exists. Please sign in`);
        
        const dob = new Date(age);
        const month_diff = Date.now() - dob.getTime();
        const age_dt = new Date(month_diff);
        const year = age_dt.getUTCFullYear();
        const userAge = Math.abs(year - 1970);

        const hashedPassword = await securePassword(password);
        const token = createJsonWebToken(
            { ...req.body, age: userAge, password: hashedPassword, image: image ? image.filename: 'default-profile.png' },
            dev.app.jwtAccountActivationKey,
            '20m'
        );
        const emailData = {
            email,
            subject: 'Account activation email',
            html: `<h2>Hello ${firstName + ' ' + lastName}!</h2>
                <p>Please click here to <a href='${dev.app.clientUrl}/api/v1/users/verify/${token}' target='_blank'>activate your account</a></p>`
            }
        sendEmailWithNodeMailer(emailData);

        successResponse(res, { statusCode: 200, message: 'Verification link sent to your email', payload: { token } });
    } catch (error) {
        next(error);
    }
}

const verifyUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;
        if (!token) throw createError(404, 'Token not found');

        const decoded = verifyJsonWebToken(token, dev.app.jwtAccountActivationKey) as Users;
        const existingUser = await User.findOne({ email: decoded.email });
        if (existingUser) throw createError(409, 'This account is already active..');

        const user = await User.create({ ...decoded, username: decoded.firstName + ' ' + decoded.lastName });
        if (!user) throw createError(400, 'User profile wasn\'t created');

        successResponse(res, { statusCode: 201, message: 'User profile is created' });
    } catch (error: any) {
        if (error.message.includes('E11000')) {
            next(createError(400, 'User with this name already exists'));
            return;
        }
        next(error);
    }
}

const loginUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        if (!username) throw createError(404, 'Please enter your name');
        if (!password || password.length < 8) throw createError(404, 'Please enter your password. password must be at least 8 characters');

        const userNameFormat = username.toLowerCase();
        const user = await User.findOne({ username: userNameFormat });
        if (!user) throw createError(400, 'User not found, Please register first');

        const isPasswordMatch = await comparePassword(password, user.password);
        if (!isPasswordMatch) throw createError(400, 'Username and password do not match');

        if (user.is_banned) throw createError(403, 'You are banned, please contact the authority');

        const token = createJsonWebToken({ id: user._id }, dev.app.jwtAuthorizationKey, '30m');
        if (req.cookies[`${user._id}`]) {
            req.cookies[`${user._id}`] = '';
        }
        res.cookie(String(user._id), token, {
            maxAge: 900000,
            httpOnly: true
        });
        successResponse(res, { statusCode: 200, message: 'Logged in successfully', payload: {user} });
    } catch (error) {
        next(error);
    }
}

const forgetPassword: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email) throw createError(404, 'Please enter your email');
        if (!password || password.length < 8) throw createError(404, 'Please enter your new password. password must be at least 8 characters');

        const user = await User.findOne({ email });
        if (!user) throw createError(404, `User with this email address ${email} wasn\'t found`);

        const isSamePassword = await comparePassword(password, user.password);
        if (isSamePassword) throw createError(400, 'This is already your current password');

        const hashedPassword = await securePassword(password);
        const token = createJsonWebToken({ email, password: hashedPassword }, dev.app.jwtSecretKey, '20m');
        const emailData = {
            email,
            subject: 'Password-reset email',
            html: `
            <h2>Hello ${user.firstName + ' ' + user.lastName}!</h2>
            <p>Please click here to <a href='${dev.app.clientUrl}/api/v1/users/reset-password/${token}' target='_blank'>reset your password</a></p>`
        }
        sendEmailWithNodeMailer(emailData);

        successResponse(res, {statusCode: 200, message: 'Reset-password link sent to your email', payload: { token }});
    } catch (error) {
        next(error);
    }
}

const resetPassword: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;
        if (!token) throw createError(404, 'Token is messing');

        const decoded = verifyJsonWebToken(token, dev.app.jwtSecretKey) as Users;
        const { email, password } = decoded;

        const isExist = await User.findOne({ email });
        if (!isExist) throw createError(404, 'Couldn\'t find the user');

        const updatedData = await User.updateOne({ email }, { $set: { password } });
        if (!updatedData) throw createError(400, 'Password wasn\'t updated');

        successResponse(res, {statusCode: 200, message: 'Password updated successfully'});
    } catch (error) {
        next(error);
    }
}

const getRefreshToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.cookie) throw createError(404, 'No cookie found');

        const oldToken = req.headers.cookie.split('=')[1];
        if (!oldToken) throw createError(404, 'No token found');

        const decoded = verifyJsonWebToken(oldToken, dev.app.jwtAuthorizationKey) as Users;
        if (!decoded) throw createError(403, 'Invalid token');

        const newToken = createJsonWebToken({ id: decoded.id }, dev.app.jwtAuthorizationKey, '25m');
        if (req.cookies[`${decoded.id}`]) {
            req.cookies[`${decoded.id}`] = '';
        }

        res.cookie(String(decoded.id), newToken, {
            maxAge: 900000,
            httpOnly: true
        });

        return successResponse(res, { statusCode: 201, message: 'Refresh token is created', payload: { newToken } });
    } catch (error) {
        next(error);
    }
}

const getAllUsers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit = 6}: number | any = req.query;
        let users;

        const countUsers = await User.find().countDocuments();
        const totalPages = Math.ceil(countUsers / limit);

        if (page) {
            users = await User.find({}, {password: 0, createdAt: 0, updatedAt: 0, __v: 0}).skip((page - 1) * limit).limit(limit).sort({ age: -1 });
            if (!users.length) throw createError(404, 'No users found');
            return successResponse(res, { statusCode: 200, message: 'All users, filtered', payload: { users, totalPages } });
        }

        users = await User.find({}, {password: 0, createdAt: 0, updatedAt: 0, __v: 0}).sort({ age: -1 });
        if (!users.length) throw createError(404, 'No users found');

        return successResponse(res, { statusCode: 200, message: 'All users', payload: { users, totalPages } });
    } catch (error) {
        next(error);
    }
}

const updateUserProfile: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.headers.cookie) {
            const id = req.headers.cookie.split('=')[0];

            const user = await User.findByIdAndUpdate(id, {...req.body, username: req.body.firstName + ' ' + req.body.lastName}, {new: true});
            if (!user) throw createError(404, 'Profile wasn\'t updated');

            if (req.body.usernameForPassword) {
                const usernameForPasswordFormat = req.body.usernameForPassword.toLowerCase();
                if (usernameForPasswordFormat !== user.username) throw createError(400, 'Please enter your correct username');
            }

            if (req.body.currentPassword && req.body.newPassword) {
                const isPasswordMatch = await comparePassword(req.body.currentPassword, user.password);
                if (!isPasswordMatch) throw createError(400, 'Entered current-password is incorrect');

                const isSamePassword = await comparePassword(req.body.newPassword, user.password);
                if (isSamePassword) throw createError(400, 'This is already your current password');

                const hashedPassword = await securePassword(req.body.newPassword);
                user.password = hashedPassword;
            }

            if (req.file) {
                user.image = req.file.filename;
            }

            await user.save();
            successResponse(res, { statusCode: 200, message: 'Profile updated successfully', payload: {user} });
        } else {
            throw createError(400, 'Please login');
        }
    } catch (error) {
        next(error);
    }
}

const deleteUserProfile: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.headers.cookie) {
            const id = req.headers.cookie.split('=')[0];
            const user = await User.findByIdAndDelete(id);
            if (!user) throw createError(404, 'User wasn\'t deleted');
            res.clearCookie(`${id}`);
            successResponse(res, { statusCode: 200, message: 'User profile deleted' });
        } else {
            throw createError(400, 'Please login');
        }
    } catch (error) {
        next(error);
    }
}

const makeAdmin: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const user = await User.findOne({_id: id});
        if (!user) throw createError(404, 'User not found');

        if (!user.is_banned) user.is_admin = !user.is_admin;
        else throw createError(400, 'This user is banned!');
        await user.save();

        successResponse(res, {statusCode: 200, message: user.is_admin ? `${user.firstName + ' ' + user.lastName} is now an admin` : `${user.firstName + ' ' + user.lastName} is not an admin`, payload: {user}});
    } catch (error) {
        if (error instanceof mongoose.Error) {
            next(createError(400, 'Invalid user id'));
            return;
        }
        next(error);
    }
}

const banUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const user = await User.findOne({_id: id});
        if (!user) throw createError(404, 'User not found');

        if (!user.is_admin) user.is_banned = !user.is_banned;
        else throw createError(400, 'This user is an admin!');
        await user.save();

        successResponse(res, {statusCode: 200, message: `${user.is_banned ? 'User is banned' : 'User is unbanned'}`, payload: {user}});
    } catch (error) {
        if (error instanceof mongoose.Error) {
            next(createError(400, 'Invalid user id'));
            return;
        }
        next(error);
    }
}

const logoutUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.cookie) throw createError(404, 'No cookie found');

        const token = req.headers.cookie.split('=')[1];
        if (!token) throw createError(404, 'No token found');

        const decoded = verifyJsonWebToken(token, dev.app.jwtAuthorizationKey) as Users;
        if (!decoded) throw createError(403, 'Invalid token');

        if (req.cookies[`${decoded.id}`]) {
            req.cookies[`${decoded.id}`] = '';
        }
        res.clearCookie(`${decoded.id}`);

        return successResponse(res, { statusCode: 200, message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
}

export {registerUser, verifyUser, loginUser, forgetPassword, resetPassword, getRefreshToken, getAllUsers, updateUserProfile, deleteUserProfile, makeAdmin, banUser, logoutUser};