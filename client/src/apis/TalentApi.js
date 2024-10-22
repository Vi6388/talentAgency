import axios from "axios";

const SERVER_URL = process.env.API_BACKEND_URL || "https://203.29.242.96:4000/api";

const add = (data) => axios.post(`${SERVER_URL}/talent/add`, data);

const getTalentList = () => axios.get(`${SERVER_URL}/talent/list`);

const deleteTalentById = (id) => axios.delete(`${SERVER_URL}/talent/delete/` + id);

const updateTalentById = (id, data) => axios.post(`${SERVER_URL}/talent/update/`+ id, data);

const getTalentById = (id) => axios.get(`${SERVER_URL}/talent/` + id);

export const TalentApi = {
  add,
  getTalentList,
  getTalentById,
  deleteTalentById,
  updateTalentById
};