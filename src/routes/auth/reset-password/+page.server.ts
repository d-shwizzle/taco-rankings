import { z } from 'zod';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resetSchema = z.object({
  email: z.string().email('Invalid email address')
});

export const actions: Actions = {
  reset: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());
    
    try {
      const { email } = resetSchema.parse(formData);

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return fail(400, {
          message: 'If an account exists with this email, you will receive password reset instructions.'
        });
      }

      // TODO: Generate reset token and send email
      // For now, we'll just return success
      return {
        type: 'success'
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return fail(400, {
          message: error.errors[0].message
        });
      }
      
      return fail(500, {
        message: 'An unknown error occurred. Please try again later.'
      });
    }
  }
};
