import axios from "axios";
import { URL } from "./PatientService";

export const MedicineRuleService = {

    async postRule(m_rule, details) {
        const data = {
            m_rule, details
        }

        await axios.post(`${URL}/post-rule`, data);
    },

    async editRule(m_rule, details, _id) {
        const data = {
            m_rule, details
        }

        await axios.post(`${URL}/edit-rule/` + _id, data);
    },

    async getRule() {
        const response = await axios.get(`${URL}/get-rule`);
        return response;
    },

    async deleteRule(_id) {
        await axios.delete(`${URL}/delete-rule/` + _id);
    }, 

    async toggleRule(is_active, _id) {
        const data = {
            is_active
        }

        await axios.post(`${URL}/toggle-rule/` + _id, data);
    }
}