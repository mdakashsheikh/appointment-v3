import axios from "axios";
import { URL } from "./PatientService";

export const FollowUpServices = {

    async postFollow(chamber, specialist, doctor,date1, time1, name, phone, serial, id, visit_status, price, followUpDate, visit_time, file) {
        const data = {
            chamber, 
            specialist, 
            doctor,
            date1,
            time1,
            name,
            phone,
            serial,
            id,
            visit_status,
            price, 
            followUpDate,
            visit_time, 
            file,
        }

        await axios.post(`${URL}/post-follow`, data);
    },

    async editFollow(price, followUpDate, visit_time,file, _id) {
        const data = {
            price,
            followUpDate,
            visit_time,
            file,
        }

        await axios.post(`${URL}/edit-follow/` + _id, data);
    },

    async editPatientFollow( _id) {
        const data = {
            visit_status: true
        }

        await axios.post(`${URL}/edit-patient-follow/` + _id, data);
    },

    async getFollow() {
        const response = await axios.get(`${URL}/get-follow`);
        return response;
    },

    async postFollowSMS(chamber, followDate, doctor, name,  phone, doctorNumber, _id) {
        const data = {
            chamber,
            followDate,
            doctor,
            name,
            phone,
            doctorNumber,
            is_active: "Success"
        }

        await axios.post(`${URL}/post-follow-sms/` + _id, data);
    },
   
    async deleteImage(image, id) {
        const data = {
            image,
            id,
        }
        await axios.post(`${URL}/delete-image/` + id, data);
    }
}