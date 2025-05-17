import Api from "./Api";
import Csrf from "./Csrf";

export default {
    async register(form) {
        await Csrf.getCookie();

        return Api.post("/register", form);
    },

    async login(form) {
        await Csrf.getCookie();

        return Api.post("/auth/login", form);
    },

    async logout() {
        await Csrf.getCookie();

        return Api.post("/auth/logout");
    },

    auth() {
        return Api.get("/user");
    }
};