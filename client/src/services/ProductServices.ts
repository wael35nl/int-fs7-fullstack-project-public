import axios from 'axios';
axios.defaults.withCredentials = true;

const baseUrl: string | any = process.env.REACT_APP_API;

const createProductRequest = async (product: FormData) => {
    const response = await axios.post(`${baseUrl}/products/create`, product);
    return response.data;
}

const getAllProductsRequest = async (page: number, name: string) => {
    const url: string | any = page === 0 ? `${baseUrl}/products` : `${baseUrl}/products?page=${page}`;
    const response = await axios.post(url, {name});
    return response.data;
}

const updateProductRequest = async (id: string, product: FormData) => {
    const response = await axios.put(`${baseUrl}/products/${id}`, product);
    return response.data;
}

const deleteProductRequest = async (id: string) => {
    const response = await axios.delete(`${baseUrl}/products/${id}`);
    return response.data;
}

export { createProductRequest, getAllProductsRequest, updateProductRequest, deleteProductRequest};