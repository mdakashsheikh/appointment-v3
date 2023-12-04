import axios from "axios";
import { URL } from "./PatientService";

export const OperatorService = {

    async postOperator(name, userName, phone, password, dr_name) {
        const data = {
            name,
            userName, 
            phone,
            password,
            dr_name 
        }

        await axios.post(`${URL}/post-operator`, data);
    },

    async editOperator(name, userName, phone, password, dr_name, _id) {
        const data = {
            name,
            userName, 
            phone,
            password,
            dr_name 
        }

        await axios.post(`${URL}/edit-operator/` + _id, data);
    },

    async getOperator() {
        const response = await axios.get(`${URL}/get-operator`);
        return response;
    },

    async deleteOperator(_id) {
        await axios.delete(`${URL}/delete-operator/` + _id);
    },

    async toggleOperator(is_active, _id) {
        const data = {
            is_active
        }

        await axios.post(`${URL}/toggle-operator/` + _id, data);
    }
} 