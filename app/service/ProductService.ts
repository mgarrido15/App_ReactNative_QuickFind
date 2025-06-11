import { Product } from "../models/Product";
import api from "./AxiosInstance";


export const postProduct = async (product: Partial<Product>): Promise<Product> => {
    try {
        const response = await api.post("/products", product);
        if (!response.data) {
            throw new Error("Error posting product");
        }
        return response.data;
    } catch (error) {
        console.error("Error  posting product:", error);
        throw error;
    }

}