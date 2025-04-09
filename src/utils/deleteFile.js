const fs = require("fs");

async function deleteFile(filePath) {
    await fs.promises.unlink(filePath)
        .catch((err) => { console.error(`Failed to delete image file ${filePath}`, err) });
}

module.exports = deleteFile;