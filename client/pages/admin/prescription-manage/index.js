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
import { getJWTAdmin } from '../../../admin-utils/utils';
import { TimeService } from '../../../demo/service/TimeService';
import { PrescriptionService } from '../../../demo/service/PrescriptionService';
import { URL } from '../../../demo/service/PatientService';

const Prescription_Manage = () => {
    let emptyProduct = {
        id: 0,
        medicineTime: '',
        medicineTiming: '',
        medicineLimite: '',
    };

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [toggleRefresh, setTogleRefresh] = useState(false);
    const [jwtToken, setJwtToken] = useState(null);
    const [files1, setFiles1] = useState(null);

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
        PrescriptionService.getPrescribe().then((res) => setProducts(res.data.AllData));

    }, [ jwtToken,toggleRefresh]);

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


    const saveProduct = () => {
        setSubmitted(true);

        console.log("PPPP1",product)

        if( product.medicineTime && product.medicineTiming && product.medicineLimite, product._id) {
            PrescriptionService.editPrescribe(
                product.medicineTime,
                product.medicineTiming,
                product.medicineLimite,
                product._id,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Prescription Management is Updated', life: 3000 });
            })
        } else if( product.medicineTime && product.medicineTiming && product.medicineLimite) {
            PrescriptionService.postPrescribe(
                product.medicineTime,
                product.medicineTiming,
                product.medicineLimite
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Prescription Management is Created', life: 3000 });
            })
        }
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    console.log('product--->', product)

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        PrescriptionService.deletePrescribe(product._id).then(() => {
            setTogleRefresh(!toggleRefresh);
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Time is Deleted', life: 3000 });
        })
    };



    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };


    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.id}
            </>
        );
    };


    const medicineTimeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Medicine Time</span>
                {rowData.medicineTime}
            </>
        );
    }

    const medicineTimeingBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Medicine Timing</span>
                {rowData.medicineTiming}
            </>
        );
    }

    const medicineLimiteBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Medicine Limite</span>
                {rowData.medicineLimite}
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
                PrescriptionService.togglePrescribe(is_active, rowData._id).then(() => {
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
                    <h2 className="m-0">Prescription Management</h2>
                </div>
            </React.Fragment>
        );
    };

    const customBase64Uploader = async (event) => {
        // convert file to base64 encoded
        const file = event.files[0];
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

        reader.readAsDataURL(blob);

        reader.onloadend = function () {
            const base64data = reader.result;
        };
    };

    console.log(files1, "KKKKK")

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <FileUpload 
                    mode="basic" 
                    accept=".csv" 
                    maxFileSize={1000000} 
                    url={`${URL}/ok`}
                    onUpload={handleCSV}
                    label="Import" 
                    chooseLabel="Import" 
                    className="mr-2 inline-block" 
                    
                /> */}
                <FileUpload mode="basic" name="Import" url="/api/upload" accept=".csv" customUpload uploadHandler={customBase64Uploader} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <Button
                    label="Add Prescription Management"
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
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} Out of {totalRecords} Time-Mangements"
                        globalFilter={globalFilter}
                        emptyMessage="Empty item in Here."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column
                            field="medicineTime"
                            header="Medicine Time"
                            sortable
                            body={medicineTimeBodyTemplate}
                            headerStyle={{ minWidth: "10rem" }}
                        ></Column>
                         <Column
                            field="medicineTime"
                            header="Medicine Timing"
                            body={medicineTimeingBodyTemplate}
                            headerStyle={{ minWidth: "15rem" }}
                        ></Column>
                        <Column
                            field="medicineLimite"
                            header="Medicine Limite"
                            body={medicineLimiteBodyTemplate}
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
                        header="Add Prescription Management"
                        modal
                        className="p-fluid"
                        footer={productDialogFooter}
                        onHide={hideDialog}
                    >
                
                        <div className="field">
                            <label htmlFor="medicineTime">Medicine Time</label>
                            <InputText 
                                id="medicineTime" 
                                value={product.medicineTime} 
                                onChange={(e) => onInputChange(e, "medicineTime")} 
                                placeholder="1+1+1"
                                required 
                                autoFocus 
                                className={classNames({ 'p-invalid': submitted && !product.medicineTime })} 
                                />
                            {submitted && !product.medicineTime && <small className="p-invalid">
                                Medicine Time is required.
                            </small>}
                        </div>
                        <div className="field">
                            <label htmlFor="medicineTiming">Medicine Timing</label>
                            <InputText 
                                id="medicineTiming" 
                                value={product.medicineTiming} 
                                onChange={(e) => onInputChange(e, "medicineTiming")} 
                                placeholder="After Meal or Before Meal"
                                required 
                                className={classNames({ 'p-invalid': submitted && !product.medicineTiming })} 
                                />
                            {submitted && !product.medicineTiming && <small className="p-invalid">
                                Medicine Timing is required.
                            </small>}
                        </div>
                        <div className="field">
                            <label htmlFor="medicineLimite">Medicine Limite</label>
                            <InputText 
                                id="medicineLimite" 
                                value={product.medicineLimite} 
                                onChange={(e) => onInputChange(e, "medicineLimite")} 
                                placeholder="10 Days or 15 Days"
                                required 
                                className={classNames({ 'p-invalid': submitted && !product.medicineLimite })} 
                                />
                            {submitted && !product.medicineLimite && <small className="p-invalid">
                                Medicine Limite is required.
                            </small>}
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

export default  Prescription_Manage;
