import axios from "axios";
import { URL } from "./PatientService";

export const PrescriptionService = {

    async postPrescribe(info, _id) {
        const data = {
           info
        }

        await axios.post(`${URL}/post-prescribe/` + _id, data);
    }
}