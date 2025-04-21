import slugify from "slugify";
import crypto from "crypto";


export async function generateSlug(title: string, anythingElseToAdd?: string | number): Promise<string> {



    let slug = slugify(title, { trim: true, lower: true, strict: true });

    if (typeof anythingElseToAdd === "number" || anythingElseToAdd)
        slug += `-${anythingElseToAdd}`;

    const lengthToGenerate = 8;
    let buffer = await crypto.randomBytes(lengthToGenerate / 2);
    slug += `-${buffer.toString("hex")}`;

    return slug;
}