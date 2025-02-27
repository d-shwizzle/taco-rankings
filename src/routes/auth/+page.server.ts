import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

// Optional: If you need custom actions, otherwise rely on @auth/sveltekit routes
export const actions: Actions = {
  login: async ({ request, url }) => {
    const form = await request.formData();
    const provider = form.get('provider')?.toString(); // e.g., 'github', 'google'
    if (!provider) return fail(400, { message: 'Provider required' });

    // Redirect to @auth/sveltekit's signin route
    throw redirect(303, `/auth/signin/${provider}?callbackUrl=${url.pathname}`);
  },
  logout: async () => {
    // Redirect to @auth/sveltekit's signout route
    throw redirect(303, '/auth/signout');
  }
};