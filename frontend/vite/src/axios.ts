import axios from 'axios';

import { REST_BASE_URL } from './conf'

const getAuthHeaders = () => {
  const token = localStorage.getItem('fwt');
  if (token) {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      ...(token && {
        'x-felicity-user-id': "felicity-user",
        'x-felicity-role': "felicity-administrator",
        'Authorization': `Bearer ${token}`
      }),
    } 
  }
  logout();
};

const logout = () => {
  localStorage.removeItem("fwt");
  localStorage.removeItem("fuser");
  localStorage.removeItem("fuid");
  localStorage.removeItem("fRole");
  return
}

const axiosInstance = axios.create({
  baseURL: REST_BASE_URL + "/api/v1/",
  timeout: 1000,
  headers: getAuthHeaders()
})

export default axiosInstance