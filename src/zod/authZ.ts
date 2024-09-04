import { z } from "zod";

const signUpZ = z
  .object({
    name: z.string().min(3, {
      message: "Name is required",
    }),
    usn: z.string().min(3, {
      message: "Usn is required",
    }),
    email: z
      .string()
      .email({
        message: "Email is required",
      })

      .refine((email) => !email.endsWith("@nmamit.in"), {
        message: "Use your personal email",
      }),
    branchId: z.string().min(1, {
      message: "Please select a branch",
    }),
    password: z.string().min(8, {
      message: "Password should consist of minimum 8 characters",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const loginZ = z.object({
  email: z.string().email(),
  password: z.string(),
});



const sendVerifyEmailZ = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

const sendPasswordResetZ = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

const resetPasswordZ = z
  .object({
    token: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const verifyEmailZ = z.object({
  token: z.string(),
});

const refreshTokenZ = z.object({
  refreshToken: z.string(),
});

export {
  signUpZ,
  loginZ,
  sendVerifyEmailZ,
  sendPasswordResetZ,
  resetPasswordZ,
  verifyEmailZ,
  refreshTokenZ,
};
