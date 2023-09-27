import bcrypt from 'bcrypt';

const saltRounds = 10;

const securePassword = async (plainPassword: string | Buffer) => {
        return await bcrypt.hash(plainPassword, saltRounds);
}

const comparePassword = async (plainPassword: string | Buffer, hashedPassword: string) => {
        return await bcrypt.compare(plainPassword, hashedPassword);
}

export { securePassword, comparePassword };