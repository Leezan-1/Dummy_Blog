const { default: slugify } = require('slugify');
const crypto = require('crypto');

const generateSlug = async (title) => {
    let slug = slugify(title, { trim: true, lower: true, strict: true });

    let buffer = await crypto.randomBytes(12)
    slug += `-${buffer.toString('hex')}`;

    return slug;
}

module.exports = generateSlug;
