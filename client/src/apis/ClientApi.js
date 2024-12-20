import axios from "axios";

const SERVER_URL = process.env.REACT_APP_API_BACKEND_URL + "/api";

const add = (data) => axios.post(`${SERVER_URL}/client/add`, data);

const getClientList = () => axios.get(`${SERVER_URL}/client/list`);

const getContactListByClientId = (clientId) => axios.get(`${SERVER_URL}}/client/getContactListByClientId/` + clientId);

const deleteClientById = (id) => axios.delete(`${SERVER_URL}/client/delete/` + id);

const updateClientById = (id, data) => axios.post(`${SERVER_URL}/client/update/` + id, data);

const getClientById = (id) => axios.get(`${SERVER_URL}/client/` + id);

export const ClientApi = {
  add,
  getClientList,
  getClientById,
  deleteClientById,
  updateClientById,
  getContactListByClientId
};