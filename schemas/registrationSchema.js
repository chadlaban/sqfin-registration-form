import { z } from "zod";

// breaking schema individually to support live validation based on our watch on the RegistrationForm component
export const firstNameSchema = z.string().min(1, "First name is required");
export const lastNameSchema = z.string().min(1, "Last name is required");
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email format");
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long");
export const confirmPasswordSchema = z
  .string()
  .min(8, "Password confirmation is required");
export const countrySchema = z.string().min(1, "Please select a country");
export const phoneNumberSchema = z
  .string()
  .regex(/^\+?\d{10,15}$/, "Invalid phone number format");

// full form schema
export const registrationSchema = z
  .object({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    country: countrySchema,
    phoneNumber: phoneNumberSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
