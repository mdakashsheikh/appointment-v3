import axios from "axios";
import { URL } from "./PatientService";

export const MedicineTimeService = {

    async postMTime(m_time, details) {
        const data = {
            m_time, details
        }

        await axios.post(`${URL}/post-m-time`, data);
    },

    async editMTime(m_time, details, _id) {
        const data = {
            m_time, details
        }

        await axios.post(`${URL}/edit-m-time/` + _id, data);
    }, 

    async getMTime() {
        const response = await axios.get(`${URL}/get-m-time`);
        return response;
    },

    async deleteMTime(_id) {
        await axios.delete(`${URL}/delete-m-time/` + _id);
    },

    async toggleMTime(is_active, _id) {
        const data = {
            is_active
        }

        await axios.post(`${URL}/toggle-m-time/` + _id, data);
    }
}