import api from "./AxiosInstance";
import { Company } from "../models/Company";
import { Product } from "../models/Product";

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


export const addProductToCompany = async (idCompany: string, product: { productId: string }): Promise<Company> => {
  try {
    const response = await api.put(`/company/${idCompany}/addProduct`, product);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error(error.response.data.message || "Empresa o producto no encontrado");
      } else if (error.response.status === 409) {
        throw new Error(error.response.data.message || "El producto ya está asociado a esta empresa");
      } else {
        throw new Error(error.response.data.message || "Error al añadir producto a la empresa");
      }
    }
    throw new Error("Error de conexión al intentar añadir el producto");
  }
};