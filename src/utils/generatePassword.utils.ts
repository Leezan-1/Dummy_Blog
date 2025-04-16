import bcrypt from 'bcrypt';

export async function generatePassword(password: string): Promise<string> {
    const hashed = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS!));
    return hashed;
}

export async function checkUserPassword(userPassword: string, dbStoredHash: string): Promise<boolean> {
    const match = await bcrypt.compare(userPassword, dbStoredHash);
    return match;
}