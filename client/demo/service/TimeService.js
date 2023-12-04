import axios from "axios";
import { URL } from "./PatientService";

export const TimeService = {

    async postTime(st_time, en_time) {
        const data = {
            st_time,
            en_time,
        }

        await axios.post(`${URL}/post-time`, data);
    },

    async editTime(st_time, en_time, _id) {
        const data = {
            st_time,
            en_time
        }

        await axios.post(`${URL}/edit-time/` + _id, data);
    },

    async getTime() {
        const response = await axios.get(`${URL}/get-time`);
        return response;
    },

    async deleteTime(_id) {
        await axios.delete(`${URL}/delete-time/` + _id);
    },

    async toggleTime(is_active, _id) {
        const data = {
            is_active
        }

        await axios.post(`${URL}/toggle-time/` + _id, data);
    }
}