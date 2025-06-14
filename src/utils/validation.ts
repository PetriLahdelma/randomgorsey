import { z } from 'zod';

// Example: Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

// Usage:
// contactFormSchema.parse({ name, email, subject, message });
// If invalid, throws a ZodError
