import axios from "axios";

let Api = axios.create({
    baseURL: "http://play2gether.local/api/"
});

Api.defaults.withCredentials = true;

export default Api;