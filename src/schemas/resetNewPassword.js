import * as z from "zod";


const resetNewPasswordSchema =  z.object({
    password: z.string().min(8, "password have at least 8 characters").trim(),
    confirmPassword: z.string().min(8, "password have at least 8 characters").trim()
});

export { resetNewPasswordSchema };
