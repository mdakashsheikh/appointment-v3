import React, { useRef } from "react";
import { useFormik } from 'formik';
// import bg_prescription from '../../../public/prescription/bg_prescription.jpg';

export default function FormikDoc() {
    const toast = useRef(null);
    return (
        <div className="card">
            <div className="grid">
                <div className="col">
                    <h4>Dr Razeeb</h4>
                    <p>M.S</p>
                    <p>Reg.No: MMC 2024</p>
                </div>
                <div className="col">
                   
                </div>
                <div className="col">
                    <h3 className="text-blue-600 font-bold">Ibne Sina Hospital</h3>
                    <p>House # 48, Road # 9/A, Dhanmondi, Dhaka 1209</p>
                    <p>Ph.No: 01711223344, 01911223344</p>
                    <p>Open: 6PM - 9PM</p>
                    <p>Close: Sunday</p>
                </div>
            </div>
            <hr/>
            <div className="grid">
                <div className="col"></div>
                <div className="col"></div>
                <div className="col">
                    <p className="font-bold">Date: 04/01/2024</p>
                </div>
            </div>
            <div>
                <p className="font-bold">ID: 11 - OPD6 PATIENT (MALE) / 13 Y Mob.No: 01811223355</p>
            </div>
            <hr/>
            <div className="grid">
                <div className="col ml-7">
                    Chief Conplaints
                </div>
                <div className="col">
                    Clinicla Findings
                </div>
            </div>
            <hr/>
            <div className="flex justify-content-center">
               
            </div>
        </div>
    )

}