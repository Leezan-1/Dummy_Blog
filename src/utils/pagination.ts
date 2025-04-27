
export const pagination = (totalPosts: number, currentPage: number, limit: number) => {
    let totalPages = Math.ceil(totalPosts / limit);
    let nextPage: number | null = currentPage + 1;
    let prevPage: number | null = currentPage - 1;

    if (currentPage >= totalPages) {
        currentPage = totalPages;
        prevPage = totalPages - 1;
        nextPage = null;
    }

    if (currentPage <= 1) {
        currentPage = 1;
        prevPage = null;
    }

    return {
        total_posts: totalPosts,
        total_pages: totalPages,
        current_page: currentPage,
        previous_page: prevPage,
        next_page: nextPage
    };
}
