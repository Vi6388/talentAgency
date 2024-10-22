import axios from "axios";

const SERVER_URL = process.env.API_BACKEND_URL || "https://203.29.242.96:4000";

const add = (data) => axios.post(`${SERVER_URL}/api/estimate/add`, data);

const list = () => axios.get(`${SERVER_URL}/api/estimate/list`);

const deleteJobEstimateById = (id) => axios.delete(`${SERVER_URL}/api/estimate/delete/` + id);

const updateJobEstimateById = (id, data) => axios.post(`${SERVER_URL}/api/estimate/update/`+ id, data);

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