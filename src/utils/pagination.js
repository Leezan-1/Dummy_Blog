
const pagination = (totalPosts, currentPage, limit) => {
    let totalPages = Math.ceil(totalPosts / limit);
    let nextPage = currentPage + 1;
    let prevPage = currentPage - 1;

    if (currentPage >= totalPages) {
        currentPage = totalPages;
        prevPage = totalPages - 1;
        nextPage = null;
    }

    if (currentPage <= 1) {
        currentPage = 1;
        prevPage = null;
    }

    return { totalPosts, totalPages, currentPage, prevPage, nextPage };
}
module.exports = pagination