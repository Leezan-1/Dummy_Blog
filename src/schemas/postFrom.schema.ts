import { z } from 'zod';

const titleRegex = /^[A-Za-z0-9\s\.,!?'"-]+$/;
const tagNameRegex = /^[A-Za-z]$/;

const TitleSchema = z.string().min(10, 'must be at least 10 character long').max(100, "must not exceed 100 character").regex(titleRegex, "no emojis or special character allowed");
const ExcerptSchema = z.string().min(10, "excerpt must at least be 10 character long ");


export const TagSchema = z.string().min(2, 'tag name must be 2 character long').max(20, 'tag name must not exceed 20 character').regex(tagNameRegex, 'tag must be alphabet only');

export const PostFormSchema = z.object({
    title: TitleSchema,
    excerpt: ExcerptSchema,
    tags: z.union([TagSchema, z.array(TagSchema)]).optional()
});