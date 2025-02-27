import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestEvent } from '@sveltejs/kit';
import type { Review } from '$lib/types';

interface ReviewData {
  rating: number;
  comment?: string;
  taqueriaId: string;
}

export async function POST({ request, locals }: RequestEvent) {
  const session = await locals.getSession();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const data = await request.json() as ReviewData;
  
  const review = await prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment,
      userId: session.user.id,
      taqueriaId: data.taqueriaId
    },
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      }
    }
  });

  return json(review as Review);
}
