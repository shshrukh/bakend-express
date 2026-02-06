import express from 'express';
import * as z from 'zod';

const loginUserSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "password must have min eight chars")
})

export default loginUserSchema;