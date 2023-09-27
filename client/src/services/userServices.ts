import axios from 'axios';
axios.defaults.withCredentials = true;

const baseUrl: string | any = process.env.REACT_APP_API;

const registerUserRequest = async (user: FormData) => {
    const response = await axios.post(`${baseUrl}/users/register`, user);
    return response.data;
}

const verifyUserRequest = async (token: {token: string | undefined}) => {
    const response = await axios.post(`${baseUrl}/users/verify`, token);
    return response.data;
}

const loginUserRequest = async (user: {username: string; password : string}) => {
    const response = await axios.post(`${baseUrl}/users/login`, user);
    return response;
}

const refreshTokenRequest = async () => {
    const response = await axios.get(`${baseUrl}/users/refresh-token`);
    return response.data;
}

const forgetPasswordRequest = async (data: { email: string; password: string; }) => {
    const response = await axios.post(`${baseUrl}/users/forget-password`, data);
    return response;
}

const resetPasswordRequest = async (token: {token: string | undefined}) => {
    const response = await axios.post(`${baseUrl}/users/reset-password`, token);
    return response.data;
}

const updateUserRequest = async (user: FormData) => {
    const response = await axios.put(`${baseUrl}/users/update-profile`, user);
    return response.data;
}

const deleteUserRequest = async () => {
    const response = await axios.delete(`${baseUrl}/users/delete-profile`);
    return response.data;
}

const logoutUserRequest = async () => {
    const response = await axios.get(`${baseUrl}/users/logout`);
    return response;
}

const getAllUsersRequest = async (page: number) => {
    const url: string | any = page === 0 ? `${baseUrl}/users` : `${baseUrl}/users?page=${page}`;
    const response = await axios.get(url);
    return response.data;
}

const setAdminRequest = async (id: string) => {
    const response = await axios.get(`${baseUrl}/users/make-admin/${id}`);
    return response.data;
}

const banUserRequest = async (id: string) => {
    const response = await axios.get(`${baseUrl}/users/ban-user/${id}`);
    return response.data;
}

export { registerUserRequest, verifyUserRequest, loginUserRequest, forgetPasswordRequest, resetPasswordRequest, refreshTokenRequest, updateUserRequest, deleteUserRequest, logoutUserRequest, getAllUsersRequest, setAdminRequest, banUserRequest};