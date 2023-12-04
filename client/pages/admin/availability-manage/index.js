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
import { AvailableService } from '../../../demo/service/AvailableService';
import { DoctorService } from '../../../demo/service/DoctorService';
import { ChamberService } from '../../../demo/service/ChamberService';
import { TimeService } from '../../../demo/service/TimeService';

const Availability_Manage = () => {
    let emptyProduct = {
        dname: '',
        chamber: "",
        time1: "",
        days: "",
        days1: "",
        saturdayT: "",
        sundayT: "",
        mondayT: "",
        tuesdayT: "",
        wednesdayT: "",
        thursdayT: "",
        fridayT: "",
        serial: "",
    };

    const [products, setProducts] = useState(null);
    const [masterDoctor, setMasterDoctor] = useState(null);
    const [masterChamber, setMasterChember] = useState(null);
    const [masterTime, setMasterTime] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [toggleRefresh, setTogleRefresh] = useState(false);
    const [jwtToken, setJwtToken] = useState(null);

    useEffect(() => {
        const jwtToken = getJWTAdmin();

        if(!jwtToken) {
            return window.location = '/auth/login'
        }

        setJwtToken(jwtToken);
    }, [])

    const categories = [
        { name: 'Saturday', key: 'Saturday' },
        { name: 'Sunday', key: 'Sunday' },
        { name: 'Monday', key: 'Monday' },
        { name: 'Tuesday', key: 'Tuesday' },
        { name: 'Wednesday', key: 'Wednesday' },
        { name: 'Thursday', key: 'Thursday' },
        { name: 'Friday', key: 'Friday' },
    ];

    const [selectedCategories, setSelectedCategories] = useState([categories[1]], {days1: ""});

    const onCategoryChange = (e) => {
        let _selectedCategories = [...selectedCategories];

        if (e.checked)
            _selectedCategories.push(e.value);
        else
            _selectedCategories = _selectedCategories.filter(category => category.key !== e.value.key);

        setSelectedCategories(_selectedCategories);
    };

    const weekdays = selectedCategories.map((item) => item.name);
    // console.log("DAYS!", days1);

    useEffect(() => {

        if(!jwtToken) {
            return;
        }

        AvailableService.getAvail().then((res) => setProducts(res.data.AllData));
        DoctorService.getDoctor().then((res) => setMasterDoctor(res.data.AllData));
        ChamberService.getChamber().then((res) => setMasterChember(res.data.AllData));
        TimeService.getTime().then((res) => setMasterTime(res.data.AllData));


    }, [jwtToken, toggleRefresh]);

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        console.log("PPPP1",product)
        console.log("HOP", selectedCategories);

        if( product.dname, product.chamber && weekdays && product.saturdayT && product.sundayT && product.mondayT && product.tuesdayT && product.wednesdayT && product.thursdayT && product.fridayT && product.serial && product._id) {
            AvailableService.editAvail(
                product.dname,
                product.chamber,
                weekdays,
                product.saturdayT,
                product.sundayT,
                product.mondayT,
                product.tuesdayT,
                product.wednesdayT,
                product.thursdayT,
                product.fridayT,
                product.serial,
                product._id,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Availability is Updated', life: 3000 });
            })
        } else if(product.dname, product.chamber && product.serial) {
            AvailableService.postAvail(
                product.dname,
                product.chamber,
                weekdays,
                product.saturdayT,
                product.sundayT,
                product.mondayT,
                product.tuesdayT,
                product.wednesdayT,
                product.thursdayT,
                product.fridayT,
                product.serial,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'New Availability is Created', life: 3000 });
            })
        }
    };
   

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        AvailableService.deleteAvail(product._id).then(() => {
            setTogleRefresh(!toggleRefresh);
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Availability is Deleted', life: 3000 });
        })
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };
    
    const onSelectionChange = (e, name) => {
        let _product = {...product };
        _product[`${name}`] = e.value;
        setProduct(_product);
    };


    const onDaysChange = (e) => {
        let _product = [...product];
        if(e.checked) 
            _product.push(e.value);
        else
            _product = _product.filter(day => day.key !== e.value.key);
        setProduct(_product);
    };

    const masterDoctorFiltered = masterDoctor?.filter((flag) => flag.is_active == '1');
    const doctorList = masterDoctorFiltered?.map((item) => {
        return { label: item.name, value: item.name }
    });

    const masterChamberFiltered = masterChamber?.filter((flag) => flag.is_active == '1');
    const chamberList = masterChamberFiltered?.map((item) => {
        return {  label: item.chamber, value: item.chamber }
    });
    
    const masterTimeFiltered = masterTime?.filter((flag) => flag.is_active == '1');
    const timeList = masterTimeFiltered?.map((item) => {
        return {  
            label: [`${item.st_time} - ${item.en_time}` ], 
            value: [`${item.st_time} - ${item.en_time}` ],
        }
    });
    

    const daysList = [
        { label: 'Saturday', value: 'Saturday'},
        { label: 'Sunday', value: 'Sunday'},
        { label: 'Monday', value: 'Monday'},
        { label: 'Tuesday', value: 'Tuesday'},
        { label: 'Wednesday', value: 'Wednesday'},
        { label: 'Thursday', value: 'Thursday'},
        { label: 'Friday', value: 'Friday'},
    ];

    const doctorBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Doctor</span>
                {rowData.dname}
            </>
        );
    };

    const timeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Time</span>
                {rowData.time1}
            </>
        );
    };

    
    const daysBodyTemplate = (rowData) => {

        return (    
            <>
                <span className="p-column-title">Days</span>
                <div>   
                    Saterday: {rowData.saturdayT || "Not Assign"}<br/>
                    Sunday: {rowData.sundayT || 'Not Assign'} <br/>
                    Monday: {rowData.mondayT || 'Not Assign'} <br/>
                    Tuesday: {rowData.tuesdayT || 'Not Assign'} <br/>
                    Wednesday: {rowData.wednesdayT || 'Not Assign'} <br/>
                    Thursday: {rowData.thursdayT || 'Not Assign'} <br/>
                    Friday: {rowData.fridayT || 'Not Assign'}
                 </div>
                 {console.log('rowData', rowData)}
            </>
        );
    };

    const chamberBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Chamber</span>
                {rowData.chamber}
            </>
        );
    };

    const serialBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Serial</span>
                {rowData.serial}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

        
    const topHeader = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <h2 className="m-0">Availability Management</h2>
                </div>
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <Button
                    label="Add Availability"
                    icon="pi pi-plus"
                    severity="sucess"
                    className="mr-2"
                    onClick={openNew}
                />
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );

    if(masterChamber == null) {
        <h1>Loading.....</h1>
    }

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
        <div className="grid crud-demo">
            <div>
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
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} out of {totalRecords} Availability"
                        globalFilter={globalFilter}
                        emptyMessage="Not Available Availability-Management item in Here."
                        header={header}
                        responsiveLayout="scroll"
                    >

                        <Column
                            field="dname"
                            header="Doctor Name"
                            sortable
                            body={doctorBodyTemplate}
                            headerStyle={{ minWidth: "10rem" }}
                        ></Column>
                        <Column
                            field="chamber"
                            header="Chamber Name"
                            sortable
                            body={chamberBodyTemplate}
                            headerStyle={{ minWidth: "10rem" }}
                        ></Column>
                         <Column
                            field="days"
                            header="Days and Time"
                            body={daysBodyTemplate}
                            headerStyle={{ minWidth: "5rem" }}
                        ></Column>
                         <Column
                            field="serial"
                            header="Serial Range"
                            body={serialBodyTemplate}
                            headerStyle={{ minWidth: "5rem" }}
                        ></Column>
                        <Column
                            header="Action"
                            body={actionBodyTemplate}
                            headerStyle={{ minWidth: "2rem" }}
                        ></Column>
                    </DataTable>

                    <Dialog
                        visible={productDialog}
                        style={{ width: "550px" }}
                        header="Add Availability Management"
                        modal
                        className="p-fluid"
                        footer={productDialogFooter}
                        onHide={hideDialog}
                    >
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="dname">Doctor</label>
                                <Dropdown
                                    value={product.dname}
                                    name='dname'
                                    onChange={(e) => onSelectionChange(e, "dname")}
                                    options={doctorList}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a Doctor"
                                    required
                                    autoFocus
                                    className={classNames({
                                        "p-invalid": submitted && !product.dname,
                                    })}
                                />
                                </div>
                                {submitted && !product.dname && (
                                    <small className="p-invalid">
                                        Doctor is required.
                                    </small>
                                )}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="chamber">Chamber</label>
                                <Dropdown
                                    value={product.chamber}
                                    name='chamber'
                                    onChange={(e) => onSelectionChange(e, "chamber")}
                                    options={chamberList}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a Chamber"
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !product.chamber,
                                    })}
                                />
                                </div>
                                {submitted && !product.chamber && (
                                    <small className="p-invalid">
                                        Chamber is required.
                                    </small>
                                )}
                        </div>

                        <div className="formgrid grid m-2">
                           <div className="card flex justify-content-center">
                                <div className="flex flex-column gap-4">
                                    {categories.map((category) => {
                                        return (
                                            <div className='flex'>
                                                <div key={category.key} className="m-2">
                                                    {/* <Checkbox 
                                                        inputId={category.key} 
                                                        name="category" 
                                                        value={category} 
                                                        onChange={onCategoryChange} 
                                                        checked={selectedCategories.some((item) => item.key === category.key)}  
                                                    /> */}  
                                                    <label htmlFor={category.key} className="ml-2 m-2">
                                                        {category.name}
                                                    </label>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="ml-2">
                                    <div>
                                        <Dropdown
                                            value={product.saturdayT}
                                            name='saturdayT'
                                            onChange={(e) => onSelectionChange(e, "saturdayT")}
                                            options={timeList}
                                            optionLabel="label"
                                            showClear
                                            placeholder="Select Time"
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <Dropdown
                                            value={product.sundayT}
                                            name='sundayT'
                                            onChange={(e) => onSelectionChange(e, "sundayT")}
                                            options={timeList}
                                            optionLabel="label"
                                            showClear
                                            placeholder="Select Time"
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <Dropdown
                                            value={product.mondayT}
                                            name='mondayT'
                                            onChange={(e) => onSelectionChange(e, "mondayT")}
                                            options={timeList}
                                            optionLabel="label"
                                            showClear
                                            placeholder="Select Time"
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <Dropdown
                                            value={product.tuesdayT}
                                            name='tuesdayT'
                                            onChange={(e) => onSelectionChange(e, "tuesdayT")}
                                            options={timeList}
                                            optionLabel="label"
                                            showClear
                                            placeholder="Select Time"
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <Dropdown
                                            value={product.wednesdayT}
                                            name='wednesdayT'
                                            onChange={(e) => onSelectionChange(e, "wednesdayT")}
                                            options={timeList}
                                            optionLabel="label"
                                            showClear
                                            placeholder="Select Time"
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <Dropdown
                                            value={product.thursdayT}
                                            name='thursdayT'
                                            onChange={(e) => onSelectionChange(e, "thursdayT")}
                                            options={timeList}
                                            optionLabel="label"
                                            showClear
                                            placeholder="Select Time"
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <Dropdown
                                            value={product.fridayT}
                                            name='fridayT'
                                            onChange={(e) => onSelectionChange(e, "fridayT")}
                                            options={timeList}
                                            optionLabel="label"
                                            showClear
                                            placeholder="Select Time"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        
                        <div className="field">
                            <label htmlFor="serial">Add Serial Range</label>
                            <InputText
                                id="serial"
                                value={product.serial}
                                onChange={(e) => onInputChange(e, "serial")}
                                required
                                className={classNames({
                                    "p-invalid": submitted && !product.serial,
                                })}
                            />
                            {submitted && !product.serial && (
                                <small className="p-invalid">
                                    Serial Range is required.
                                </small>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                    
                </div>
            </div>
        </div>
    );
};

export default  Availability_Manage;
