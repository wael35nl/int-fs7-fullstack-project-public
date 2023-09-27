import {Response} from 'express';

const errorResponse = (response: Response, { statusCode = 500, message = 'Internal server error' }) => {
    return response.status(statusCode).json({ success: false, message });
}

const successResponse = (response: Response, { statusCode = 200, message = 'Success', payload = {} }) => {
    return response.status(statusCode).json({
        success: true,
        message,
        payload
    });
}

export { errorResponse, successResponse };