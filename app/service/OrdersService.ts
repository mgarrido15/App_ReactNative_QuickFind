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

export const createOrder = async (order: IOrder): Promise<IOrder> => {
  try {
    const response = await api.post(`orders`, order);
    if (response.status !== 200) {
      throw new Error("Failed to create order");
    }
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const updateOrderByID = async (orderId: string, order: Partial<IOrder>): Promise<IOrder> => {
  try {
    const response = await api.put(`orders/${orderId}`, order);
    if (response.status !== 200) {
      throw new Error("Failed to update order");
    }
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}