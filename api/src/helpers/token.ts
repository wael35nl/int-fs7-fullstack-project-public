import jwt from 'jsonwebtoken';

const createJsonWebToken = (data: object, key: string, expiresIn: string) => {
    return jwt.sign(
        {
            ...data,
        },
        String(key),
        {
            expiresIn
        }
    );
}

const verifyJsonWebToken = (token: string, key: string) => {
    return jwt.verify(token, String(key));
}

export { createJsonWebToken, verifyJsonWebToken };