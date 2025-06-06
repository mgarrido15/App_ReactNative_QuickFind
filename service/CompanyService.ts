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

export const updateCompanyById = async (id: string, company: Partial<Company>): Promise<Company> => {
  try {
    const response = await api.put(`/company/${id}`, company);

    if (response.status !== 200) {
      throw new Error("Error al actualizar la compañía");
    }

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message === "El email ya está registrado") {
      throw new Error("El email ya está registrado");
    }
    console.error("Error al actualizar la compañía:", error);
    throw error;
  }
}