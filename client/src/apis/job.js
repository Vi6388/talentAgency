import axios from "axios";

const SERVER_URL = process.env.API_BACKEND_URL || "http://localhost:4000";

const add = (data) => axios.post(`${SERVER_URL}/api/job/add`, data);

const list = () => axios.get(`${SERVER_URL}/api/job/list`);

const deleteJobById = (id) => axios.delete(`${SERVER_URL}/api/job/delete/` + id);

const updateJobById = (id, data) => axios.put(`${SERVER_URL}/api/job/save/`+ id, data);

const getJobById = (id) => axios.get(`${SERVER_URL}/api/job/` + id);

const uploadFiles = (formData) => axios.post(`${SERVER_URL}/api/job/uploadFile`, formData)

export const JobApi = {
  add,
  list,
  getJobById,
  deleteJobById,
  updateJobById,
  uploadFiles
};