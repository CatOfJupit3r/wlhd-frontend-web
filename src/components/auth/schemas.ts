import { z } from 'zod';

export const PASSWORD_REGEX = /^[a-zA-Z0-9_]+$/;

export const registerSchema = z
    .object({
        username: z
            .string()
            .min(4)
            .max(20)
            .regex(/^[a-zA-Z0-9_]+$/),
        password: z.string().min(8).max(20).regex(PASSWORD_REGEX),
        confirmPassword: z.string().min(8).max(20).regex(PASSWORD_REGEX),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match!',
        path: ['confirmPassword'],
    });

export const loginSchema = z.object({
    username: z.string().min(4).max(20).regex(PASSWORD_REGEX),
    password: z.string().min(8).max(20).regex(PASSWORD_REGEX),
});
