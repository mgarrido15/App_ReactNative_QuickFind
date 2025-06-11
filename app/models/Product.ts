export interface Product {
  _id: string;
  companyId: string;
  name: string;
  rating: number;
  description: string;
  price: number;
  available: boolean;
  image?: string;
  category?: string;
  stock?: number;

}
