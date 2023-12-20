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
import { TimeService } from '../../../../demo/service/TimeService';
import { MedicineLimiteService } from '../../../../demo/service/MedicineLimiteService';


const Medicine_Limite = () => {
    let emptyLimite = {
        id: 0,
        medicine_limite: '',
        details: '',
    };

    const [limites, setLimites] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [limite, setLimite] = useState(emptyLimite);
    const [selectedLimites, setSelectedLimites] = useState(null);
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
        // TimeService.getTime().then((res) => setLimites(res.data.AllData));
        MedicineLimiteService.getLimite().then((res) => setLimites(res.data.AllData));

    }, [ jwtToken,toggleRefresh]);

    const openNew = () => {
        setLimite(emptyLimite);
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

        console.log("PPPP1",limite)

        if( limite.medicine_limite && limite.details, limite._id) {
            MedicineLimiteService.editLimite(
                limite.medicine_limite,
                limite.details,
                limite._id,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Medicine Limite is Updated', life: 3000 });
            })
        } else if( limite.medicine_limite ) {
            MedicineLimiteService.postLimite(
                limite.medicine_limite,
                limite.details,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'New Medicine Limite is Created', life: 3000 });
            })
        }
    };

    const editProduct = (limite) => {
        setLimite({ ...limite });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (limite) => {
        setLimite(limite);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        MedicineLimiteService.deleteLimite(limite._id).then(() => {
            setTogleRefresh(!toggleRefresh);
            setDeleteProductDialog(false);
            setLimite(emptyLimite);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Medicine Limite is Deleted', life: 3000 });
        })
    };


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...limite };
        _product[`${name}`] = val;

        setLimite(_product);
    };

    const limiteBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Medicine Limite</span>
                {rowData.medicine_limite}
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
                MedicineLimiteService.toggleLimite(is_active, rowData._id).then(() => {
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
                    <h2 className="m-0">Medicine Limite</h2>
                </div>
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <Button
                    label="Add Medicine Limite"
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

    if(limites == null) {
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
                        value={limites}
                        selection={selectedLimites}
                        onSelectionChange={(e) => setSelectedLimites(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} Out of {totalRecords} Medicine Limite"
                        globalFilter={globalFilter}
                        emptyMessage="Empty."
                        header={header}
                        responsiveLayout="scroll"
                    >

                        {/* <Column
                            field="sl"
                            header="SL"
                            body={codeBodyTemplate}
                            sortable
                        ></Column> */}
                        <Column
                            field="medicine_limite"
                            header="Medicine Limite"
                            sortable
                            body={limiteBodyTemplate}
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
                            <label htmlFor="medicine_limite">Medicine Limite</label>
                            <InputText 
                                id="medicin_limite" 
                                value={limite.medicine_limite} 
                                onChange={(e) => onInputChange(e, "medicine_limite")} 
                                placeholder='15 Days'
                                required 
                                autoFocus 
                                className={classNames({ 'p-invalid': submitted && !limite.medicine_limite })} 
                                />
                            {submitted && !limite.medicine_limite && <small className="p-invalid">
                                Medicine Limite is required.
                            </small>}
                        </div>
                        <div className="field">
                            <label htmlFor="details">Description</label>
                            <InputText 
                                id="details" 
                                value={limite.details} 
                                onChange={(e) => onInputChange(e, "details")} 
                            />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {limite && (
                                <span>
                                    Are you sure you want to delete <b>{limite.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                    
                </div>
            </div>
        </div>
    );
};

export default  Medicine_Limite;
