import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestEvent } from '@sveltejs/kit';
import type { Taqueria } from '$lib/types';

interface NewTaqueriaData {
  name: string;
  address: string;
  city: string;
  state: string;
  lat?: number;
  lng?: number;
}

export async function GET({ url }: RequestEvent) {
  const city = url.searchParams.get('city');
  const state = url.searchParams.get('state');

  const where = {
    ...(city && { city }),
    ...(state && { state })
  };

  const taquerias = await prisma.taqueria.findMany({
    where,
    include: {
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true
            }
          }
        }
      }
    }
  });

  return json(taquerias);
}

export async function POST({ request }: RequestEvent) {
  const data = await request.json() as NewTaqueriaData;
  
  const taqueria = await prisma.taqueria.create({
    data: {
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      lat: data.lat,
      lng: data.lng
    }
  });

  return json(taqueria as Taqueria);
};
