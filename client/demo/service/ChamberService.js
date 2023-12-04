import axios from "axios";
import { URL } from "./PatientService";

export const ChamberService = {

    async postChamber(chamber, address) {
        const data = {
            chamber,
            address,
        }

        await axios.post(`${URL}/post-chamber`, data);
    },

    async editChamber(chamber, address, _id) {
        const data = {
            chamber,
            address
        }

        await axios.post(`${URL}/edit-chamber/` + _id, data);
    },

    async getChamber() {
        const response = await axios.get(`${URL}/get-chamber`);
        return response;
    },

    async deleteChamber(_id) {
        await axios.delete(`${URL}/delete-chamber/` + _id);
    },

    async toggleChamber(is_active, _id) {
        const data = {
            is_active
        }

        await axios.post(`${URL}/toggle-chamber/` + _id, data);
    }
}