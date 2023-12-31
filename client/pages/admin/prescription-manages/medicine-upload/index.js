import { Papa } from 'papaparse';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { ToggleButton } from 'primereact/togglebutton';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { getJWTAdmin } from '../../../../admin-utils/utils';
import { MedicineTimeService } from '../../../../demo/service/MedecineTimeService';

const Medicine_Upload = () => {
    let emptyTime = {
        id: 0,
        brand_name: '',
        unit_name: '',
        generic_name: '',
        company_name: '',
    };

    const [medicines, setMedicines] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [csvDialog, setCSVDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [medicine, setMedicine] = useState(emptyTime);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [toggleRefresh, setTogleRefresh] = useState(false);
    const [jwtToken, setJwtToken] = useState(null);
    const [csvData, setCSVData] = useState([]);

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

        MedicineTimeService.getMTime().then((res) => setMedicines(res.data.AllData));

    }, [ jwtToken,toggleRefresh]);

    const openNew = () => {
        setMedicine(emptyTime);
        setSubmitted(false);
        setProductDialog(true);
    };

    const openCSV = () => {
        setMedicine(emptyTime);
        setSubmitted(false);
        setCSVDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideCSVDialog = () => {
        setSubmitted(false);
        setCSVDialog(false);
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };


    const saveProduct = () => {
        setSubmitted(true);

        console.log("PPPP1",medicine)

        if( medicine.m_time && medicine.details, medicine._id) {
            MedicineTimeService.editMTime(
                medicine.m_time,
                medicine.details,
                medicine._id,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Time is Updated', life: 3000 });
            })
        } else if( medicine.m_time ) {
            MedicineTimeService.postMTime(
                medicine.m_time,
                medicine.details,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'New Time is Created', life: 3000 });
            })
        }
    };

    const saveCSV = () => {
        setSubmitted(true);

    }

    const editProduct = (medicine) => {
        setMedicine({ ...medicine });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (medicine) => {
        setMedicine(medicine);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        MedicineTimeService.deleteMTime(medicine._id).then(() => {
            setTogleRefresh(!toggleRefresh);
            setDeleteProductDialog(false);
            setMedicine(emptyTime);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Time is Deleted', life: 3000 });
        })
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...medicine };
        _product[`${name}`] = val;

        setMedicine(_product);
    };

    const m_timeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Medicine Time</span>
                {rowData.m_time}
            </>
        );
    }

    const detailsBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Details</span>
                {rowData.details}
            </>
        );
    }

    const statusBodyTemplate = (rowData) => {
        return (
            <ToggleButton onLabel="Active" offLabel="Inactive" onIcon="pi pi-check" offIcon="pi pi-times" 
            checked={rowData.is_active != '0'} onChange={(e) => {
                let is_active = '0';
                if (rowData.is_active == '0') {
                    is_active = '1'
                }
                MedicineTimeService.toggleMTime(is_active, rowData._id).then(() => {
                setTogleRefresh(!toggleRefresh)
                })
             }} />
        );
    }

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
                    <h2 className="m-0">Medicine Upload</h2>
                </div>

            </React.Fragment>
        );
    };
    
    const handleCSV = (e) => {
        Papa.parse(e.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function(result) {
                const columnArray = [];
                const valuesArray = [];

                result.data.map((d) => {
                     columnArray.push(Object.keys(d));
                     valuesArray.push(Object.values(d))
                });

                setCSVData(result.data);
            }
        })
    }

    console.log('CSV-Data', csvData);

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Upload Medicine CSV" icon="pi pi-upload" severity="sucess" className="mr-2 inline-block" onClick={openCSV} />
                {/* <FileUpload mode="basic" accept=".csv" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" onClick={handleCSV} /> */}
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <Button
                    label="Add Medicine"
                    icon="pi pi-plus"
                    severity="sucess"
                    className="mr-2"
                    onChange={openNew}
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

    const csvDialogFooter = (
        <>
            <Button label='Cancel' icon='pi pi-times' text onClick={hideCSVDialog} />
            <Button label='Save' icon='pi pi-check' text onClick={saveCSV}/>
        </>
    )

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );

    if(medicines == null) {
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
                        value={medicines}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} Out of {totalRecords} Medicine Time"
                        globalFilter={globalFilter}
                        emptyMessage="Empty."
                        header={header}
                        responsiveLayout="scroll"
                    >

                        <Column
                            field="m_time"
                            header="Medicine Time"
                            sortable
                            body={m_timeBodyTemplate}
                            headerStyle={{ minWidth: "10rem" }}
                        ></Column>
                         <Column
                            field="details"
                            header="Details"
                            body={detailsBodyTemplate}
                            headerStyle={{ minWidth: "15rem" }}
                        ></Column>
                        <Column
                            header="Status"
                            body={statusBodyTemplate}
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
                        style={{ width: "450px" }}
                        header="Add Medicine"
                        modal
                        className="p-fluid"
                        footer={productDialogFooter}
                        onHide={hideDialog}
                    >
                
                        <div className="field">
                            <label htmlFor="brand_name">Brand Name</label>
                            <InputText 
                                id="brand_name" 
                                value={medicine.brand_name} 
                                onChange={(e) => onInputChange(e, "brand_name")} 
                                required 
                                autoFocus 
                                className={classNames({ 'p-invalid': submitted && !medicine.brand_name })} 
                                />
                            {submitted && !medicine.brand_name && <small className="p-invalid">
                                Brand is required.
                            </small>}
                        </div>
                        <div className="field">
                            <label htmlFor="unit_name">Unit Name</label>
                            <InputText 
                                id="unit_name" 
                                value={medicine.unit_name} 
                                onChange={(e) => onInputChange(e, "unit_name")} 
                                required 
                                className={classNames({ 'p-invalid': submitted && !medicine.unit_name })} 
                                />
                            {submitted && !medicine.unit_name && <small className="p-invalid">
                                Unit name is required.
                            </small>}
                        </div>
                        <div className="field">
                            <label htmlFor="generic_name">Generic Name</label>
                            <InputText 
                                id="generic_name" 
                                value={medicine.generic_name} 
                                onChange={(e) => onInputChange(e, "generic_name")} 
                                required 
                                className={classNames({ 'p-invalid': submitted && !medicine.generic_name })} 
                                />
                            {submitted && !medicine.generic_name && <small className="p-invalid">
                                Generic name is required.
                            </small>}
                        </div>
                        <div className="field">
                            <label htmlFor="company_name">Company Name</label>
                            <InputText 
                                id="company_name" 
                                value={medicine.company_name} 
                                onChange={(e) => onInputChange(e, "company_name")} 
                                required
                                className={classNames({ 'p-invalid': submitted && !medicine.company_name })} 
                                />
                            {submitted && !medicine.company_name && <small className="p-invalid">
                                Company name is required.
                            </small>}
                        </div>
                        
                    </Dialog>

                    <Dialog
                        visible={csvDialog}
                        style={{ width: "450px" }}
                        header="Add CSV File"
                        modal
                        className="p-fluid"
                        footer={csvDialogFooter}
                        onHide={hideCSVDialog}
                    >
                        <FileUpload 
                            mode="basic" 
                            accept=".csv"
                            label="Upload CSV File" 
                            chooseLabel="Upload CSV File" 
                            className="mr-2 inline-block" 
                            onClick={handleCSV} 
                        />
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {medicine && (
                                <span>
                                    Are you sure you want to delete <b>{medicine.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                    
                </div>
            </div>
        </div>
    );
};

export default  Medicine_Upload;
