// const baseURL = `${req.protocol}`

// function imageUrlGenerator(path) {
//     const baseURL = process.env.BASE_URL;
//     path = `${baseURL}/${path.split('src/')[1]}`;

//     return path;
// }
const { URL } = require('url');

function imageUrlGenerator(filePath) {
    if (!filePath) return null; // Handle missing file safely

    const baseURL = process.env.BASE_URL || 'http://localhost:5000';

    // Ensure correct path formatting
    const cleanPath = `${baseURL}/${filePath.split('src/')[1]}`;
    // const cleanPath = filePath.replace(/^.*src\//, ''); // Remove 'src/' from path

    // Use Node.js `URL` module to construct a valid URL
    return new URL(cleanPath, baseURL).href;
}
module.exports = imageUrlGenerator;