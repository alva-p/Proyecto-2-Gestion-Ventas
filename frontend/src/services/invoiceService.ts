import API from "../index";
import type { Invoice } from "../types/invoice";

export const getInvoices = async (): Promise<Invoice[]> => {
  const res = await API.get<Invoice[]>('/factura');
  return res.data;
};

export const getInvoiceById = async (id: number): Promise<Invoice> => {
  const res = await API.get<Invoice>(`/factura/${id}`);
  return res.data;
};

export const deleteInvoice = async (id: number): Promise<void> => {
  await API.delete(`/factura/${id}`);
};
