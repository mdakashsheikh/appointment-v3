import React, { useRef } from "react";
import { useFormik } from 'formik';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';

export default function FormikDoc() {
    const toast = useRef(null);
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    const show = (data) => {
        toast.current.show({ severity: 'success', summary: 'Form Submitted', detail: `${data.city.name}` });
    };

    const formik = useFormik({
        initialValues: {
            city: ''
        },
        validate: (data) => {
            let errors = {};

            if (!data.city) {
                errors.city = 'City is required.';
            }

            return errors;
        },
        onSubmit: (data) => {
            data.city && show(data);
            formik.resetForm();
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };
    
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
                    <h3>Ibne Sina Hospital</h3>
                    <p>House # 48, Road # 9/A, Dhanmondi, Dhaka 1209</p>
                    <p>Ph.No: 01711223344, 01911223344</p>
                    <p>Open: 6PM - 9PM</p>
                    <p>Close: Sunday</p>
                </div>
            </div>
            <hr className="bold"/>
            <div className="flex justify-content-center">
               
            </div>
        </div>
    )
}