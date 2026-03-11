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

// Progressive disclosure contact form schemas

export type ContactReason = 'booking' | 'collaboration' | 'hello';

const baseFields = {
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email').max(200),
};

export const bookingSchema = z.object({
  ...baseFields,
  reason: z.literal('booking'),
  date: z.string().min(1, 'Please provide a date or date range'),
  venue: z.string().min(1, 'Venue or event name is required').max(200),
  location: z.string().min(1, 'Location is required').max(200),
  budget: z.enum(['under-500', '500-1000', '1000-2500', '2500-plus', 'prefer-not-to-say']),
  message: z.string().min(10, 'Please include some details').max(5000),
});

export const collaborationSchema = z.object({
  ...baseFields,
  reason: z.literal('collaboration'),
  projectType: z.enum(['remix', 'track', 'other']),
  timeline: z.string().max(200).optional(),
  message: z.string().min(10, 'Please include some details').max(5000),
});

export const helloSchema = z.object({
  ...baseFields,
  reason: z.literal('hello'),
  message: z.string().min(1, 'Say something!').max(5000),
});

export const contactSchemaByReason = {
  booking: bookingSchema,
  collaboration: collaborationSchema,
  hello: helloSchema,
} as const;
