import { format } from 'date-fns';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Galleria } from 'primereact/galleria';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { getJWTDoctor, getUserName} from '../../../utils/utils';
import { PatientService } from '../../../demo/service/PatientService';
import { FollowUpServices } from '../../../demo/service/FollowUpService';
import { DoctorService } from '../../../demo/service/DoctorService';
import { OperatorService } from '../../../demo/service/OperatorService';

const All_Data = () => {
    
    const [products, setProducts] = useState(null);
    const [operatorData, setOperatorData] = useState(null);

    const [selectedProducts, setSelectedProducts] = useState(null);
    let [followData, setFollowData] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const galleria = useRef();
    const dt = useRef(null);
    const [toggleRefresh, setTogleRefresh] = useState(false);
    const [images, setImages] = useState(['https://primefaces.org/cdn/primereact/images/galleria/galleria10.jpg']);
    const [jwtToken, setJwtToken] = useState(null);
    const [jwtUser, setJWTUser] = useState(null);
    const [date2, setDate2] = useState(null);
    const [msDoctor, setMsDoctor] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0)

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
        OperatorService.getOperator().then((res) => setOperatorData(res.data.AllData));
        FollowUpServices.getFollow().then((res) => {
            setFollowData(res.data.AllData)
            const price = getTotalPrice(res.data.AllData)
            setTotalPrice(price);
        })
        DoctorService.getDoctor().then((res) => setMsDoctor(res.data.AllData));

    }, [jwtToken, dt]);

    const filterData = operatorData?.filter(item => item.userName == jwtUser);
    const Doctor = filterData?.map(item => item.dr_name).toString();
    const filterFollow = followData?.filter(item => item.doctor == Doctor);

    const filteredDoctor = msDoctor?.filter(item => item.is_active == '1');
    const doctorList = filteredDoctor?.map(item => {
        return {label: item.name, value: item.name};
    })

    const getTotalPrice = (data) => {
        let price = 0;
        data.forEach(x => price += +x.price)
        return price;
    }

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

    const doctorBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Doctor</span>
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

    const followUpDateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">follow Up Date</span>
                {rowData.followUpDate}
            </>
        );
    }


    const topHeader = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <h2 className="m-0">Commercial Page</h2>
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


    function onValueChange(filteredData) {
        const price = getTotalPrice(filteredData);
        setTotalPrice(price);
    }
    

    return (
        <>
        
        <div className="grid crud-demo">
            <div >
                <Galleria ref={galleria} value={images}
                    responsiveOptions={responsiveOptions} numVisible={5} style={{ maxWidth: '50%' }} 
                    circular fullScreen showItemNavigators item={itemTemplate} thumbnail={thumbnailTemplate} 
                />
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
                        value={filterFollow}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} out of {totalRecords} Patients"
                        globalFilter={globalFilter}
                        emptyMessage="Not found."
                        header={header}
                        responsiveLayout="scroll"
                        onValueChange={onValueChange}
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
                    </DataTable>
                </div>
                
                <div className="card flex justify-content-center">
                    <h1>Total Ammount: {totalPrice}</h1>    
                </div>

            </div>
        </div>
        </>
    );
}

export default  All_Data;
