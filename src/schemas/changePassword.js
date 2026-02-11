import * as z from "zod";


const changePasswordSchema = z.object({
    oldPassword: z.string().min(8, "password must be minimum 8 charaters").trim(),
    newPassword: z.string().min(8, "password must be minimum 8 charaters").trim()
})

export {changePasswordSchema}