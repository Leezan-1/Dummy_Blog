import bcrypt from 'bcrypt';
import slugify from "slugify";
import crypto from "crypto";

export function generateImageURL(filePath: string | undefined) {
    if (!filePath) return null; // Handle missing file safely

    const baseURL = process.env.BASE_URL || 'http://localhost:5000';

    // Ensure correct path formatting
    return `${baseURL}/${filePath.split('src/')[1]}`;
    // const cleanPath = filePath.replace(/^.*src\//, ''); // Remove 'src/' from path

}

export async function generatePassword(password: string): Promise<string> {
    const hashed = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS!));
    return hashed;
}

export async function checkUserPassword(userPassword: string, dbStoredHash: string): Promise<boolean> {
    const match = await bcrypt.compare(userPassword, dbStoredHash);
    return match;
}

export async function generateSlug(title: string, anythingElseToAdd?: string | number): Promise<string> {
    let slug = slugify(title, { trim: true, lower: true, strict: true });

    if (typeof anythingElseToAdd === "number" || anythingElseToAdd)
        slug += `-${anythingElseToAdd}`;

    const lengthToGenerate = 8;
    let buffer = await crypto.randomBytes(lengthToGenerate / 2);
    slug += `-${buffer.toString("hex")}`;

    return slug;
}

export function generateDuration(createdAt: string) {
    let postDuration;
    let millisecond = Date.now() - Date.parse(createdAt);


    if (millisecond >= 30 * 24 * 60 * 60 * 1000) {
        // If duration is 1 month or more
        postDuration = `${Math.floor(millisecond / (30 * 24 * 60 * 60 * 1000))} months`;
    } else if (millisecond >= 24 * 60 * 60 * 1000) {
        // If duration is 1 day or more
        postDuration = `${Math.floor(millisecond / (24 * 60 * 60 * 1000))} days`;
    } else if (millisecond >= 60 * 60 * 1000) {
        // If duration is 1 hour or more
        postDuration = `${Math.floor(millisecond / (60 * 60 * 1000))} hours`;
    } else if (millisecond >= 60 * 1000) {
        // If duration is 1 minute or more
        postDuration = `${Math.floor(millisecond / (60 * 1000))} minutes`;
    } else {
        // If duration is less than 1 minute
        postDuration = `${Math.floor(millisecond / 1000)} seconds`;
    }

    console.log('postDuration :>> ', postDuration);
    return postDuration;
}