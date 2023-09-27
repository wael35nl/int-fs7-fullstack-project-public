import { Router, Request, Response, NextFunction } from 'express';

import { uploadUserImage } from '../middlewares/upload';
import { validateUserRegistration, validateUserLogin, validateUserResetPassword } from '../validators/users';
import runValidation from '../validators/index';
import { requireAuth, isAdmin, isLoggedOut } from '../middlewares/auth';
import { registerUser, verifyUser, loginUser, forgetPassword, resetPassword, getRefreshToken, updateUserProfile, deleteUserProfile, logoutUser, getAllUsers, makeAdmin, banUser } from '../controllers/users';

const usersRouter = Router();

// USER 
usersRouter.post('/register', uploadUserImage.single('image'), validateUserRegistration, runValidation, registerUser);
usersRouter.post('/verify', verifyUser);
usersRouter.post('/login', isLoggedOut, validateUserLogin, runValidation, loginUser);
usersRouter.post('/forget-password', isLoggedOut, validateUserResetPassword, runValidation, forgetPassword);
usersRouter.post('/reset-password', isLoggedOut, resetPassword);
usersRouter.get('/refresh-token', requireAuth('You\'re not logged in'), getRefreshToken);
usersRouter.put('/update-profile', requireAuth(), uploadUserImage.single('image'), updateUserProfile);
usersRouter.delete('/delete-profile', requireAuth(), deleteUserProfile);
usersRouter.get('/logout', requireAuth('You\'re not logged in'), logoutUser);

// ADMIN
usersRouter.get('/', requireAuth(), isAdmin, getAllUsers);
usersRouter.get('/make-admin/:id', requireAuth(), isAdmin ,makeAdmin);
usersRouter.get('/ban-user/:id', requireAuth(), isAdmin ,banUser);

// ERROR
usersRouter.use('*', (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: 'Route not found' });
});

export default usersRouter;