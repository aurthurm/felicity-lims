import axios from 'axios';

import { REST_BASE_URL } from '../conf';

const axiosRaw = axios.create({
    baseURL: REST_BASE_URL + '/api/v1/',
    timeout: 10000,
    headers: {},
});

export default axiosRaw;
