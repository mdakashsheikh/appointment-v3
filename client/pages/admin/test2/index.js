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
        <div className="card flex justify-content-center">
            <form onSubmit={formik.handleSubmit} className="flex flex-column align-items-center gap-2">
                <Toast ref={toast} />
                <Dropdown
                    inputId="city"
                    name="city"
                    value={formik.values.city}
                    options={cities}
                    optionLabel="name"
                    placeholder="Select a City"
                    className={classNames({ 'p-invalid': isFormFieldInvalid('city') })}
                    onChange={(e) => {
                        formik.setFieldValue('city', e.value);
                    }}
                />
                {getFormErrorMessage('city')}
                <Button type="submit" label="Submit" />
            </form>
        </div>
    )
}