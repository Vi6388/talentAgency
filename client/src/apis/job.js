import axios from "axios";

const SERVER_URL = process.env.API_BACKEND_URL || "http://localhost:4000";

const add = (data) => axios.post(`${SERVER_URL}/api/job/add`, data);

const list = () => axios.get(`${SERVER_URL}/api/job/list`);

const deleteJobById = (id) => axios.delete(`${SERVER_URL}/api/job/delete/` + id);

const updateJobById = (id, data) => axios.post(`${SERVER_URL}/api/job/update/` + id, data);

const getJobById = (id) => axios.get(`${SERVER_URL}/api/job/` + id);

const uploadFiles = (formData) => axios.post(`${SERVER_URL}/api/job/uploadFile`, formData);

const updateJobStatusById = (id, data) => axios.post(`${SERVER_URL}/api/job/updateJobStatus/` + id, data);

export const JobApi = {
  add,
  list,
  getJobById,
  deleteJobById,
  updateJobById,
  uploadFiles,
  updateJobStatusById
};