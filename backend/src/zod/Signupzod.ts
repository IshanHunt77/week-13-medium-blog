import {z} from 'zod'

export const SignupSchema = z.object(
    {
        username:z.string(),
        email:z.string(),
        password:z.string()
    }
) 

export type SignupParams = z.infer<typeof SignupSchema>