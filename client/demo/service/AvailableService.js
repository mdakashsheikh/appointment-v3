import axios from "axios";
import { URL } from "./PatientService";

export const AvailableService = {

    async postAvail(dname, chamber, days1, saturdayT, sundayT, mondayT, tuesdayT, wednesdayT, thursdayT, fridayT, serial) {
        const data = {
            dname,
            chamber,
            days1,
            saturdayT,
            sundayT,
            mondayT,
            tuesdayT,
            wednesdayT,
            thursdayT,
            fridayT,
            serial,
        }

        await axios.post(`${URL}/post-avail`, data);
    },

    async editAvail(dname, chamber, days1, saturdayT, sundayT, mondayT, tuesdayT, wednesdayT, thursdayT, fridayT, serial, _id) {
        const data = {
            dname,
            chamber,
            days1,
            saturdayT,
            sundayT,
            mondayT,
            tuesdayT,
            wednesdayT,
            thursdayT,
            fridayT,
            serial,
        }

        await axios.post(`${URL}/edit-avail/` + _id, data);
    },

    async getAvail() {
        const response = await axios.get(`${URL}/get-avail`);
        return response;
    },

    async deleteAvail(_id) {
        await axios.delete(`${URL}/delete-avail/` + _id);
    },

    async toggleAvail(is_active, _id) {
        const data = {
            is_active
        }

        await axios.post(`${URL}/toggle-avail/` + _id, data);
    }
} 