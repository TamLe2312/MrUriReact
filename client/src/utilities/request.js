import axios from "axios";

const request = axios.create({
  baseURL: `http://localhost:8080/`,
});

export const deleteRequest = async (path) => {
  const response = await request.delete(`${request.defaults.baseURL}${path}`);
  return response;
};
export const postRequest = async (path, option) => {
  const response = await request.post(
    `${request.defaults.baseURL}${path}`,
    option
  );
  return response;
};
export const putRequest = async (path, option) => {
  const response = await request.put(
    `${request.defaults.baseURL}${path}`,
    option
  );
  return response;
};
export const getRequest = async (path) => {
  const response = await request.get(`${request.defaults.baseURL}${path}`);
  return response;
};

export default request;
