import axios from "axios";

const SERVER_URL = process.env.REACT_APP_API_BACKEND_URL + "/api";

const add = (data) => axios.post(`${SERVER_URL}/contact/add`, data);

const getContactList = () => axios.get(`${SERVER_URL}/contact/list`);

const deleteContactById = (id) => axios.delete(`${SERVER_URL}/contact/delete/` + id);

const updateContactById = (id, data) => axios.post(`${SERVER_URL}/contact/update/`+ id, data);


export const ContactApi = {
  add,
  getContactList,
  deleteContactById,
  updateContactById
};