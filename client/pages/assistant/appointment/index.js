import { format } from 'date-fns';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from "primereact/checkbox";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { getJWTDoctor, getUserName } from '../../../utils/utils';
import { PatientService, URL } from '../../../demo/service/PatientService';
import { DoctorService } from '../../../demo/service/DoctorService';
import { FollowUpServices } from '../../../demo/service/FollowUpService';
import { OperatorService } from '../../../demo/service/OperatorService';
import { AvailableService } from '../../../demo/service/AvailableService';

const Appointment = () => {
    let emptyProduct = {
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
        status: ''
    };


    let emptyFollo = {
        id: null,
        visit_status: false,
        price: '',
        followUpDate: '',
        visit_time:'',
        image: '',
    }

    const [patients, setPatients] = useState(null);
    const [masterDoctor, setMasterDoctor] = useState(null);
    const [masterAvailable, setMasterAvailable] = useState(null);
    const [timeHook, setTimeHook] = useState(null)
    const [msAvailable, setMsAvailable] = useState(null);
    const [masterOperator, setMasterOperator] = useState(null);
    const [followData, setFollowData] = useState(null);
    const [checked, setChecked] = useState(false);
    const [file, setFile] = useState([]);
    const [jwtUser, setJWTUser] = useState(null);

    const [productDialog, setProductDialog] = useState(false);

    const [followDialog, setFolloDialog] = useState(false);
    const [follow, setFollow] = useState(emptyFollo);
    const [patient, setPatient] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [light, setLight] = useState(0);
    const [toggleRefresh, setTogleRefresh] = useState(false);
    const [jwtToken, setJwtToken] = useState(null);
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState('center');
    const [sCheck, setSCheck] = useState(null);
    const [dateHo, setDateHo] = useState(null);

    const timeObj = [];

    useEffect(() => {
        const jwtToken = getJWTDoctor();
        const user = getUserName();

        if(!jwtToken) {
            return window.location = '/auth/login-assis'
        }

        setJwtToken(jwtToken);
        setJWTUser(user)
    }, [])


    useEffect(() => {
        if(!jwtToken) {
            return;
        }

        PatientService.getPatient().then((res) => setPatients(res.data.AllData));
        DoctorService.getDoctor().then((res) => setMasterDoctor(res.data.AllData));

        FollowUpServices.getFollow().then((res) => setFollowData(res.data.AllData));
        OperatorService.getOperator().then((res) => setMasterOperator(res.data.AllData));
        AvailableService.getAvail().then((res) => {
            setMasterAvailable(res.data.AllData)
            setMsAvailable(res.data.AllData)
        })
        
    }, [ jwtToken, toggleRefresh]);

    const openNew = () => {
        setPatient(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
        setSCheck(1)
    };

    const openFollow = (patient) => {
        setFollow({
            ...emptyFollo,  
            pid: patient._id,
            pchamber: patient.chamber,
            pspecialist: patient.specialist,
            pdoctor: patient.doctor,
            ptime1: patient.time1,
            pdate1: patient.date1,
            pname: patient.name,
            pphone: patient.phone,
            pserial: patient.serial,
        });
        setChecked(false)
        setPatient({...patient});
        setSubmitted(false);
        setFolloDialog(true)
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideFollowDialog = () => {
        setSubmitted(false);
        setFolloDialog(false);
    };

    follow.visit_status = checked;
  

    const saveProduct = (type) => {
        setSubmitted(true);

        console.log({type, follow, patient,}, "TEST")

        console.log(type, "TYPE", patient, "PRODUCT", follow, "FOLLOW")


        if(type == 'patient' && patient.chamber && patient.specialist && patient.doctor && patient.date1 && patient.time1 && patient.name && patient.age && patient.gender && patient.phone && patient.serial && patient._id) {
            console.log("Edit-----Patient")

            PatientService.editPatient(
                patient.chamber,
                patient.specialist,
                patient.doctor,
                patient.date1,
                patient.time1,
                patient.name,
                patient.age,
                patient.gender,
                patient.phone,
                patient.serial,
                patient._id,
                patient.details,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Patient is Updated', life: 3000 });
            })
        } else if(type == 'patient' && patient._id == undefined && patient.chamber && patient.doctor && patient.date1 && patient.time1 && patient.name && patient.serial) {
            console.log("Create-----Patient")
            PatientService.postPatient(
                patient.chamber,
                patient.specialist,
                patient.doctor,
                patient.date1,
                patient.time1,
                patient.name,
                patient.age,
                patient.gender,
                patient.phone,
                patient.details,
                patient.serial,
                patient.status,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Patient is Created', life: 3000, position:"top-center" });
            })
        } else if(type == 'follow'  && follow.pchamber && follow.pspecialist && follow.pdoctor && follow.pdate1 && follow.ptime1 && follow.pname && follow.pphone && follow.pserial && follow.pid && follow.visit_status && follow.price && follow.followUpDate && follow.visit_time && patient._id ) {
            console.log(patient);

            console.log(patient._id)

            FollowUpServices.editPatientFollow(
                patient._id,
            ).then(() => {
                setFolloDialog(false)
            })

            FollowUpServices.postFollow(
                follow.pchamber,
                follow.pspecialist,
                follow.pdoctor,
                follow.pdate1,
                follow.ptime1,
                follow.pname,
                follow.pphone,
                follow.serial,
                follow.pid,
                follow.visit_status,
                follow.price,
                follow.followUpDate,
                follow.visit_time,
                file,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setFolloDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Follow Up Date is Created', life: 3000 });
            })
        } else if(type == "follow" &&  follow.price && follow.followUpDate && follow.visit_time && follow._id) {
            console.log("EDIT-FOLLOW");
            FollowUpServices.editFollow(
                follow.price,
                follow.followUpDate,
                follow.time1,
                file,
                follow._id,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setFolloDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Follow Up Date is Updated', life: 3000 });
            })
        }
    }; 

    const filterData = masterOperator?.filter(item => item.userName == jwtUser);
    const Doctor = filterData?.map(item => item.dr_name).toString();

    const filterPatients = patients?.filter(item => item.doctor == Doctor)


    const editProduct = (patient) => {
        console.log("EDIT", patient);
        setPatient({ ...patient });
        setProductDialog(true);
        setSCheck(0);
    };

    const editFollow = (follow) => {
        setFollow({...follow});
        setChecked(follow.visit_status);
        setFolloDialog(true);
    }

    const deleteProduct = () => {
        let _products = patients.filter((val) => val.id !== patient.id);
        setPatients(_products);
        setFolloDialog(false);
        setPatient(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const footerContent = (
        <div>
            <Button label="Cancel" icon="pi pi-check" onClick={() => setVisible(false)} autoFocus />
        </div>
    );

    const show = (position) => {
        setPosition(position);
        setVisible(true);
    };

    const onFollowChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _follow = {...follow};
        _follow[`${name}`] = val;

        setFollow(_follow);
    }

    const onCheckChange = (e, name) => {
        let _follow = {...follow};
        _follow[`${name}`] = e.checked;
        
        setFollow(_follow);
    }

    const onFollowDateChange = (e, name) => {
        let _product = {...follow };
        _product[`${name}`] = e.value;
        setFollow(_product);
        // setPatient(_product);

        const test = e.value.toString();
        setTimeHook(test.slice(0, 3));
    }


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...patient };
        _product[`${name}`] = val;

        setPatient(_product);
    };

    const onSelectionChange = (e, name) => {
        let _product = {...patient };
        _product[`${name}`] = e.value;
        setPatient(_product);
    }

    const onDateChange = (e, name) => {
        let _product = {...patient };
        _product[`${name}`] = e.value;
        setPatient(_product);

        const test = e.value.toString();
        setTimeHook(test.slice(0, 3));
        setDateHo(e.value);

        console.log('selectionDate: ', 'name', test, 'typeOf', typeof e.value, 'selection', e.value, 'patient', _product)
    }


    const masterChamberFiltered = masterAvailable?.filter((item) => item.dname == Doctor);    
    const chamberList = masterChamberFiltered?.map((item) => {
        return {  label: item.chamber, value: item.chamber }
    })

    const masterSpecialistFiltered = masterDoctor?.filter((item) => item.is_active == '1' && item.name == Doctor); 
    const specialistList = masterSpecialistFiltered?.map((item) => {
        return { label: item.specialist, value: item.specialist }
    })

    const doctorList = [
        { label: Doctor, value: Doctor},
        
    ];



    const timeFiltered = masterAvailable?.filter(item => item.dname == Doctor);
     const mapTime = timeFiltered?.map(item => {
        timeObj.Sat = item.saturdayT;
        timeObj.Sun = item.sundayT;
        timeObj.Mon = item.mondayT;
        timeObj.Tue = item.tuesdayT;
        timeObj.Wed = item.wednesdayT;
        timeObj.Thu = item.thursdayT;
        timeObj.Fri = item.fridayT;
     })


    let timeList = [];
    if(timeHook == 'Sat') {
       timeList = [
           {label: [`${timeObj.Sat}`], value: `${timeObj.Sat}`}
       ]
    } else if(timeHook == 'Sun') {
       timeList = [
           {label: [`${timeObj.Sun}`], value: `${timeObj.Sun}`}
       ]
    }else if(timeHook == 'Mon') {
       timeList = [
           {label: [`${timeObj.Mon}`], value: `${timeObj.Mon}`}
       ]
    }else if(timeHook == 'Tue') {
       timeList = [
           {label: [`${timeObj.Tue}`], value: `${timeObj.Tue}`}
       ]
    }else if(timeHook == 'Wed') {
       timeList = [
           {label: [`${timeObj.Wed}`], value: `${timeObj.Wed}`}
       ]
    }else if(timeHook == 'Thu') {
       timeList = [
           {label: [`${timeObj.Thu}`], value: `${timeObj.Thu}`}
       ]
    }else if(timeHook == 'Fri') {
       timeList = [
           {label: [`${timeObj.Fri}`], value: `${timeObj.Fri}`}
       ]
    }

    const genderList = [
        { label: 'Male', value: 'male'},
        { label: 'Female', value: 'female'},
    ];

    let stDate;
    let serialDate = null;
    let filSerial = null;



    let msSerila = 0;
    let ans = null;
    if(light == 1) {
        msSerila = msAvailable?.map(item => item.serial-0);
        msSerila = Math.max(...msSerila);

    } else if(masterAvailable != undefined){
        let copySerial = masterAvailable?.filter(item => (item.chamber == patient.chamber) && (item.dname == patient.doctor));
        msSerila = copySerial?.map(item => item.serial-0);
    }

    const numArr = Array.from({ length: msSerila}, (_, index) => index + 1);

    if(sCheck == 0) {
        stDate = patients?.filter(item => item.date1 == patient.date1);
        serialDate = stDate.map(item => item.serial);
        filSerial = serialDate?.filter(item => item != undefined);
        ans = numArr?.filter(item => !filSerial.includes(item.toString()))
        ans.unshift(patient.serial);

    } else if(sCheck == 1) {
        let date2 = format(new Date(dateHo), 'yyyy-MM-dd');
        stDate = patients?.filter(item => item.date1.slice(0, 10) == date2);
        serialDate = stDate.map(item => item.serial);
        filSerial = serialDate?.filter(item => item != undefined);
        ans = numArr?.filter(item => !filSerial.includes(item.toString()))
    }
    
    if(!ans) {
        ans = numArr;
    }
    

    const serialList = ans.map(item => {
        
        return {label: item, value: item}
    })


    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    label="Add Appointment"
                    icon="pi pi-plus"
                    severity="sucess"
                    className="mr-2"
                    onClick={openNew}
                />
                <Button
                    label="Download list"
                    icon="pi pi-download"
                    severity="help"
                    onClick={exportCSV}
                />
            </React.Fragment>
        );
    };


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


    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`patient-badge status-${rowData.status}`} >{rowData.status}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        if(rowData.visit_status == true && rowData.status == "Updated") {
            return (
                <>
                    <Button icon="pi pi-eye" severity="success" rounded className="mr-2" onClick={() => editProduct(rowData)} />
                    <Button icon="pi pi-pencil" severity="success" rounded onClick={() => {
                        let data1 = followData?.filter(item=> item.patient_id == rowData._id);
                        if (data1.length > 0) {
                            editFollow(data1[0]);
                        }
                    }} 
                    />
                </>
            );
        } else if(rowData.serial && !rowData.visit_status) {
            return (
                <>
                    <Button icon="pi pi-eye" severity="success" rounded className="mr-2" onClick={() => editProduct(rowData)} />
                    <Button icon="pi pi-pencil" severity="warning" rounded onClick={() => openFollow(rowData)} />
                </>
            );
        } 
        else {
            return (
                <>
                    <Button icon="pi pi-eye" severity="warning" rounded className="mr-2" onClick={() => editProduct(rowData)} />
                    <Button icon="pi pi-pencil" severity="warning" rounded className="mr-2" onClick={() => show('top')}  />
                </>
            );
        }
        
    };


    const topHeader = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                <h2 className="m-0">Appointment List</h2>
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
            <Button label="Save" icon="pi pi-check" text onClick={() => saveProduct('patient')} />
        </>
    );
    const followDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideFollowDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={ () => saveProduct('follow')} />
        </>
    );
    
    const deleteImage = (image, id) => {
        console.log(image, id)
        FollowUpServices.deleteImage(image, id).then(() => {
            follow.image = follow.image.filter(item1 => item1 != image);
            setFollow({...emptyFollo})
            setFile(follow.image)
            setTogleRefresh(!toggleRefresh);
            setFolloDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Image is Deleted', life: 3000 })
        })
    }

    const imageShow = () => {
        if(follow.image) {
            return follow.image.map((item, i) => {
                return (
                    <div className="p-fileupload-content px-1 py-1" key={i}>
                        <div>
                            <div>
                                </div>
                        </div>
                        <div>
                            <div className="p-fileupload-row">
                                <img role="presentation" className="p-fileupload-file-thumbnail mr-2" src={`${URL}/uploads/` + item}  width="50"></img>
                                <div>
                                    <span>{item}</span>
                                    <span className="p-badge p-component p-badge-success p-fileupload-file-badge">Completed</span>
                                </div>
                                <div>
                                    <button type="button" className="p-button p-component p-button-danger p-button-text p-button-rounded p-button-icon-only">
                                        <span className="p-button-icon p-c pi pi-times" onClick={()=> deleteImage(item, follow._id)}></span>
                                        <span className="p-button-label p-c">&nbsp;</span><span role="presentation" className="p-ink" style={{height: '42px', width: '42px'}}></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    // <div className='formgrid grid'>
                    //     <img src={`${URL}/uploads/` + item} width={100} height={60}/>
                    //     <button className='m-4' onClick={()=> deleteImage(item, follow._id)}>delete</button>
                    // </div>
                )
            })
        }
    }
    
    if(patients == null) {
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

    const chamberAuto = chamberList?.map(item => item.label).toString();
    const specialistAuto = specialistList?.map(item => item.label).toString();
    const timeAuto = timeList?.map(item => item.label).toString();

    console.log('timeAuto', timeAuto)


    console.log({patient, Doctor, chamberAuto, specialistAuto})
    if (!patient.chamber && !patient.doctor && !patient.specialist && chamberAuto) {

        patient.doctor = Doctor
        patient.chamber = chamberAuto
        patient.specialist = specialistAuto
    
    }

    if(timeAuto){
        patient.time1 = timeAuto
    }


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar
                        className="mb-4"
                        left={topHeader}
                        right={rightToolbarTemplate}
                    ></Toolbar>

                    <DataTable
                        ref={dt}
                        value={filterPatients}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={13}
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} out of {totalRecords} Patients"
                        globalFilter={globalFilter}
                        emptyMessage="Not found."
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
                            field="status"
                            header="Status"
                            body={statusBodyTemplate}
                            sortable
                            headerStyle={{ minWidth: "2rem" }}
                        ></Column>
                        <Column
                            header="Action"
                            body={actionBodyTemplate}
                            headerStyle={{ minWidth: "2rem" }}
                        ></Column>
                    </DataTable>

                    <Dialog header="Warning" visible={visible} position='top' style={{ width: '30vw' }} onHide={() => setVisible(false)} footer={footerContent}  >
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '4rem' }} />
                        <span>
                            Please Updated Patient Serial Number
                        </span>
                    </Dialog>

                    <Dialog
                        visible={productDialog}
                        style={{ width: "600px" }}
                        header="Patient Details"
                        modal
                        className="p-fluid"
                        footer={productDialogFooter}
                        onHide={hideDialog}
                    >
                    
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="chamber">Chamber</label>
                                <Dropdown
                                    value={patient.chamber}
                                    name='chamber'
                                    onChange={(e) => onSelectionChange(e, "chamber")}
                                    options={chamberList}
                                    optionLabel="value"
                                    showClear
                                    placeholder="Select a Chamber"
                                    required
                                    autoFocus
                                    className={classNames({
                                        "p-invalid": submitted && !patient.chamber,
                                    })}
                                />
                                </div>
                                {submitted && !patient.chamber && (
                                    <small className="p-invalid">
                                        Chamber is required.
                                    </small>
                                )}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="specialist">Specialization</label>
                                <Dropdown
                                    value={patient.specialist}
                                    name='specialist'
                                    onChange={(e) => onSelectionChange(e, "specialist")}
                                    options={specialistList}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a Specialization"
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !patient.specialist,
                                    })}
                                />
                                {submitted && !patient.chamber && (
                                    <small className="p-invalid">
                                        Specialization is required.
                                    </small>
                                )}
                            </div>
                            <div className="field col">
                                <label htmlFor="doctor">Doctor</label>
                                <Dropdown
                                    value={patient.doctor}
                                    name='doctor'
                                    onChange={(e) => onSelectionChange(e, "doctor")}
                                    options={doctorList}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a Doctor"
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !patient.doctor,
                                    })}
                                />
                                {submitted && !patient.chamber && (
                                    <small className="p-invalid">
                                        Doctor is required.
                                    </small>
                                )}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="date1">Date</label>
                                <Calendar 
                                    value={new Date(patient.date1)}
                                    name='date1' 
                                    onChange={(e) => onDateChange(e, "date1")} 
                                    dateFormat="dd/mm/yy" 
                                    placeholder="Select a Date"
                                    required
                                    showIcon
                                    className={classNames({
                                        "p-invalid": submitted && !patient.date1,
                                    })}
                                />
                                {submitted && !patient.date1 && (
                                    <small className="p-invalid">
                                        Date is required.
                                    </small>
                                )}
                            </div>
                            <div className="field col">
                                <label htmlFor="time1">Time</label>
                                <Dropdown
                                    value={patient.time1}
                                    name='time1'
                                    onChange={(e) => onSelectionChange(e, "time1")}
                                    options={timeList}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a Time"
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !patient.time1,
                                    })}
                                />
                                {submitted && !patient.chamber && (
                                    <small className="p-invalid">
                                        Time is required.
                                    </small>
                                )}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="name">Name</label>
                                <InputText
                                    id="name"
                                    value={patient.name}
                                    onChange={(e) => onInputChange(e, "name")}
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !patient.name,
                                    })}
                                />
                                {submitted && !patient.name && (
                                    <small className="p-invalid">
                                        Name is required.
                                    </small>
                                )}
                            </div>
                            <div className="field col">
                                <label htmlFor="age">Age</label>
                                <InputText
                                    id="age"
                                    value={patient.age}
                                    onChange={(e) => onInputChange(e, "age")}
                                />
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="gender">Gender</label>
                                <Dropdown
                                    value={patient.gender}
                                    name='gender'
                                    onChange={(e) => onSelectionChange(e, "gender")}
                                    options={genderList}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a Gender"
                                />
                            </div>
                            <div className="field col">
                                <label htmlFor="phone">Phone</label>
                                <InputText
                                    id="phone"
                                    value={patient.phone}
                                    onChange={(e) => onInputChange(e, "phone")}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="details">Details</label>
                            <InputTextarea
                                id="details"
                                value={patient.details}
                                onChange={(e) =>
                                    onInputChange(e, "details")
                                }
                                required
                                rows={3}
                                cols={20}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="serial">Add Serial Number</label>
                            <Dropdown 
                                value={Number(patient.serial)} 
                                name='serial'
                                onChange={(e) => onSelectionChange(e, "serial")} 
                                options={serialList} 
                                optionLabel="label" 
                                placeholder="Select a Serial Number" 
                                className={classNames({
                                    "p-invalid": submitted && !patient.serial,
                                })}
                            />
                            {submitted && !patient.serial && (
                                <small className="p-invalid">
                                    Serial Number is required.
                                </small>
                            )}
                        </div>
                    </Dialog>


                    <Dialog
                        visible={followDialog}
                        style={{ width: "550px" }}
                        header="Follow-Up-Date"
                        modal
                        className="p-fluid"
                        footer={followDialogFooter}
                        onHide={hideFollowDialog}
                    >

                        <div className="formgrid grid">
                            <div className="card flex justify-content-center gap-3">
                                    <label htmlFor="age">Visit Status</label> 
                                    <Checkbox onChange={e => setChecked(e.checked)} checked={checked}></Checkbox>
                            </div>
                            <div className="field col">
                                <label htmlFor="price">Amount</label>
                                <InputText
                                    id="price"
                                    value={(follow.price)}
                                    onChange={(e) => onFollowChange(e, "price")}
                                    placeholder='Enter  Dr. Visit Charge'
                                />
                            </div>
                        </div>
                        
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="date1">Follow Up Date</label>
                                <Calendar 
                                    value={new Date(follow.followUpDate)}
                                    name='followUpDate' 
                                    // onChange={(e) => onFollowChange(e, "followUpDate")}
                                    onChange={(e) => onFollowDateChange(e, "followUpDate")} 
                                    dateFormat="dd/mm/yy" 
                                    placeholder="Select a Date"
                                    required
                                    showIcon
                                    className={classNames({
                                        "p-invalid": submitted && !follow.followUpDate,
                                    })}
                                />
                                {submitted && !follow.followUpDate && (
                                    <small className="p-invalid">
                                        Follow Up Date is required.
                                    </small>
                                )}
                            </div>
                            
                            <div className="field col">
                                <label htmlFor="time1">Time to Visit</label>
                                <Dropdown
                                    value={follow.visit_time}
                                    name='time1'
                                    onChange={(e) => onFollowChange(e, "visit_time")}
                                    options={timeList}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a Time"
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !follow.visit_time,
                                    })}
                                />
                                {submitted && !follow.visit_time && (
                                    <small className="p-invalid">
                                        Visit Time is required.
                                    </small>
                                )}
                            </div>
                        </div>

                        <div >
                            <FileUpload 
                                multiple 
                                accept="image/*" 
                                name='photo'
                                // url='//localhost:5000/post-follow-image'
                                url={`${URL}/post-follow-image`}
                                maxFileSize={1000000} 
                                emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} 
                                onUpload={(e)=> { 
                                    
                                    console.log( "slidufgoidh", e)
                                    const data = JSON.parse(e.xhr.responseText)
                                    console.log(data)
                                    setFile([...file, ...data.file1]);
                                }}
                                onRemove={(e)=> { 
                                    console.log("remove", e)
                                }}
                            />
                        </div>
                        <div className='card px-1'>
                            {imageShow()}
                        </div>
                    </Dialog>
                    
                </div>
            </div>
        </div>
    );
};

export default Appointment;
