import axios from "axios";
import { URL } from "./PatientService";

export const PrescriptionService = {

    async postPrescribe(medicineTime, medicineTiming, medicineLimite) {
        const data = {
            medicineTime,
            medicineTiming,
            medicineLimite,
        }

        await axios.post(`${URL}/post-prescribe`, data);
    },

    async editPrescribe(medicineTime, medicineTiming, medicineLimite, _id) {
        const data = {
            medicineTime,
            medicineTiming,
            medicineLimite,
        }

        await axios.post(`${URL}/edit-prescribe/` + _id, data);
    },

    async getPrescribe() {
        const response = await axios.get(`${URL}/get-prescribe`);
        return response;
    },

    async deletePrescribe(_id) {
        await axios.delete(`${URL}/delete-prescribe/` + _id);
    },

    async togglePrescribe(is_active, _id) {
        const data = {
            is_active
        }

        await axios.post(`${URL}/toggle-prescribe/` + _id, data);
    }
}