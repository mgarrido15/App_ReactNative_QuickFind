import { Product } from "./Product";
import { IReview } from "./Review";

export interface Company {
  _id: string;
  ownerId: string;
  name: string;
  rating: number;
  userRatingsTotal: number;
  description: string;
  location: string;
  email: string;
  phone: string;
  password: string;
  wallet: number;
  coordenates_lat: number;
  coordenates_lng: number;
  icon: string;
  photos?: string[];
  products: Product[]; 
  followers: number;
  reviews: IReview[]; 
}
