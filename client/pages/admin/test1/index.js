import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { getJWTAdmin } from '../../../admin-utils/utils';
import { TimeService } from '../../../demo/service/TimeService';
import { PatientService } from '../../../demo/service/PatientService';
import { MedicineTimeService } from '../../../demo/service/MedecineTimeService';
import { MedicineRuleService } from '../../../demo/service/MedicineRuleService';
import { MedicineLimiteService } from '../../../demo/service/MedicineLimiteService';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import { PrescriptionService } from '../../../demo/service/PrescriptionService';

const Prescription_Page = () => {
    let emptyPatient = {
        id: null,
        date1:'',
        doctor: '',
        specialist: '',
        serial: '',
        name: '',
        phone:'',
        age: '',
        gender:'',
        time1:'',
        chamber: '',
        category: null,
        price: 0,
        details: '',
        status: '',
        medicine_info: [{ medicine_name: '', taking_time: '', taking_rule: '', taking_limite: ''}],
    };

    const [patients, setPatients] = useState(null);
    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [product, setProduct] = useState(emptyPatient);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [toggleRefresh, setTogleRefresh] = useState(false);
    const [jwtToken, setJwtToken] = useState(null);

    const [mTime, setMTime] = useState(null);
    const [mLimite, setMLimite] = useState(null);
    const [mRule, setMRule] = useState(null);
    const [medi, setMedi] = useState([]);

    useEffect(() => {
        const jwtToken = getJWTAdmin();

        if(!jwtToken) {
            return window.location = '/auth/login'
        }

        setJwtToken(jwtToken);
    }, [])


    useEffect(() => {
        if(!jwtToken) {
            return;
        }

        PatientService.getPatient().then((res) => setPatients(res.data.AllData));
        TimeService.getTime().then((res) => setProducts(res.data.AllData));
        MedicineTimeService.getMTime().then((res) => setMTime(res.data.AllData));
        MedicineRuleService.getRule().then((res) => setMRule(res.data.AllData));
        MedicineLimiteService.getLimite().then((res) => setMLimite(res.data.AllData));

    }, [ jwtToken,toggleRefresh]);

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };


    const saveProduct = () => {
        setSubmitted(true);

        console.log("PPPP1",product)

        if( medi && product._id) {
            PrescriptionService.postPrescribe(
                medi,
                product._id,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'New Prescription is Created', life: 3000 });
            })
        } 
        // else if( medi && product._id) {
        //     PrescriptionService.postPrescribe(
        //         medi,
        //         product._id,
        //     ).then(() => {
        //         setTogleRefresh(!toggleRefresh);
        //         setProductDialog(false);
        //         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'New Prescription is Created', life: 3000 });
        //     })
        // }
    };
    

    const editProduct = (product) => {
        const empty_medicine_info = emptyPatient.medicine_info;
        const medicine_info = product.medicine_info || empty_medicine_info;
        setProduct({ ...product || '' , medicine_info});
        console.log(product, 'Goru')
        setProductDialog(true);
    };

    const deleteProduct = () => {
        TimeService.deleteTime(product._id).then(() => {
            setTogleRefresh(!toggleRefresh);
            setDeleteProductDialog(false);
            setProduct(emptyPatient);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Time is Deleted', life: 3000 });
        })
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onMedicineChange = (e, name, i) => {
        // console.log('Nothing', e, name, i);
        let val = (e.target && e.target.value) || ''; 
        let _data = { ...product};
        _data[name][i] = {[e.target.name]: val};
        setProduct(_data)
    }

    // const onSetChange = (val) => {
    //     let _data = { ...product};
    //     _data[medicine_info] = val.medicine_info;
    // }


    const mTimeFiltered = mTime?.filter((item) => item.is_active == '1');
    const timeList = mTimeFiltered?.map((item) => {
        return {  label: item.m_time, value: item.m_time }
    })

    const mRuleFiltered = mRule?.filter((item) => item.is_active == '1');
    const ruleList = mRuleFiltered?.map((item) => {
        return {  label: item.m_rule, value: item.m_rule }
    })

    const mLimiteFiltered = mLimite?.filter((item) => item.is_active == '1');
    const limiteList = mLimiteFiltered?.map(item => {
        return { label: item.medicine_limite, value: item.medicine_limite }
    })

    const medicineList = [
        { label: 'Napa', value: 'Napa' },
        { label: 'Pantonix', value: 'Pantonix' },
        { label: 'Osemoprazole', value: 'Osemoprazole' },
    ];

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const phoneBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Phone</span>
                {rowData.phone}
            </>
        );
    }

    const appointDateBodyTemplete = (rowData) => {
        return (
            <>
                <span className="p-column-title">Appointment Date</span>
                   {rowData.date1.slice(0, 10)}
                
            </>
        );
    }

    const serialBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Serial Number</span>
                {rowData.serial}
            </>
        );
    }

    const problemBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Problem</span>
                {rowData.details}
            </>
        );
    }

    const chamberBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Chamber</span>
                {rowData.chamber}
            </>
        );
    }

    const dateBodyTemplete = () => {
        return (
            <>
                <span className="p-column-title">Date</span>
                {rowData.date1}
            </>
        )
    }

    const timeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Time</span>
                {rowData.time1}
            </>
        );
    }
    
    const genderBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Gender</span>
                {rowData.gender}
            </>
        );
    }

    const prescriptionBodyTemplate = (rowData) => {
        return(
            <Button icon="pi pi-book"severity='success' rounded className='mr-2' onClick={() => editProduct(rowData)}/>
        )
    }

        
    const topHeader = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <h2 className="m-0">Patient List</h2>
                </div>
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button type='submit' label="Save" icon="pi pi-check" text onSubmit={saveProduct} />
        </>
    );
    
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );

    if(products == null) {
        return (
            <div className="card">
                <div className="border-round border-1 surface-border p-4 surface-card">
                    <div className="flex mb-3">
                        <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                        <div>
                            <Skeleton width="10rem" className="mb-2"></Skeleton>
                            <Skeleton width="5rem" className="mb-2"></Skeleton>
                            <Skeleton height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <Skeleton width="100%" height="570px"></Skeleton>
                    <div className="flex justify-content-between mt-3">
                        <Skeleton width="4rem" height="2rem"></Skeleton>
                        <Skeleton width="4rem" height="2rem"></Skeleton>
                    </div>
                </div>
            </div>
        )
    }

    // medicine_info: [{ medicine_name: '', taking_time: '', taking_rule: '', taking_limite: ''}]

    const onAdd = () => {
        const newData = { ...product};
        const newAdd = { medicine_name: '', taking_time: '', taking_rule: '', taking_limite: '' };
        console.log(product,'product')
        newData.medicine_info = [...product.medicine_info, newAdd ]
        setProduct(newData);
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar
                        className="mb-4"
                        left={topHeader}
                    ></Toolbar>
                    <DataTable
                        ref={dt}
                        value={patients}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} Out of {totalRecords} Patients"
                        globalFilter={globalFilter}
                        emptyMessage="Empty Patients"
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column
                            field="date1"
                            header="Appointment Date"
                            sortable
                            body={appointDateBodyTemplete}
                            headerStyle={{ minWidth: "2rem" }}
                        ></Column>
                        <Column
                            field="serial"
                            header="Serial Number"
                            body={serialBodyTemplate}
                        ></Column>
                        <Column
                            field="name"
                            header="Name"
                            sortable
                            body={nameBodyTemplate}
                            headerStyle={{ minWidth: "2rem" }}
                        ></Column>
                        <Column
                            field="phone"
                            header="Phone"
                            body={phoneBodyTemplate}
                        ></Column>
                        <Column
                            field="gender"
                            header="Gender"
                            sortable
                            body={genderBodyTemplate}
                            headerStyle={{ minWidth: "3rem" }}
                        ></Column>
                        <Column
                            field="time1"
                            header="Time"
                            body={timeBodyTemplate}
                            headerStyle={{ minWidth: "3rem" }}
                        ></Column>
                        <Column
                            field="chamber"
                            header="Chamber"
                            sortable
                            body={chamberBodyTemplate}
                            headerStyle={{ minWidth: "2rem" }}
                        ></Column>
                        <Column
                            field="details"
                            header="Problem"
                            body={problemBodyTemplate}
                            headerStyle={{ minWidth: "2rem" }}
                        ></Column>
                        <Column
                            header="Prescription"
                            body={prescriptionBodyTemplate}
                            headerStyle={{ minWidth: "1rem" }}
                        ></Column>
                    </DataTable>

                    <Dialog
                        visible={productDialog}
                        style={{ width: "1100px" }}
                        header="Create a Prescription"
                        modal
                        className="p-fluid"
                        // footer={productDialogFooter}
                        onHide={hideDialog}
                    >
                        <Formik
                            initialValues={{
                                medicine_info: [{medicine_name: '', medicine_time: '', medicine_rule: '', medicine_limite: ''}]
                            }}

                            // onSubmit={values => {
                                
                            //     console.log("Values->", values, product);
                            // }}
                        >
                            {(formik) => (
                                <Form>
                                    <div>
                                        <FieldArray 
                                            name='medicine_info'
                                            render={(arrayHelpers) => {
                                                return (
                                                    <div>
                                                        {setMedi(formik.values.medicine_info)}
                                                        {formik.values.medicine_info.map((medicine_info, i) => (
                                                        <div key={i}>
                                                            <div className="formgrid grid" >
                                                                <div className="field col">
                                                                    <label htmlFor="medicine_name">Medicine Name</label>
                                                                    <Dropdown
                                                                        inputId="medicine_name"
                                                                        name="medicine_name"
                                                                        // value={formik.values.city}
                                                                        value={formik.values.medicine_info[i].medicine_name}
                                                                        options={medicineList}
                                                                        optionLabel="label"
                                                                        placeholder="Select a Medicine"
                                                                        onChange={(e) => {
                                                                            formik.setFieldValue(`medicine_info.${i}.medicine_name`, e.value);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="field col">
                                                                    <label htmlFor="medicine_time">Taking Time</label>
                                                                    <Dropdown
                                                                        inputId="medicine_time"
                                                                        name="medicine_time"
                                                                        // value={formik.values.city}
                                                                        value={formik.values.medicine_info[i].medicine_time}
                                                                        options={timeList}
                                                                        optionLabel="label"
                                                                        placeholder="Select a Time"
                                                                        onChange={(e) => {
                                                                            formik.setFieldValue(`medicine_info.${i}.medicine_time`, e.value);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="field col">
                                                                    <label htmlFor="medicine_rule">Taking Rule</label>
                                                                    <Dropdown
                                                                        inputId="medicine_rule"
                                                                        name="medicine_rule"
                                                                        // value={formik.values.city}
                                                                        value={formik.values.medicine_info[i].medicine_rule}
                                                                        options={ruleList}
                                                                        optionLabel="label"
                                                                        placeholder="Select a Rule"
                                                                        onChange={(e) => {
                                                                            formik.setFieldValue(`medicine_info.${i}.medicine_rule`, e.value);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="field col">
                                                                    <label htmlFor="medicine_limite">Taking Limite</label>
                                                                    <Dropdown
                                                                        inputId="medicine_limite"
                                                                        name="medicine_limite"
                                                                        // value={formik.values.city}
                                                                        value={formik.values.medicine_info[i].medicine_limite}
                                                                        options={limiteList}
                                                                        optionLabel="label"
                                                                        placeholder="Select a Limite"
                                                                        onChange={(e) => {
                                                                            formik.setFieldValue(`medicine_info.${i}.medicine_limite`, e.value);
                                                                        }}
                                                                    />
                                                                </div>
                                                                {/* <div className="field col">
                                                                    <label htmlFor="doctor">Taking Limite</label>
                                                                    <Field
                                                                        type='text'
                                                                        name={`medicine_in.${i}.medicine_limite`}
                                                                        id={`medicine_in.${i}.medicine_limite`}
                                                                    />
                                                                </div> */}
                                                                {i > 0 && <button 
                                                                    type='sunmit'
                                                                    onClick={() => arrayHelpers.remove(i)} 
                                                                    className=' mt-4 mb-4'
                                                                >
                                                                    ❌
                                                                </button>} 
                                                                
                                                            </div>
                                                        </div>
                                                        ))}
                                                        <div>
                                                        <button 
                                                            type="submit" 
                                
                                                            onClick={() => arrayHelpers.insert(formik.values.medicine_info.length + 1, 
                                                                {medicine_name:'', medicine_time: '', medicine_rule: '', medicine_limite: ''}
                                                            )}
                                                        >
                                                            + Add
                                                        </button>
                                                        </div>
                                                    </div>
                                                )
                                            }}
                                        />
                                    </div>
                                    <>
                                        <Button label="Save" type='submit'  text onClick={saveProduct} />
                                    </>
                                </Form>
                            )}
                        </Formik>
                    </Dialog>
                    
                </div>
            </div>
        </div>
    );
};

export default  Prescription_Page;
