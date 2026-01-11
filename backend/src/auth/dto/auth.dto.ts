import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Define Zod Schema for Register
export const RegisterSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
            message: 'Password must contain uppercase, lowercase, number and special character'
        }),
    fullName: z.string().min(2, { message: 'Full name is required' }),
});

export class RegisterDto extends createZodDto(RegisterSchema) { }

// Define Zod Schema for Login
export const LoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export class LoginDto extends createZodDto(LoginSchema) { }

// Define Zod Schema for Update Profile
export const UpdateProfileSchema = z.object({
    fullName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    title: z.string().optional(),
    location: z.string().optional(),
});

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) { }
