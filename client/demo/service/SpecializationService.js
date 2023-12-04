import axios from "axios";
import { URL } from "./PatientService";

export const SpecializationService = {

    async postSpecial(specialist, details) {
        const data = {
            specialist,
            details,
        }

        await axios.post(`${URL}/post-special`, data);
    },

    async editSpecial(specialist, details, _id) {
        const data = {
            specialist,
            details
        }

        await axios.post(`${URL}/edit-special/` + _id, data);
    },

    async getSpecial() {
        const response = await axios.get(`${URL}/get-special`);
        return response;
    },

    async deleteSpecial(_id) {
        await axios.delete(`${URL}/delete-special/` + _id);
    },

    async toggleSpecial(is_active, _id) {
        const data = {
            is_active
        }

        await axios.post(`${URL}/toggle-special/` + _id);
    }
}