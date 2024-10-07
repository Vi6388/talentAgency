import axios from "axios";

const SERVER_URL = process.env.API_BACKEND_URL || "http://localhost:4000/api";

const add = (data) => axios.post(`${SERVER_URL}/user/add`, data);

const list = () => axios.get(`${SERVER_URL}/user/list`);

const deleteUserById = (id) => axios.delete(`${SERVER_URL}/user/delete/` + id);

const updateUserById = (id, data) => axios.put(`${SERVER_URL}/user/save/`+ id, data);

const getUserById = (id) => axios.get(`${SERVER_URL}/user/` + id);

export const UserApi = {
  add,
  list,
  getUserById,
  deleteUserById,
  updateUserById
};