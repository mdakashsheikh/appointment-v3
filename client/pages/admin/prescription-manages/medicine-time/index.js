import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { ToggleButton } from 'primereact/togglebutton';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { getJWTAdmin } from '../../../../admin-utils/utils';
import { MedicineTimeService } from '../../../../demo/service/MedecineTimeService';

const Medicine_Time = () => {
    let emptyTime = {
        id: 0,
        m_time: '',
        details: '',
    };

    const [mTimes, setMTimes] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [mTime, setMTime] = useState(emptyTime);
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


    useEffect(() => {
        if(!jwtToken) {
            return;
        }

        MedicineTimeService.getMTime().then((res) => setMTimes(res.data.AllData));

    }, [ jwtToken,toggleRefresh]);

    const openNew = () => {
        setMTime(emptyTime);
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

        console.log("PPPP1",mTime)

        if( mTime.m_time && mTime.details, mTime._id) {
            MedicineTimeService.editMTime(
                mTime.m_time,
                mTime.details,
                mTime._id,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Time is Updated', life: 3000 });
            })
        } else if( mTime.m_time ) {
            MedicineTimeService.postMTime(
                mTime.m_time,
                mTime.details,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'New Time is Created', life: 3000 });
            })
        }
    };

    const editProduct = (mTime) => {
        setMTime({ ...mTime });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (mTime) => {
        setMTime(mTime);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        MedicineTimeService.deleteMTime(mTime._id).then(() => {
            setTogleRefresh(!toggleRefresh);
            setDeleteProductDialog(false);
            setMTime(emptyTime);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Time is Deleted', life: 3000 });
        })
    };



    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...mTime };
        _product[`${name}`] = val;

        setMTime(_product);
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
                    <h2 className="m-0">Medicine Time</h2>
                </div>
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <Button
                    label="Add Medicine Time"
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

    if(mTimes == null) {
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
                    ></Toolbar>
                    <DataTable
                        ref={dt}
                        value={mTimes}
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
                        header="Add Time Management "
                        modal
                        className="p-fluid"
                        footer={productDialogFooter}
                        onHide={hideDialog}
                    >
                
                        <div className="field">
                            <label htmlFor="m_time">Medicine Time</label>
                            <InputText 
                                id="m_time" 
                                value={mTime.m_time} 
                                onChange={(e) => onInputChange(e, "m_time")} 
                                placeholder='1 + 1 + 1'
                                required 
                                autoFocus 
                                className={classNames({ 'p-invalid': submitted && !mTime.m_time })} 
                                />
                            {submitted && !mTime.m_time && <small className="p-invalid">
                                Medicine Time is required.
                            </small>}
                        </div>
                        <div className="field">
                            <label htmlFor="details">Details</label>
                            <InputText 
                                id="details" 
                                value={mTime.details} 
                                onChange={(e) => onInputChange(e, "details")}
                            />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {mTime && (
                                <span>
                                    Are you sure you want to delete <b>{mTime.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                    
                </div>
            </div>
        </div>
    );
};

export default  Medicine_Time;
