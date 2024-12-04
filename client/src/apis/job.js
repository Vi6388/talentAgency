import axios from "axios";

const SERVER_URL = process.env.REACT_APP_API_BACKEND_URL + "/api";

const add = (data) => axios.post(`${SERVER_URL}/job/add`, data);

const list = (sort, order) => axios.get(`${SERVER_URL}/job/list/${sort}/${order}`);

const deleteJobById = (id) => axios.delete(`${SERVER_URL}/job/delete/` + id);

const updateJobById = (id, data) => axios.post(`${SERVER_URL}/job/update/` + id, data);

const getJobById = (id) => axios.get(`${SERVER_URL}/job/getById/` + id);

const getCalendarEventList = () => axios.get(`${SERVER_URL}/job/getCalendarEventList`);

const uploadFiles = (formData) => axios.post(`${SERVER_URL}/job/uploadFile`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const updateJobStatusById = (id, data) => axios.post(`${SERVER_URL}/job/updateJobStatus/` + id, data);

export const JobApi = {
  add,
  list,
  getJobById,
  deleteJobById,
  updateJobById,
  uploadFiles,
  updateJobStatusById,
  getCalendarEventList
};