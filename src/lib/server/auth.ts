import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { SvelteKitAuth } from "@auth/sveltekit";
import { prisma } from "$lib/server/prisma";
import { GITHUB_ID, GITHUB_SECRET, GOOGLE_ID, GOOGLE_SECRET } from "$env/static/private";

export const { handle, signIn, signOut } = SvelteKitAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
    Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET })
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    }
  }
});
