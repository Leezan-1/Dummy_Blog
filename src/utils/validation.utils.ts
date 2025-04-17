// export function validateName
import CustomError from "./CustomError.utils";

// validates user's name
export function validateName(name: string): void {
    const nameRegex = /^[A-Za-z]{2,50}$/; // Allows only letters, between 2 to 50 characters
    if (!name || !nameRegex.test(name))
        throw new CustomError(400, 'Please Enter Valid Name!');
}

export function validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email format validation
    if (!email || !emailRegex.test(email))
        throw new CustomError(400, 'Please Enter Valid Email!');
}


// validates user's password
export function validatePswd(pswd: string): void {
    const passwordRegex = /^.{8,20}$/; // Ensures password length is between 8 to 20 characters
    if (!pswd || !passwordRegex.test(pswd))
        throw new CustomError(400, 'Please Enter Valid Password!');
}

// validates title of blog post
export function validatePostTitle(title: string): void {

    const titleRegex = /^(?=.{10,100}$)[A-Za-z0-9\s\.,!?'"-]+$/;
    // title should be 10-100 characters long
    // allowed characters : letters, numbers, spaces,  . , ! ? ' " -
    if (!title || !titleRegex.test(title))
        throw new CustomError(400, 'invalid post title: title must be 10 - 100 character long.');
}

// validates excerpt of blog post
export function validatePostExcerpt(excerpt: string): void {
    // Excerpt must be provided and its length should be between 30 and 150 characters.

    const excerptRegex = /^(?=.{30,150}$)[\s\S]+$/;
    if (!excerpt || !excerptRegex.test(excerpt))

        throw new CustomError(400, 'invalid post excerpt: excerpt must be 30 - 150 character long.');
}

export function validateTags(tags: string | string[]): void {
    const tagNameRegex = /^[A-Za-z]{2,20}$/;

    if (typeof tags === "string") {
        if (!tags || !tagNameRegex.test(tags))
            throw new CustomError(400, "invalid tag name: tag name must be 2 - 20 character long");
    }


    // if (typeof tags === "string")
    //     tags = [tags.toLowerCase()];

    // return tags.filter((tag) => tagNameRegex.test(tag.toLowerCase()));

}
