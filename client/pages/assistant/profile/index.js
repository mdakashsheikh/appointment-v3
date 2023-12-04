import { Toolbar } from 'primereact/toolbar';
import { Skeleton } from 'primereact/skeleton';
import React, { useEffect, useState } from 'react';
import { getJWTDoctor, getUserName } from '../../../utils/utils';
import { OperatorService } from '../../../demo/service/OperatorService';


const Doctor_Manage = () => {

    const [msOperator, setMsOperator] = useState(null);
    const [jwtToken, setJwtToken] = useState(null);
    const [jwtUser, setJwtUser] = useState('');

    useEffect(() => {
        const jwtToken = getJWTDoctor();
        const user = getUserName();

        if(!jwtToken) {
            return window.location = '/auth/login-assis'
        }
        
        setJwtToken(jwtToken);
        setJwtUser(user);
    })


    useEffect(() => {
        if(!jwtToken) {
            return;
        }

        OperatorService.getOperator().then((res) => setMsOperator(res.data.AllData))
        
    }, [jwtToken]);
    

    const filterData = msOperator?.filter(item => item.userName == jwtUser);
    const Doctor = filterData?.map(item => item.dr_name).toString();

    console.log(Doctor)
        
    const topHeader = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <h2 className="m-0">{Doctor}</h2>
                </div>
            </React.Fragment>
        );
    };

    if(msOperator == null) {
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
                    <Toolbar
                        className="mb-4"
                        left={topHeader}
                    ></Toolbar>
                   
                        <div className='my-2'>
                            <h3 className='mt-1'>Operator Name: {filterData?.map(item => item.name)}</h3>
                            <h3 className='mt-1'>Operator Phone: {filterData?.map(item => item.phone)}</h3>
                            <h3 className='mt-1'>User Name: {filterData?.map(item => item.userName)}</h3>
                            <h3 className='mt-1'>Password : {filterData?.map(item => item.password)}</h3>
                        </div>
            
                    
                </div>
            </div>
        </div>
    );
};

export default  Doctor_Manage;
