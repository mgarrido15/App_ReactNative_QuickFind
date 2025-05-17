import api from "./AxiosInstance";
import { IOrder } from "../models/Order";



export const getOrdersByUserId = async (userId: string): Promise<IOrder[]> => {
  try {
    const response = await api.get(`orders/AllOrdersByUser/${userId}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch orders");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};