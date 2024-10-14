import axios from "axios";

const SERVER_URL = process.env.API_BACKEND_URL || "http://localhost:4000";

const add = (data) => axios.post(`${SERVER_URL}/api/estimate/add`, data);

const list = () => axios.get(`${SERVER_URL}/api/estimate/list`);

const deleteJobEstimateById = (id) => axios.delete(`${SERVER_URL}/api/estimate/delete/` + id);

const updateJobEstimateById = (id, data) => axios.put(`${SERVER_URL}/api/estimate/save/`+ id, data);

const getJobEstimateById = (id) => axios.get(`${SERVER_URL}/api/estimate/` + id);

const makeJobLiveById = (id) => axios.post(`${SERVER_URL}/api/estimate/makeJobLive/`+ id);

export const EstimateApi = {
  add,
  list,
  getJobEstimateById,
  deleteJobEstimateById,
  updateJobEstimateById,
  makeJobLiveById
};