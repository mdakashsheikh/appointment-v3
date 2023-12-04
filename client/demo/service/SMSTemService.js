import axios from "axios";
import { URL } from "./PatientService";

export const SMSTemService = {

    async postSMS(title, sms1) {
        const data = {
            title,
            sms1
        }

        await axios.post(`${URL}/post-sms`, data);
    },

    async editSMS(title, sms1, _id) {
        const data = {
            title,
            sms1
        }

        await axios.post(`${URL}/edit-sms/` + _id, data);
    },

    async getSMS() {
        const response = await axios.get(`${URL}/get-sms`);
        return response;
    },

    async deleteSMS(_id) {
        await axios.delete(`${URL}/delete-sms/` + _id);
    }
}