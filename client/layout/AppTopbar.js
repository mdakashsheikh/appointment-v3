import Link from 'next/link';
import { useRouter } from 'next/router';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { deleteAdminToken, getAdmin, getJWTAdmin } from '../admin-utils/utils';
// import { getJWTAdmin } from '../../../admin-utils/utils';
import { LayoutContext } from './context/layoutcontext';
import { deleteDoctorToken, getDoctor, getJWTDoctor } from '../utils/utils';

const AppTopbar = forwardRef((props, ref) => {

    const router = useRouter();
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const toast = useRef(null);
    const [jwtTokenDoctor, setJwtTokenDoctor] = useState(null);
    const [jwtTokenAdmin, setJwtTokenAdmin] = useState(null);
    const [jwtDoctor, setJwtDoctor] = useState(null);
    const [jwtAdmin, setJwtAdmin] = useState(null);

    useEffect(() => {
        const jwtDoctorT = getJWTDoctor();
        const jwtAdminT = getJWTAdmin();
        const jwtD = getDoctor();
        const jwtA = getAdmin();

        setJwtTokenDoctor(jwtDoctorT);
        setJwtTokenAdmin(jwtAdminT);
        setJwtDoctor(jwtD);
        setJwtAdmin(jwtA);
    }, [])

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const handleLogOut = () => {
        if(jwtAdmin && jwtTokenAdmin) {
            deleteAdminToken();
            router.push('/auth/login');
        }
        else if(jwtDoctor && jwtTokenDoctor) {
            deleteDoctorToken();
            router.push('/auth/login-assis')
        }
    }

    const handleProfile = () => {
        if(jwtDoctor && jwtTokenDoctor) {
            router.push('/assistant/profile')
        }
    }


    return (
        <div className="layout-topbar">
            <div className="layout-topbar-logo">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} widt={'true'} alt="logo" />
                <span>Nitto Appointment</span>
            </div>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>

                <button type="button" className="p-link layout-topbar-button" onClick={handleProfile}>
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                
                <button type="button" className="p-link layout-topbar-button" onClick={handleLogOut}>
                    <i className="pi pi-lock"></i>
                    <span>LogOut</span>
                </button>
            </div>
        </div>
    );
});

export default AppTopbar;
