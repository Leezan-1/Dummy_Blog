export default interface WhereClause {
    featured?: boolean,
    user_id?: number, // user id of user
    jti?: string, // session_id string
};

export type PostScope =
    | 'includeUser'
    | 'includeTags'
    | 'includeImages'
    | { method: ['filterByTags', string[]] };
