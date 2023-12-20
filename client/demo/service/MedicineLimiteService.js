import axios from "axios";
import { URL } from "./PatientService";

export const MedicineLimiteService = {

    async postLimite(medicine_limite, details) {
        const data = {
            medicine_limite, details
        }

        await axios.post(`${URL}/post-limite`, data);
    },

    async editLimite(medicine_limite, details, _id) {
        const data = {
            medicine_limite, details
        }

        await axios.post(`${URL}/edit-limite/` + _id, data);
    },

    async getLimite() {
        const response = await axios.get(`${URL}/get-limite`);
        return response;
    },

    async deleteLimite(_id) {
        await axios.delete(`${URL}/delete-limite/` + _id);
    },

    async toggleLimite(is_active, _id) {
        const data = {
            is_active
        }

        await axios.post(`${URL}/toggle-limite/` + _id, data);
    }
}