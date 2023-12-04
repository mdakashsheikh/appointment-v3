import { format } from 'date-fns';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { Checkbox } from "primereact/checkbox";
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Galleria } from 'primereact/galleria';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { getJWTDoctor, getUserName} from '../../../utils/utils';
import { PatientService, URL } from '../../../demo/service/PatientService';
import { FollowUpServices } from '../../../demo/service/FollowUpService';
import { OperatorService } from '../../../demo/service/OperatorService';

const Visit_Details = () => {

    const emptyFollowSMS = {
        id: 0,
        status: '',
        is_active: 'Success',
    }
    
    const [products, setProducts] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    let [followData, setFollowData] = useState(null);
    const [operatorData, setOperatorData] = useState(null);
    const [smsDailog, setSMSDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [smsData, setSmsData] = useState(emptyFollowSMS);
    const toast = useRef(null);
    const galleria = useRef();
    const dt = useRef(null);
    const [toggleRefresh, setTogleRefresh] = useState(false);
    const [images, setImages] = useState(['https://primefaces.org/cdn/primereact/images/galleria/galleria10.jpg']);
    const [jwtToken, setJwtToken] = useState(null);
    const [jwtUser, setJWTUser] = useState(null);

    useEffect(() => {
        const jwtToken = getJWTDoctor();
        const user = getUserName();

        if(!jwtToken) {
            return window.location = '/auth/login-assis'
        }

        setJwtToken(jwtToken);
        setJWTUser(user);
    }, [])

    const responsiveOptions = [
        {
            breakpoint: '1500px',
            numVisible: 5
        },
        {
            breakpoint: '1024px',
            numVisible: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];


    const itemTemplate = (item) => {
        return <img src={item} alt="img" style={{ width: '100%', maxHeight: '70vh', display: 'block' }} />;
    }

    const thumbnailTemplate = (item) => {
        return <img src={item} alt="img" style={{ display: 'block', width: '100px' }} />;
    }
    
    useEffect(() => {
        if(!jwtToken) {
            return;
        }

        PatientService.getPatient().then((res) => setProducts(res.data.AllData));
        FollowUpServices.getFollow().then((res) => setFollowData(res.data.AllData));
        OperatorService.getOperator().then((res) => setOperatorData(res.data.AllData));
    
    }, [jwtToken, globalFilter, toggleRefresh]);


    const editSMSData = (smsData) => {
        setSmsData({ ...smsData });
        setSMSDialog(true)
    };

    const hideSMSDialog = () => {
        setSMSDialog(false);
    };

    const sendSMS =() => {
        let doctorFilter = operatorData?.filter(item => item.dr_name == smsData.doctor);
        let doctorNumber = doctorFilter?.map(item => item.phone).toString();

        if(smsData.chamber, smsData.followUpDate, smsData.doctor, smsData.name, smsData.phone, doctorNumber, smsData._id) {
            FollowUpServices.postFollowSMS(
                smsData.chamber,
                smsData.followUpDate,
                smsData.doctor,
                smsData.name,
                smsData.phone,
                doctorNumber,
                smsData._id,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setSMSDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Successfully sent sms', life: 3000 });
            })
        }
    }

    // const filterData = masterOperator?.filter(item => item.userName == jwtUser);
    // const Doctor = filterData?.map(item => item.dr_name).toString();

    // const filterPatients = patients?.filter(item => item.doctor == Doctor)

    const filterData = operatorData?.filter(item => item.userName == jwtUser);
    console.log(jwtUser)
    const Doctor = filterData?.map(item => item.dr_name).toString();

    console.log(Doctor, "DOCTOR_NAME")

    const filterFollow = followData?.filter(item => item.doctor == Doctor);

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Patient Name</span>
                {rowData.name}
            </>
        );
    }

    const phoneBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Phone</span>
                {rowData.phone}
            </>
        );
    }

    const firstApointBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">First Appointment</span>
                {rowData.date1.slice(0, 10)}
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

    const doctorBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Chamber</span>
                {rowData.doctor}
            </>
        );
    }

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {rowData.price}
            </>
        );
    }

    const visit_timeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Visit Time</span>
                {rowData.visit_time}
            </>
        );
    }

    const followUpDateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">follow Up Date</span>
                {rowData.followUpDate.slice(0, 10)}
            </>
        );
    }

    const imageBodyTemplate1 = (rowData) => {
        const rowImages = rowData.image?.map(item => `${URL}/uploads/` + item);
        return (
            <>
                <span className="p-column-title">Image</span>
                <Button label="Show" icon="pi pi-external-link" onClick={() => {
                    if(rowImages?.length > 0) {
                        setImages(rowImages);
                        galleria.current.show();
                    }
                }} />
            </>
        );
    }

    const smsStatusBodyTemplate = (rowData) => {
        return (
            <>
                 <span className="p-column-title">SMS Status</span>
                 {rowData.is_active}
            </>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-send" severity="success" rounded className="mr-2" onClick={() => editSMSData(rowData)} />
            </>
        );
    };

    const sendSmsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideSMSDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={sendSMS} />
        </>
    );

    const topHeader = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <h2 className="m-0">Patient Details</h2>
                </div>
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
                <Calendar className='ml-2' placeholder='Searching by Date...' showClear onChange={(e) => setGlobalFilter(format(new Date(e.target.value), 'yyyy-MM-dd, h:mm:ss a').slice(0, 10))}/>
            </span>
        </div>
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

    return (
        <>
        <div className="grid crud-demo">
            <div >
                {images?.length > 0 && (
                <Galleria ref={galleria} value={images}
                    responsiveOptions={responsiveOptions} numVisible={5} style={{ maxWidth: '50%' }} 
                        circular fullScreen showItemNavigators item={itemTemplate} thumbnail={thumbnailTemplate} 
                />
                )}
            </div>
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar
                        className="mb-4"
                        left={topHeader}
                    ></Toolbar>
                    <DataTable
                        ref={dt}
                        // value={globalFilter? followData : []}
                        value={filterFollow}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        rows={5}
                        globalFilter={globalFilter}
                        emptyMessage="Empty Data..."
                        header={header}
                        responsiveLayout="scroll"
                    >

                         <Column
                            field="name"
                            header="Patient Name"
                            body={nameBodyTemplate}
                            headerStyle={{ minWidth: "3rem" }}
                        ></Column>
                        <Column
                            field="phone"
                            header="Phone"
                            body={phoneBodyTemplate}
                            headerStyle={{ minWidth: "3rem" }}
                        ></Column>
                        <Column
                            field="date1"
                            header="First Appointment"
                            body={firstApointBodyTemplate}
                            headerStyle={{ minWidth: "3rem" }}
                        ></Column>
                        <Column
                            field="price"
                            header="Visit Fees"
                            body={priceBodyTemplate}
                            headerStyle={{ minWidth: "3rem" }}
                        ></Column>
                        <Column
                            field="chamber"
                            header="Chamber"
                            body={chamberBodyTemplate}
                            headerStyle={{ minWidth: "3rem" }}
                        ></Column>
                        <Column
                            field="doctor"
                            header="Doctor"
                            body={doctorBodyTemplate}
                            headerStyle={{ minWidth: "3rem" }}
                        ></Column>
                        <Column
                            field="visit_time"
                            header="Visit Time"
                            body={visit_timeBodyTemplate}
                            headerStyle={{ minWidth: "3rem" }}
                        ></Column>
                        <Column
                            field="followUpDate"
                            header="Follow-Up-Date"
                            body={followUpDateBodyTemplate}
                            headerStyle={{ minWidth: "3rem" }}
                        ></Column>
                        <Column
                            field="image"
                            header="image"
                            body={imageBodyTemplate1}
                            headerStyle={{ minWidth: "3rem" }}
                        >
                        </Column>
                        <Column
                            header="SMS Status"
                            body={smsStatusBodyTemplate}
                            headerStyle={{ minWidth: "2rem" }}
                        ></Column>
                        <Column
                            header="Send SMS"
                            body={actionBodyTemplate}
                            headerStyle={{ minWidth: "2rem" }}
                        ></Column>
                    </DataTable>

                    <Dialog visible={smsDailog} style={{ width: '450px' }} header="Confirm" modal footer={sendSmsDialogFooter} onHide={hideSMSDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-comments mr-3" style={{ fontSize: '2rem' }} />
                            {followData && (
                                <span>
                                    Are you sure you want to Send Follow Up SMS <b>{followData.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                    
                </div>
            </div>
        </div>
        </>
    );
}

export default  Visit_Details;
