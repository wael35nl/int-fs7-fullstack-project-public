import {Request, Response, NextFunction} from 'express';
import createError from 'http-errors';

import { verifyJsonWebToken } from '../helpers/token';
import dev from '../config/index';
import {User, Users} from '../models/users';

const requireAuth = (message = 'Please login') => {
    const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.headers.cookie) throw createError(400, message);

            const token = req.headers.cookie.split('=')[1];
            if (!token) throw createError(404, 'No token found');

            const decoded = verifyJsonWebToken(token, dev.app.jwtAuthorizationKey) as Users;
            if (!decoded) throw createError(403, 'Invalid token');

            next();
        } catch (error) {
            next(error);
        }
    }
    return isLoggedIn;
}

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.headers.cookie) {
            const id = req.headers.cookie.split('=')[0];
            if (id) {
                const user = await User.findById(id);
                if (!user) throw createError(404, 'No user found with this id');
                if (!user.is_admin) throw createError(401, 'You\'re not an admin');
                next();
            } else {
                throw createError(400, 'Please login');
            }
        }
    } catch (error) {
        next(error);
    }
}

const isLoggedOut = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.headers.cookie) throw createError(401, 'You\'re already logged in');
        next();
    } catch (error) {
        next(error);
    }
}

export { requireAuth, isAdmin, isLoggedOut };