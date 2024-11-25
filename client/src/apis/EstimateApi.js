import axios from "axios";

const SERVER_URL = process.env.REACT_APP_API_BACKEND_URL + "/api";

const add = (data) => axios.post(`${SERVER_URL}/estimate/add`, data);

const list = (sort, order) => axios.get(`${SERVER_URL}/estimate/list/${sort}/${order}`);

const deleteJobEstimateById = (id) => axios.delete(`${SERVER_URL}/estimate/delete/` + id);

const updateJobEstimateById = (id, data) => axios.post(`${SERVER_URL}/estimate/update/`+ id, data);

const getJobEstimateById = (id) => axios.get(`${SERVER_URL}/estimate/` + id);

const makeJobLiveById = (id) => axios.post(`${SERVER_URL}/estimate/makeJobLive/`+ id);

export const EstimateApi = {
  add,
  list,
  getJobEstimateById,
  deleteJobEstimateById,
  updateJobEstimateById,
  makeJobLiveById
};