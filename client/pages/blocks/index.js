import { Menubar } from 'primereact/menubar';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import AppConfig from '../../layout/AppConfig';
import { LayoutContext } from '../../layout/context/layoutcontext';

const Block = forwardRef((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const toast = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const items = [
        {
            label: 'Home'
        },
        {
            label: 'Services'
        },
        {
            label: 'Contact'
        },
        {
            label: 'Appointment'
        },
    ];

    return (
        <div className="layout-topbar">
            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                
                <Menubar model={items} />
                
                {/* <button className='text'>
                    <span>Home</span>
                </button>

                <button type="text" className="p-link layout-topbar-button">
                    
                    <span>Profile</span>
                </button>
                
                <Link href="/auth/login">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-lock"></i>
                        <span>LogOut</span>
                    </button>
                </Link> */}
            </div>
        </div>
    );
});

export default Block;


Block.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig />
        </React.Fragment>
    );
};