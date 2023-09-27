import mongoose from 'mongoose';
import chalk from 'chalk';

import dev from '.';

const connectDB = async () => {
    try {
        await mongoose.connect(dev.db.dbUrl);
        console.log(chalk.blue('DB is connected'));
    } catch (error) {
        console.log(chalk.red('DB is not connected'));
        console.log(error);
        process.exit(1);
    }
}

export default connectDB;