import * as z from "zod";

const resetPasswordSchema = z.object({
    email: z.email()
})

export {resetPasswordSchema}