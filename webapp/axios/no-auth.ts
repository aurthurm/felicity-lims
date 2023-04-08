import axios from 'axios';

import { REST_BASE_URL } from '../conf'

const axiosRaw= axios.create({
  baseURL: REST_BASE_URL + "/api/v1/",
  timeout: 1000,
  headers: {}
})

console.log(import.meta.env.VITE_BASE_URL)
console.log(import.meta.env)
console.log(import.meta)

export default axiosRaw