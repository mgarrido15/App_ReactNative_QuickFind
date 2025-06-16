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

export const modifyProduct = async (productId: string, product: Partial<Product>): Promise<Product> => {
    try {
        const response = await api.put(`/products/${productId}`, product);
        if (!response.data) {
            throw new Error("Error modifying product");
        }
        return response.data;
    } catch (error) {
        console.error("Error modifying product:", error);
        throw error;
    }
}