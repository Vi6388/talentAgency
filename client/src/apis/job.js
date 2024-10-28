import axios from "axios";

const SERVER_URL = process.env.REACT_APP_API_BACKEND_URL;

const add = (data) => axios.post(`${SERVER_URL}/job/add`, data);

const list = () => axios.get(`${SERVER_URL}/job/list`);

const deleteJobById = (id) => axios.delete(`${SERVER_URL}/job/delete/` + id);

const updateJobById = (id, data) => axios.post(`${SERVER_URL}/job/update/` + id, data);

const getJobById = (id) => axios.get(`${SERVER_URL}/job/` + id);

const uploadFiles = (formData) => axios.post(`${SERVER_URL}/job/uploadFile`, formData);

const updateJobStatusById = (id, data) => axios.post(`${SERVER_URL}/job/updateJobStatus/` + id, data);

export const JobApi = {
  add,
  list,
  getJobById,
  deleteJobById,
  updateJobById,
  uploadFiles,
  updateJobStatusById
};