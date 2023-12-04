import axios from "axios";
import { URL } from "./PatientService";

export const DoctorService = {

    async postDoctor(name, specialist, designation, degree, experience) {
        const data = {
            name,
            specialist,
            designation,
            degree,
            experience,
        }

        await axios.post(`${URL}/post-doctor`, data);
    },

    async editDoctor(name, specialist, designation, degree, experience, _id) {
        const data = {
            name,
            specialist,
            designation,
            degree,
            experience,
        }

        await axios.post(`${URL}/edit-doctor/` + _id, data);
    },

    async getDoctor() {
        const response = await axios.get(`${URL}/get-doctor`);
        return response;
    },

    async deleteDoctor(_id) {
        await axios.delete(`${URL}/delete-doctor/` + _id);
    },

    async toggleDoctor(is_active, _id) {
        const data = {
            is_active
        }

        await axios.post(`${URL}/toggle-doctor/` + _id, data);
    }
}