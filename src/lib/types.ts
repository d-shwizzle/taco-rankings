export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  userId: string;
  taqueriaId: string;
  user: {
    name?: string;
    image?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Taqueria {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  lat?: number;
  lng?: number;
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
}
