import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { getJWTAdmin } from '../../../admin-utils/utils';
import { SMSTemService } from '../../../demo/service/SMSTemService';

const Chamber_Manage = () => {
    let emptyProduct = {
        id: 0,
        title: '',
        sms1: '',
        address: '',
    };

    const [checked, setChecked] = useState(true);
    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [data1, setData1] = useState(null);
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


    useEffect(() => {
        if(!jwtToken) {
            return;
        }

        SMSTemService.getSMS().then((res) => {
            setProducts(res.data.AllData)
            setData1(res.data.AllData)
        })

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

        if( product.title && sms1 && product._id ) {
            SMSTemService.editSMS(
                product.title,
                product.sms1,
                product._id
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Chamber is Updated', life: 3000 });
            })
        } else if( sms1 ) {
            SMSTemService.postSMS(
                product.title,
                product.sms1,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'New Chamber is Created', life: 3000 });
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
        SMSTemService.deleteSMS(product._id).then(() => {
            setTogleRefresh(!toggleRefresh);
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Chamber is Deleted', life: 3000 });
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

    const smsList = [
        { label: 'Serial Update SMS', value: 'Serial Update SMS'},
        { label: 'Follow Up SMS', value: 'Follow Up SMS'},
        { label: 'Payment Completion SMS', value: 'Payment Completion SMS'},
        { label: 'Dr. Visit Completion SMS', value: 'Dr. Visit Completion SMS'},
    ];


    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.id}
            </>
        );
    };

    const titleBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Title</span>
                {rowData.title}
            </>
        );
    }
    const smsBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">SMS</span>
                {rowData.sms1}
            </>
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
                    <h2 className="m-0">SMS Templete</h2>
                </div>
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <Button
                    label="Add SMS"
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
    
    const filteredSMS = data1?.filter(item => item.title == 'title1');
    const mapedSMS = filteredSMS?.map(item => item.sms1).toString();
    console.log('filSMS', mapedSMS)

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

    // console.log(product)

    console.log("DATA1-----------", data1)

    // console.log("SMS1", sms1)


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
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="Epmty."
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
                            field="title"
                            header="Title"
                            body={titleBodyTemplate}
                            headerStyle={{ minWidth: "20rem" }}
                        ></Column>
                        <Column
                            field="sms1"
                            header="SMS"
                            body="Text"
                            headerStyle={{ minWidth: "20rem" }}
                        ></Column>
                        <Column
                            header="Action"
                            body={actionBodyTemplate}
                            headerStyle={{ minWidth: "10rem" }}
                        ></Column>
                    </DataTable>

                    <Dialog
                        visible={productDialog}
                        style={{ width: "1200px" }}
                        header="Add New SMS "
                        modal
                        className="p-fluid"
                        footer={productDialogFooter}
                        onHide={hideDialog}
                    >
                        <div className="field">
                            <label htmlFor="address">Rules</label>
                            <p>Pateint Name: name</p>
                            <p>serial Number: serial</p>
                            <p>Dorctor Name: doctor_name</p>
                            <p>Date: date</p>
                            <p>Time: time</p>
                            <p>Chamber Name: chamber</p>
                        </div>
                        <div className="field">
                            <label htmlFor="title">Title</label>
                            <Dropdown
                                    value={product.title}
                                    name='title'
                                    onChange={(e) => onSelectionChange(e, "title")}
                                    options={smsList}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a sms"
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !product.title,
                                    })}
                                />
                                {submitted && !product.title && (
                                    <small className="p-invalid">
                                        SMS Title is required.
                                    </small>
                                )}
                        </div>

                        <div className="field">
                            <label htmlFor="sms1">SMS Details</label>
                            <InputTextarea
                                id="sms1"
                                value={product.sms1}
                                onChange={(e) =>
                                    onInputChange(e, "sms1")
                                }
                                required
                                rows={10}
                                cols={20}
                            />
                            {submitted && !product.sms1 && <small className="p-invalid">
                                SMS Details is required.
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
}

export default  Chamber_Manage;
