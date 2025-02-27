import { SvelteKitAuth } from '@auth/sveltekit';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import { GITHUB_ID, GITHUB_SECRET, GOOGLE_ID, GOOGLE_SECRET, AUTH_SECRET } from '$env/static/private';
import { sequence } from '@sveltejs/kit/hooks';

const prisma = new PrismaClient();

const auth = SvelteKitAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
    Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET }),
  ],
  secret: AUTH_SECRET,
});

export const handle = sequence();