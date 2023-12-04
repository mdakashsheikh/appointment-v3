import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { getDoctor } from '../utils/utils';
import { getAdmin } from '../admin-utils/utils';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [doctor1, setDoctor1] = useState(null);
    const [admin1, setAdmin1] = useState(null);

    useEffect(() => {
        const doctorRole = getDoctor()
        const adminRole = getAdmin()

        setDoctor1(doctorRole);
        setAdmin1(adminRole);

    }, []);
    

    let userType;
    console.log('ADMIN', admin1);
    console.log('DOCTOR', doctor1);
    if(doctor1) {
        userType = doctor1;
    }
    
    if(admin1) {
        userType = admin1;
    }

    let model = [];

    if(userType == 'admin') {
        model = [
            {
                label: "Home",
                items: [
                    { 
                        label: "Dashboard", 
                        icon: "pi pi-fw pi-home", 
                        to: "/home" 
                    },
                    {
                        label: "Visit Details",
                        icon: "pi pi-database",
                        to: '/admin/follow-data'
                    },
                    {
                        label: "Commercial",
                        icon: "pi pi-calculator",
                        to: '/admin/commercial'
                        
                    }
                ],
            },
            {
                label: "Admin",
                items: [
                    {
                        label: "Appointment List",
                        icon: "pi pi-fw pi-list",
                        to: "/admin/appointment-list",
                    },
                    {
                        label: "Specialization Management",
                        icon: "pi pi-fw pi-briefcase",
                        to: '/admin/specialist-manage'
                    },
                    {
                        label: "Time Management",
                        icon: "pi pi-fw pi-clock",
                        to: '/admin/time-manage'
                    },
                    {
                        label: "Chamber Menagement",
                        icon: "pi pi-fw pi-globe",
                        to: "/admin/chamber-manage"
                    },
                    {
                        label: "Doctor Management",
                        icon: "pi pi-fw pi-user-edit",
                        to: '/admin/doctor-manage'
                    },
                    {
                        label: "Availability Management",
                        icon: "pi pi-fw pi-book",
                        to: "/admin/availability-manage"
                    },
                    // {
                    //     label: "General Setting",
                    //     icon: "pi pi-fw pi-bookmark",
                    //     to: '/pages/general-set'
                    // },
                    {
                        label: "SMS Templates",
                        icon: "pi pi-fw pi-comments",
                        to: '/admin/sms-temp'
                    }
                ],
            },
            {
                label: "Setting",
                icon: "pi pi-fw pi-briefcase",
                to: "/admin",
                items: [
                    {
                        label: "Operator",
                        icon: "pi pi-fw pi-exclamation-circle",
                        to: "/admin/operator",
                    },
                    // {
                    //     label: "Auth",
                    //     icon: "pi pi-fw pi-user",
                    //     items: [
                    //         {
                    //             label: "Login",
                    //             icon: "pi pi-fw pi-sign-in",
                    //             to: "/auth/login",
                    //         },
                    //         {
                    //             label: "Error",
                    //             icon: "pi pi-fw pi-times-circle",
                    //             to: "/auth/error",
                    //         },
                    //         {
                    //             label: "Access Denied",
                    //             icon: "pi pi-fw pi-lock",
                    //             to: "/auth/access",
                    //         },
                    //     ],
                    // },
                    // {
                    //     label: "Not Found",
                    //     icon: "pi pi-fw pi-exclamation-circle",
                    //     to: "/pages/notfound",
                    // },
                ],
            },
        ];
    } else if( userType == 'doctor') {
        model = [
            {
                label: "Home",
                items: [
                    {
                        label: "Dashboard", 
                        icon: "pi pi-fw pi-home", 
                        to: "/doctor" 
                    },
                    {
                        label: "Visit Details",
                        icon: "pi pi-database",
                        to: '/assistant/visit-details'
                    }
                ]
            },
            {
                label: "Admin",
                items: [
                    {
                        label: "Appointment List",
                        icon: "pi pi-fw pi-list",
                        to: "/assistant/appointment",
                    }
                ]
            }
        ];
    }
    

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
