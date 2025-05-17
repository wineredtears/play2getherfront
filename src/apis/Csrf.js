import Api from "./Api.js";
import Cookie from "js-cookie";
import axios from "axios";

export default {
    getCookie() {
        let token = Cookie.get("XSRF-TOKEN");

        if (token) {
            return new Promise(resolve => {
                resolve(token);
            });
        }

        return axios.get('http://play2gether.local/api/csrf-cookie', {
            withCredentials: true
        });
    }
};