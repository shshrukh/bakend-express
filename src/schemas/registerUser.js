import * as z from 'zod';

const registerUserScheama = z.object({
    firstName: z.string().trim().min(3, 'first name have at least 3 chars'),
    lastName: z.string().trim().min(3, 'last name have at least 3 chars'),
    email: z.email(),
    password: z.string().min(8,'password must contain a least eight chars')
})





export default registerUserScheama;