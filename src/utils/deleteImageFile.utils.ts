import fs from 'fs';

export default async function deleteImageFile(filePath: string) {

    await fs.promises.unlink(filePath)
        .catch((err) => new Error("could not delete image file"));
}