export interface QueryOpt {
    page: number,
    limit: number,
    isFeatured?: boolean | undefined,
    tags?: string | string[]
};

export interface ImageFile {
    orgName: string,
    filename: string,
    mimetype: string,
    path: string,
}