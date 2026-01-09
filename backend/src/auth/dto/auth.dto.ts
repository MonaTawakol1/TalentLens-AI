import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Define Zod Schema for Register
export const RegisterSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    fullName: z.string().min(2, { message: 'Full name is required' }),
});

export class RegisterDto extends createZodDto(RegisterSchema) { }

// Define Zod Schema for Login
export const LoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export class LoginDto extends createZodDto(LoginSchema) { }
