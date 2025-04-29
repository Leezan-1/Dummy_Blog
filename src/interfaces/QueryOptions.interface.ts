export interface QueryOpt {
    page: number,
    limit: number,
    isFeatured?: boolean | undefined,
    tags?: string | string[]
};

export interface imageFile {
    orgName: string,
    name: string,
    mimetype: string,
    path: string,
}