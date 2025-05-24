import api from "./AxiosInstance";
import { Company } from "../models/Company";

export const getAllCompanies = async (): Promise<Company[]> => {
  try {
    const response = await api.get("/company");
    if (!response.data) {
      throw new Error("Error fetching companies");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};


export const postCompany = async (company: Partial<Company>): Promise<Company> => {
  try {
    const response = await api.post("/company", company);
    if (!response.data) {
      throw new Error("Error posting company");
    }
    return response.data;
  } catch (error) {
    console.error("Error  posting company:", error);
    throw error;
  }

}