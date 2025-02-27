// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = async ({ locals, url }: Parameters<LayoutServerLoad>[0]) => {
  const session = await locals.auth.validate();
  
  if (!session) {
    throw redirect(302, `/auth?redirectTo=${url.pathname}`);
  }

  return {
    user: session.user
  };
};
