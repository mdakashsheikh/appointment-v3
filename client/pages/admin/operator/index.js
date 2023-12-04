import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { getJWTAdmin } from '../../../admin-utils/utils';
import { OperatorService } from '../../../demo/service/OperatorService';
import { DoctorService } from '../../../demo/service/DoctorService';

const Operator = () => {
    let emptyProduct = {
        id: 0,
        name: '',
        userName: '',
        phone: '',
        password: '',
        dr_name: '',
    };

    const [products, setProducts] = useState(null);
    const [masterDoctor, setMasterDoctor] = useState(null);
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


    useEffect(() => {
        if(!jwtToken) {
            return;
        }

        OperatorService.getOperator().then((res) => setProducts(res.data.AllData));
        DoctorService.getDoctor().then((res) => setMasterDoctor(res.data.AllData));

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

        if( product.name && product.userName && product.phone &&  product.password && product.dr_name && product._id) {
            OperatorService.editOperator(
                product.name,
                product.userName,
                product.phone,
                product.password,
                product.dr_name,
                product._id,

            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Operator is Updated', life: 3000 });
            })
        } else if( product.name && product.userName && product.phone &&  product.password && product.dr_name) {
            OperatorService.postOperator(
                product.name,
                product.userName,
                product.phone,
                product.password,
                product.dr_name

            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'New Operator is Created', life: 3000 });
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
        OperatorService.deleteOperator(product._id).then(() => {
            setTogleRefresh(!toggleRefresh);
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Operator is Deleted', life: 3000 });
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
    }

    const doctorList = masterDoctor?.map((item) => {
        return { label: item.name, value: item.name }
    })

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    }

    const userNameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">User-Name</span>
                {rowData.userName}
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

    const dr_nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Dr. Name</span>
                {rowData.dr_name}
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
                    <h2 className="m-0">Operator</h2>
                </div>
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <Button
                    label="Add Operator"
                    icon="pi pi-plus"
                    severity="sucess"
                    className="mr-2"
                    onClick={openNew}
                />
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search by Name..." />
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

    // console.log("operator", operator)

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
                        emptyMessage="Empty the List."
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
                            field="name"
                            header="Name"
                            body={nameBodyTemplate}
                            headerStyle={{ minWidth: "15rem" }}
                        ></Column> 
                        <Column
                            field="specialist"
                            header="User-Name"
                            body={userNameBodyTemplate}
                            headerStyle={{ minWidth: "15rem" }}
                        ></Column> 
                        <Column
                            field="designation"
                            header="Phone"
                            body={phoneBodyTemplate}
                            headerStyle={{ minWidth: "15rem" }}
                        ></Column> 
                        {/* <Column
                            field="degree"
                            header="Degree"
                            body={degreeBodyTemplate}
                            headerStyle={{ minWidth: "15rem" }}
                        ></Column> */}
                        <Column
                            field="experience"
                            header="Dr. Name"
                            body={dr_nameBodyTemplate}
                            headerStyle={{ minWidth: "15rem" }}
                        ></Column>
                        {/* <Column
                            header="Status"
                            body={statusBodyTemplate}
                            headerStyle={{ minWidth: "10rem" }}
                        ></Column> */}
                        <Column
                            header="Action"
                            body={actionBodyTemplate}
                            headerStyle={{ minWidth: "10rem" }}
                        ></Column>
                    </DataTable>

                    <Dialog
                        visible={productDialog}
                        style={{ width: "450px" }}
                        header="Add Operator"
                        modal
                        className="p-fluid"
                        footer={productDialogFooter}
                        onHide={hideDialog}
                    >
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText 
                                id="name" 
                                value={product.name} 
                                onChange={(e) => onInputChange(e, "name")} 
                                required 
                                autoFocus
                                className={classNames({ 'p-invalid': submitted && !product.name })} 
                            />
                            {submitted && !product.name && <small className="p-invalid">
                                Doctor Name is required.
                            </small>}
                        </div>

                        <div className="field">
                            <label htmlFor="userName">User-Name</label>
                            <InputText 
                                id="userName" 
                                value={product.userName} 
                                onChange={(e) => onInputChange(e, "userName")} 
                                required 
                                className={classNames({ 'p-invalid': submitted && !product.userName })} 
                            />
                            {submitted && !product.userName && <small className="p-invalid">
                                User Name is required.
                            </small>}
                        </div>
                    
                        <div className="field">
                            <label htmlFor="phone">Phone</label>
                            <InputText 
                                id="phone" 
                                value={product.phone} 
                                onChange={(e) => onInputChange(e, "phone")} 
                                required 
                                className={classNames({ 'p-invalid': submitted && !product.phone })} 
                            />
                            {submitted && !product.phone && <small className="p-invalid">
                                Phone Number is required.
                            </small>}
                        </div>
                        <div className="field">
                            <label htmlFor="password">PassWord</label>
                            <Password 
                                inputid="password" 
                                value={product.password} 
                                onChange={(e) => onInputChange(e, "password")} 
                                placeholder="Password"
                                toggleMask className="w-full mb-5" 
                                inputClassName="w-full p-3 md:w-30rem"
                            >
                            </Password>
                            {submitted && !product.password && <small className="p-invalid">
                                Password is required.
                            </small>}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="specialist">Doctor</label>
                                <Dropdown
                                    value={product.dr_name}
                                    name='dr_name'
                                    onChange={(e) => onSelectionChange(e, "dr_name")}
                                    options={doctorList}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a Doctor"
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !product.specialist,
                                    })}
                                />
                                </div>
                                {submitted && !product.specialist && (
                                    <small className="p-invalid">
                                        Specialization is required.
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

export default  Operator;
