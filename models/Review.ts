import { User } from "./User";

export interface IReview {
    user_id: string | User;
    company_id: string;
    rating: number;
    description: string;
    date: Date;
  }