import dotenv from 'dotenv';
dotenv.config();

const dev = {
    app: {
        serverPort: process.env.PORT || 4002,
        jwtAccountActivationKey: process.env.JWT_ACCOUNT_ACTIVATION_KEY || 'zglYnUKY3G52rlJ+7DsRbYB/7g6XsD4tdcvIOoH1uvg=',
        jwtAuthorizationKey: process.env.JWT_AUTHORIZATION_KEY || '10BWjtfTy0ED5SSyKCebD9kr48i/40EkBsVbBT5ACdc=',
        jwtSecretKey: process.env.JWT_SECRET_KEY || 'mr3O1dwRH9jCUMqhNFVTj5raf5P82BUeAhXTbjJ8DNQ=',
        smtpUserName: String(process.env.SMTP_USERNAME),
        smtpPassword: String(process.env.SMTP_PASSWORD),
        clientUrl: process.env.CLIENT_URL || 'http://localhost:3001',
    },
    db: {
        dbUrl: String(process.env.MONGODB_URI) || String(process.env.MONGODB_URI_LOCAL)
    }
}

export default dev;