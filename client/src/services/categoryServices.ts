import axios from 'axios';
axios.defaults.withCredentials = true;

const baseUrl: string | any = process.env.REACT_APP_API;

const createCategoryRequest = async (name: string) => {
    const response = await axios.post(`${baseUrl}/categories`, {name});
    return response.data;
}

const getAllCategoriesRequest = async () => {
    const response = await axios.get(`${baseUrl}/categories`);
    return response.data;
}

const updateCategoryRequest = async (id: string, updated: string) => {
    const response = await axios.put(`${baseUrl}/categories/${id}`, {name: updated});
    return response.data;
}

const deleteCategoryRequest = async (id: string) => {
    const response = await axios.delete(`${baseUrl}/categories/${id}`);
    return response.data;
}

export { createCategoryRequest, getAllCategoriesRequest, updateCategoryRequest, deleteCategoryRequest };