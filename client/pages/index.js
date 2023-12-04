import React, {useEffect, useContext, useRef, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { StyleClass } from 'primereact/styleclass';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { Toast } from 'primereact/toast';
import AppConfig from '../layout/AppConfig';
import { LayoutContext } from '../layout/context/layoutcontext';
import { classNames } from 'primereact/utils';
import { ChamberService } from '../demo/service/ChamberService';
import { SpecializationService } from '../demo/service/SpecializationService';
import { DoctorService } from '../demo/service/DoctorService';
import { TimeService } from '../demo/service/TimeService';
import { AvailableService } from '../demo/service/AvailableService';
import { PatientService } from '../demo/service/PatientService';

const LandingPage = () => {
    const [isHidden, setIsHidden] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const menuRef = useRef();
    const [checked, setChecked] = useState(false);

    let emptyPatient = {
        chamber: '',
        specialist: '',
        doctor: '',
        date1: '',
        time1: '',
        name: '',
        age: '',
        phone: '',
        gender: '',
        details: '',
    }

    const [masterChamber, setMasterChamber] = useState(null);
    const [masterDoctor, setMasterDoctor] = useState(null);
    const [masterSpecialist, setMasterSpecialist] = useState(null);
    const [msAvailable, setMsAvailable] = useState(null);
    const [masterTime, setMasterTime] = useState(null);
    const [masterAvailable, setMasterAvailable] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [hasEmpty, setHasEmpty] = useState(false);
    const [patient, setPatient] = useState(emptyPatient);
    const [selectedCity, setSelectedCity] = useState(null);
    const [checkDoctor, setCheckDoctor] = useState(null);
    const [checkChamber, setCheckChamber] = useState(null);
    const [checkSpecial, setCheckSpecial] = useState(null);
    const [timeHook, setTimeHook] = useState(null)
    const [light, setLight] = useState(0);
    const [toggleRefresh, setTogleRefresh] = useState(false);
    const toast = useRef(null);
    const form = useForm({ emptyPatient });

    const timeObj = [];

    useEffect(() => {
        ChamberService.getChamber().then((res) => setMasterChamber(res.data.AllData));
        SpecializationService.getSpecial().then((res) => setMasterSpecialist(res.data.AllData));
        DoctorService.getDoctor().then((res) => setMasterDoctor(res.data.AllData));
        TimeService.getTime().then((res) => setMasterTime(res.data.AllData));
        AvailableService.getAvail().then((res) => {
            setMasterAvailable(res.data.AllData)
            setMsAvailable(res.data.AllData);
        })

    }, [toggleRefresh])

    const { control, reset } = useForm({ emptyPatient })

    const handleSubmit = () => {
        setSubmitted(true);

        if(patient.chamber && patient.specialist && patient.doctor && patient.date1 && patient.time1 && patient.name && patient.phone) {
            PatientService.postPatientC(
                patient.chamber,
                patient.specialist,
                patient.doctor,
                patient.date1,
                patient.time1,
                patient.name,
                patient.age,
                patient.gender,
                patient.phone,
                patient.details
            ).then(() => {
                setHasEmpty(false)
                setPatient(emptyPatient);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Form Submitted', life: 3000 });
                setTogleRefresh(!toggleRefresh);
                // setPatient(emptyPatient)
            })
        } else {
            setHasEmpty(true)
        }
    }

    console.log(masterChamber,"MasteChamber");
    console.log(masterAvailable,"masterAvailable");

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _patient = { ...patient };
        _patient[`${name}`] = val;

        setPatient(_patient);
    };

    const onSelectionChange = (e, name) => {
        let _patient = {...patient };
        _patient[`${name}`] = e.value;
        setPatient(_patient);

        if(name == 'chamber' ) {
            setCheckChamber(e.value);
        }
        if(name == 'doctor') {
            setCheckDoctor(e.value);
        }
        if(name == 'specialist'){
            setCheckSpecial(e.value);
        }

        if (e.value == undefined) {
            let newAvail = masterAvailable?.filter(item => item.is_active == '1');

            if (_patient.chamber) {
                newAvail = newAvail?.filter(item => item.chamber == _patient.chamber);
            }

            if (_patient.doctor) {
                newAvail = newAvail?.filter(item => item.dname == _patient.doctor);
            }

            if (_patient.specialist) {
                const doctors = masterDoctor?.filter(item => item.specialist == _patient.specialist)?.map(item => item.name);
                newAvail = newAvail?.filter(item => doctors?.includes(item.dname));
            }

            setMsAvailable(newAvail) ;
            setLight(1);
            return;
        }

        if(name == 'chamber') {
            const newAvail = masterAvailable?.filter(item => item.chamber == _patient.chamber && item.is_active == '1');
            setMsAvailable(newAvail);
            setLight(1);
        }

        if(name == "doctor") {
            let newAvail = msAvailable?.filter(item => item.dname == e.value);
            setMsAvailable(newAvail);
            setLight(1)
        }

        if(name == "specialist") {
            const doctors = masterDoctor?.filter(item => item.specialist == e.value)?.map(item => item.name);
            let newAvail = msAvailable?.filter(item => doctors?.includes(item.dname));
            console.log({newAvail})

            setMsAvailable(newAvail);
            setLight(1)
        }
    };

    const onDateChange = (e, name) => {
        let _patient = {...patient };
        _patient[`${name}`] = e.value;
        setPatient(_patient);

        const test = e.value.toString();
        setTimeHook(test.slice(0, 3));

        console.log('selectionDate: ', 'name', test, 'typeOf', typeof e.value, 'selection', e.value, 'product', _patient)
    }


    let doctorList;
    let specialistList;
    let chamberList;
    let timeList1;


    if(msAvailable == null) {


        const masterChamberFiltered = masterChamber?.filter((item) => item.is_active == '1');    
        chamberList = masterChamberFiltered?.map((item) => {
            return {  label: item.chamber, value: item.chamber }
        })

        const masterDoctorFiltered = masterDoctor?.filter((item) => item.is_active == '1');
        doctorList = masterDoctorFiltered?.map((item) => {
            return { label: item.name, value: item.name }
        })

        const masterSpecialistFiltered = masterSpecialist?.filter((item) => item.is_active == '1'); 
        specialistList = masterSpecialistFiltered?.map((item) => {
            return { label: item.specialist, value: item.specialist }
        })
        
    } else {
    
        const chambers = msAvailable?.map((item) =>  item.chamber);
        const masterChamberFiltered = masterChamber?.filter((item) => chambers?.includes(item.chamber) && item.is_active == '1');    
        
        chamberList = masterChamberFiltered?.map((item) => {
            return {  label: item.chamber, value: item.chamber }
        })

        const doctors = msAvailable?.map((item) =>  item.dname);
        const masterDoctorFiltered = masterDoctor?.filter((item) => doctors?.includes(item.name) && item.is_active == '1');

        doctorList = masterDoctorFiltered?.map((item) => {
            return { label: item.name, value: item.name }
        })

        specialistList = masterDoctorFiltered?.map((item) => {
            return { label: item.specialist, value: item.specialist }
        })
        
    }

    let availObj;
    if(checkDoctor != null) {
        availObj = masterAvailable?.filter(item => item.dname == checkDoctor);

        availObj?.map(item => {
            timeObj.Sat = item.saturdayT;
            timeObj.Sun = item.sundayT;
            timeObj.Mon = item.mondayT;
            timeObj.Tue = item.tuesdayT;
            timeObj.Wed = item.wednesdayT;
            timeObj.Thu = item.thursdayT;
            timeObj.Fri = item.fridayT;
        })
    }
    if(checkChamber != null) {
        availObj = masterAvailable?.filter(item => item.chamber == checkChamber);

        availObj?.map(item => {
            timeObj.Sat = item.saturdayT;
            timeObj.Sun = item.sundayT;
            timeObj.Mon = item.mondayT;
            timeObj.Tue = item.tuesdayT;
            timeObj.Wed = item.wednesdayT;
            timeObj.Thu = item.thursdayT;
            timeObj.Fri = item.fridayT;
        })
    }

    if(checkSpecial != null ) {
        const specialistOne = masterDoctor?.filter(item => item.specialist == checkSpecial);
        const doctorSp = specialistOne?.map(item => item.name).toString()

        availObj = masterAvailable?.filter(item => item.dname == doctorSp);

        availObj?.map(item => {
            timeObj.Sat = item.saturdayT;
            timeObj.Sun = item.sundayT;
            timeObj.Mon = item.mondayT;
            timeObj.Tue = item.tuesdayT;
            timeObj.Wed = item.wednesdayT;
            timeObj.Thu = item.thursdayT;
            timeObj.Fri = item.fridayT;
        })
    }

    let mainTime;
    if(timeHook == 'Sat') {
        mainTime = masterAvailable?.map(item => item.saturdayT);
    }
    if(timeHook == 'Sun') {
        mainTime = masterAvailable?.map(item => item.sundayT);
    }
    if(timeHook == 'Mon') {
        mainTime = masterAvailable?.map(item => item.mondayT);
    }
    if(timeHook == 'Tue') {
        mainTime = masterAvailable?.map(item => item.tuesdayT);
    }
    if(timeHook == 'Wed') {
        mainTime = masterAvailable?.map(item => item.wednesdayT);
    }
    if(timeHook == 'Thu') {
        mainTime = masterAvailable?.map(item => item.thursdayT);
    }
    if(timeHook == 'Fri') {
        mainTime = masterAvailable?.map(item => item.fridayT);
    }

    const masterTimeFiltered = masterTime?.filter((flag) => flag.is_active == '1');
    const timeList = masterTimeFiltered?.map((item) => {
        return {  
            label: [`${item.st_time} - ${item.en_time}` ], 
            value: [`${item.st_time} - ${item.en_time}` ],
        }
    })

    if(timeHook == null) {
        timeList1 = timeList?.map(item => {
            return {label: item.label, value: item.label}
        });
    } 

    else if(timeHook != null && checkSpecial == null && checkDoctor == null && checkChamber == null) {
        timeList1 = mainTime?.map(item => {
            return {label: item, value: item}
        })
    }
    else {
        timeList1 = [
            {label: timeObj[timeHook], value: timeObj[timeHook]}
        ]
    }

    const genderList = [
        { label: 'Male', value: 'male'},
        { label: 'Female', value: 'female'},
    ];


    const toggleMenuItemClick = () => {
        setIsHidden((prevState) => !prevState);
    };

    return (
        <div className="surface-0 flex justify-content-center">
            <div id="home" className="landing-wrapper overflow-hidden">
                <div className="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static">
                    <Link href="/" className="flex align-items-center">
                        <img src={`/layout/images/${layoutConfig.colorScheme === 'light' ? 'logo-dark' : 'logo-white'}.svg`} alt="Sakai Logo" height="50" className="mr-0 lg:mr-2" />
                        <span className="text-900 font-medium text-2xl line-height-3 mr-8">Nitto</span>
                    </Link>
                    <StyleClass nodeRef={menuRef} selector="@next" enterClassName="hidden" leaveToClassName="hidden" hideOnOutsideClick="true">
                        <i ref={menuRef} className="pi pi-bars text-4xl cursor-pointer block lg:hidden text-700"></i>
                    </StyleClass>
                    <div className={classNames('align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2', { hidden: isHidden })} style={{ top: '100%' }}>
                        <ul className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                            <li>
                                <a href="#home" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                    <span>Home</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li>
                                <a href="#features" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                    <span>Features</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li>
                                <a href="#highlights" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                    <span>Highlights</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li>
                                <a href="#appointment" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                    <span>Appointment</span>
                                    <Ripple />
                                </a>
                            </li>
                        </ul>
                        <div className="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                            <Button label="Login" text rounded className="border-none font-light line-height-2 text-blue-500"></Button>
                            <Button label="Register" rounded className="border-none ml-5 font-light line-height-2 bg-blue-500 text-white"></Button>
                        </div>
                    </div>
                </div>

                <div
                    id="hero"
                    className="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
                    style={{ background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #EEEFAF 0%, #C3E3FA 100%)', clipPath: 'ellipse(150% 87% at 93% 13%)' }}
                >
                    <div className="mx-4 md:mx-8 mt-0 md:mt-4">
                        <h1 className="text-6xl font-bold text-gray-900 line-height-2">
                            স্বাগতম,<span className="font-light block">আমি,</span>ডাঃ মোর্শেদা খাতুন (স্বপ্না)
                        </h1>
                        <p className="font-normal text-2xl line-height-3 md:mt-3 text-gray-700">গাইনি রোগ, প্রসূতিবিদ্যা ও বন্ধ্যাত্ব বিশেষজ্ঞ এবং সার্জন</p>
                        <p className="font-normal text-2xl line-height-3 md:mt-3 text-gray-700">সভ্যতা ও উন্নয়নের কেন্দ্র থেকে একেবারে প্রান্তিক পর্যায়ের সকল মানুষের স্বাস্থ্য সেবা প্রাপ্তি নিশ্চিত করাটাই এখন অন্যতম প্রধান চ্যালেঞ্জ হিসাবে গণ্য করা হচ্ছে। স্বাভাবিক স্রোতের বিপরীতে পূর্ন পেশাদারীত্বের সাথে সকল শ্রেণীর মানুষের জন্য স্বাস্থ্য সেবাটাকে সাবলীল, সাশ্রয়ী ও নিশ্চয়তাপূর্ণ করে প্রদানের লক্ষে আমার এই প্রয়াস।</p>
                        
                    </div>
                    <div className="flex justify-content-center md:justify-content-end">
                        <img src="/demo/images/dr-sopna/dr.Swapna-Solo.png" alt="Hero Image" className="w-9  md:w-auto" />
                    </div>
                </div>

                <div id="features" className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                    <div className="grid justify-content-center">
                        <div className="col-12 text-center mt-8 mb-4">
                            <h2 className="text-900 font-normal mb-2">যেসব রোগের চিকিৎসা দেওয়া হয়</h2>
                            {/* <span className="text-600 text-2xl">Placerat in egestas erat...</span> */}
                        </div>

                        <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                <div className="flex align-items-center justify-content-center bg-cyan-200 mb-3" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '10px' }}>
                                    <i className="pi pi-fw pi-star text-2xl text-orange-700"></i>
                                    </div>
                                    <h5 className="mb-2 text-900">নরমাল ডেলিভারি করা</h5>
                                    {/* <span className="text-600">Posuere morbi leo urna molestie.</span> */}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(145,226,237,0.2),rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div className="flex align-items-center justify-content-center bg-cyan-200 mb-3" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '10px' }}>
                                    <i className="pi pi-fw pi-star text-2xl text-orange-700"></i>
                                    </div>
                                    <h5 className="mb-2 text-900">গর্ভ পূর্ববর্তী, গর্ভকালীন, প্রসবকালীন এবং গর্ভ পরবর্তী চিকিৎসা প্রদান</h5>
                                    {/* <span className="text-600">Semper risus in hendrerit.</span> */}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(246, 158, 188, 0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div className="flex align-items-center justify-content-center bg-cyan-200 mb-3" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '10px' }}>
                                    <i className="pi pi-fw pi-star text-2xl text-orange-700"></i>
                                    </div>
                                    <h5 className="mb-2 text-900">মাসিক বন্ধ জনিত সব সমস্যার চিকিৎসা</h5>
                                    {/* <span className="text-600">Non arcu risus quis varius quam quisque.</span> */}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(187, 199, 205, 0.2),rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2),rgba(145, 210, 204, 0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div className="flex align-items-center justify-content-center bg-cyan-200 mb-3" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '10px' }}>
                                        <i className="pi pi-fw pi-star text-2xl text-orange-700"></i>
                                    </div>
                                    <h5 className="mb-2 text-900">বন্ধ্যাত্ব চিকিৎসা করা</h5>
                                    {/* <span className="text-600">Nulla malesuada pellentesque elit.</span> */}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(187, 199, 205, 0.2),rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(145, 226, 237, 0.2),rgba(160, 210, 250, 0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div className="flex align-items-center justify-content-center bg-cyan-200 mb-3" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '10px' }}>
                                        <i className="pi pi-fw pi-star text-2xl text-orange-700"></i>
                                    </div>
                                    <h5 className="mb-2 text-900">বারবার এবরশন হয় এমন রোগীর চিকিৎসা করা</h5>
                                    {/* <span className="text-600">Condimentum lacinia quis vel eros.</span> */}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(251, 199, 145, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(212, 162, 221, 0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div className="flex align-items-center justify-content-center bg-cyan-200 mb-3" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '10px' }}>
                                        <i className="pi pi-fw pi-star text-2xl text-orange-700"></i>
                                    </div>
                                    <h5 className="mb-2 text-900">জরায়ুর টিউমার ওভারিয়ান টিউমার ওভারিয়ান সিস্ট এর চিকিৎসা করা</h5>
                                    {/* <span className="text-600">Convallis tellus id interdum velit laoreet.</span> */}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(160, 210, 250, 0.2)), linear-gradient(180deg, rgba(187, 199, 205, 0.2), rgba(145, 210, 204, 0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div className="flex align-items-center justify-content-center bg-cyan-200 mb-3" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '10px' }}>
                                        <i className="pi pi-fw pi-star text-2xl text-orange-700"></i>
                                    </div>
                                    <h5 className="mb-2 text-900">জন্মনিয়ন্ত্রণ এর পদ্ধতি প্রদান করা</h5>
                                    {/* <span className="text-600">Mauris sit amet massa vitae.</span> */}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(251, 199, 145, 0.2), rgba(160, 210, 250, 0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div className="flex align-items-center justify-content-center bg-cyan-200 mb-3" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '10px' }}>
                                        <i className="pi pi-fw pi-star text-2xl text-orange-700"></i>
                                    </div>
                                    <h5 className="mb-2 text-900">মহিলা রোগীদের যেকোনো ধরনের গাইনি সমস্যার চিকিৎসা প্রদান করা</h5>
                                    {/* <span className="text-600">Elementum nibh tellus molestie nunc non.</span> */}
                                </div>
                            </div>
                        </div>


                        <div
                            className="col-12 mt-8 mb-8 p-2 md:p-8"
                            style={{ borderRadius: '20px', background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #EFE1AF 0%, #C3DCFA 100%)' }}
                        >
                            <div className="flex flex-column justify-content-center align-items-center text-center px-3 py-3 md:py-0">
                                <h3 className="text-gray-900 mb-2">Joséphine Miller</h3>
                                <span className="text-gray-600 text-2xl">Peak Interactive</span>
                                <p className="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-4" style={{ maxWidth: '800px' }}>
                                    “Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                                    laborum.”
                                </p>
                                <img src="/demo/images/landing/peak-logo.svg" className="mt-4" alt="Company logo" />
                            </div>
                        </div>
                    </div>
                </div>

                <div id="highlights" className="py-4 px-4 lg:px-8 mx-0 my-6 lg:mx-8">
                    <div className="text-center">
                        <h2 className="text-900 font-normal mb-2">Powerful Everywhere</h2>
                        <span className="text-600 text-2xl">Amet consectetur adipiscing elit...</span>
                    </div>

                    <div className="grid mt-8 pb-2 md:pb-8">
                        <div className="flex justify-content-center col-12 lg:col-6 bg-purple-100 p-0 flex-order-1 lg:flex-order-0" style={{ borderRadius: '8px' }}>
                            <img src="/demo/images/landing/mockup.svg" className="w-11" alt="mockup mobile" />
                        </div>

                        <div className="col-12 lg:col-6 my-auto flex flex-column lg:align-items-end text-center lg:text-right">
                            <div className="flex align-items-center justify-content-center bg-purple-200 align-self-center lg:align-self-end" style={{ width: '4.2rem', height: '4.2rem', borderRadius: '10px' }}>
                                <i className="pi pi-fw pi-mobile text-5xl text-purple-700"></i>
                            </div>
                            <h2 className="line-height-1 text-900 text-4xl font-normal">Congue Quisque Egestas</h2>
                            <span className="text-700 text-2xl line-height-3 ml-0 md:ml-2" style={{ maxWidth: '650px' }}>
                                Lectus arcu bibendum at varius vel pharetra vel turpis nunc. Eget aliquet nibh praesent tristique magna sit amet purus gravida. Sit amet mattis vulputate enim nulla aliquet.
                            </span>
                        </div>
                    </div>

                    <div className="grid my-8 pt-2 md:pt-8">
                        <div className="col-12 lg:col-6 my-auto flex flex-column text-center lg:text-left lg:align-items-start">
                            <div className="flex align-items-center justify-content-center bg-yellow-200 align-self-center lg:align-self-start" style={{ width: '4.2rem', height: '4.2rem', borderRadius: '10px' }}>
                                <i className="pi pi-fw pi-desktop text-5xl text-yellow-700"></i>
                            </div>
                            <h2 className="line-height-1 text-900 text-4xl font-normal">Celerisque Eu Ultrices</h2>
                            <span className="text-700 text-2xl line-height-3 mr-0 md:mr-2" style={{ maxWidth: '650px' }}>
                                Adipiscing commodo elit at imperdiet dui. Viverra nibh cras pulvinar mattis nunc sed blandit libero. Suspendisse in est ante in. Mauris pharetra et ultrices neque ornare aenean euismod elementum nisi.
                            </span>
                        </div>

                        <div className="flex justify-content-end flex-order-1 sm:flex-order-2 col-12 lg:col-6 bg-yellow-100 p-0" style={{ borderRadius: '8px' }}>
                            <img src="/demo/images/dr-sopna/dr.Swapna-Solo.png" className="w-11" alt="mockup" />
                            
                        </div>
                    </div>
                </div>

                <div id="appointment" className="py-4 px-4 lg:px-8 my-2 md:my-4 ">
                    <div className="text-center">
                        <h2 className="text-900 font-normal mb-2">Get an online Appointment</h2>
                        {/* <span className="text-600 text-2xl">Amet consectetur adipiscing elit...</span> */}
                    </div>
                    
                    <div className='flex align-items-center justify-content-center'>
                        <div className="surface-card mt-8 p-4 shadow-2 border-round w-full lg:w-4 ">
                        <form control={control}>
                        <Toast ref={toast} />
                            <div className="formgrid grid">
                                <div className="field col">
                                    <label htmlFor="chamber" className="font-bold block mb-3 ml-2">Chamber</label>
                                    <Dropdown
                                        value={patient.chamber}
                                        name='chamber'
                                        onChange={(e) => onSelectionChange(e, "chamber")}
                                        options={chamberList}
                                        optionLabel="value"
                                        showClear
                                        placeholder="Select a Chamber"
                                        required
                                        // autoFocus
                                        className={classNames({
                                            "w-full":1,
                                            "p-invalid": hasEmpty && !patient.chamber,
                                        })}
                                    />
                                </div>
                                {hasEmpty && !patient.chamber && (
                                    <small className="p-invalid">
                                        Chamber is required.
                                    </small>
                                )}      
                            </div>


                            <div className="formgrid grid">
                                <div className="field col">
                                    <label htmlFor="specialist" className="font-bold block mb-3 ml-2">Specialization</label>
                                    <Dropdown
                                        value={patient.specialist}
                                        name='specialist'
                                        onChange={(e) => onSelectionChange(e, "specialist")}
                                        options={specialistList}
                                        optionLabel="label"
                                        showClear
                                        placeholder="Select a Specialization"
                                        required
                                        className={classNames({
                                            "w-full":1,
                                            "p-invalid": hasEmpty && !patient.specialist,
                                        })}
                                    />
                                    {hasEmpty && !patient.chamber && (
                                        <small className="p-invalid">
                                            Specialization is required.
                                        </small>
                                    )}
                                </div>

                                <div className="field col">
                                    <label htmlFor="doctor" className="font-bold block mb-3 ml-2">Doctor</label>
                                    <Dropdown
                                        value={patient.doctor}
                                        name='doctor'
                                        onChange={(e) => onSelectionChange(e, "doctor")}
                                        options={doctorList}
                                        optionLabel="label"
                                        showClear
                                        placeholder="Select a Doctor"
                                        required
                                        className={classNames({
                                            "w-full":1,
                                            "p-invalid": hasEmpty && !patient.doctor,
                                        })}
                                    />
                                    {hasEmpty && !patient.doctor && (
                                        <small className="p-invalid">
                                            Doctor is required.
                                        </small>
                                    )}
                                </div>  
                            </div>
                

                            <div className="formgrid grid">
                                <div className="field col">
                                    <label htmlFor="specialist" className="font-bold block mb-3 ml-2">Appointment Date</label>
                                    <Calendar 
                                        value={(patient.date1)}
                                        name='date1' 
                                        onChange={(e) => onDateChange(e, "date1")} 
                                        dateFormat="dd/mm/yy" 
                                        placeholder="Select a Date"
                                        required
                                        showIcon
                                        className={classNames({
                                            "p-invalid": hasEmpty && !patient.date1,
                                        })}
                                    />
                                    {hasEmpty && !patient.specialist && (
                                        <small className="p-invalid">
                                            Date is required.
                                        </small>
                                    )}
                                </div>

                                <div className="field col">
                                    <label htmlFor="time1" className="font-bold block mb-3 ml-2">Time</label>
                                    <Dropdown
                                        value={patient.time1}
                                        name='time1'
                                        onChange={(e) => onSelectionChange(e, "time1")}
                                        options={timeList1}
                                        optionLabel="label"
                                        showClear
                                        placeholder="Select a Time"
                                        required
                                        className={classNames({
                                            "w-full":1,
                                            "p-invalid": hasEmpty && !patient.time1,
                                        })}
                                    />
                                    {hasEmpty && !patient.time1 && (
                                        <small className="p-invalid">
                                            Time is required.
                                        </small>
                                    )}
                                </div>
                            </div>

                            <div className="formgrid grid">
                                <div className="field col">
                                    <label htmlFor="name" className="font-bold block mb-3 ml-2">Name</label>
                                    <InputText
                                        id="name"
                                        value={patient.name}
                                        onChange={(e) => onInputChange(e, "name")}
                                        required
                                        className={classNames({
                                            "w-full":1,
                                            "p-invalid": hasEmpty && !patient.name,
                                        })}
                                    />
                                    {hasEmpty && !patient.name && (
                                        <small className="p-invalid">
                                            Name is required.
                                        </small>
                                    )}
                                </div>

                                <div className="field col">
                                    <label htmlFor="age" className="font-bold block mb-3 ml-2">Age</label>
                                    <InputText
                                        id="age"
                                        value={patient.age}
                                        onChange={(e) => onInputChange(e, "age")}
                                        className='w-full'
                                    />
                                </div>
                            </div>

                            <div className="formgrid grid">
                            <div className="field col">
                                    <label htmlFor="gender" className="font-bold block mb-3 ml-2">Gender</label>
                                    <Dropdown
                                        value={patient.gender}
                                        name='gender'
                                        onChange={(e) => onSelectionChange(e, "gender")}
                                        options={genderList}
                                        optionLabel="label"
                                        showClear
                                        placeholder="Select a Gender"
                                        required
                                        className='w-full'
                                    />
                                </div>  

                                <div className="field col">
                                    <label htmlFor="phone" className="font-bold block mb-3 ml-2">Phone</label>
                                    <InputText
                                        id="phone"
                                        value={patient.phone}
                                        onChange={(e) => onInputChange(e, "phone")}
                                        required
                                        className={classNames({
                                            "w-full":1,
                                            "p-invalid": hasEmpty && !patient.phone,
                                        })}
                                    />
                                    {hasEmpty && !patient.phone && (
                                        <small className="p-invalid">
                                            Phone is required.
                                        </small>
                                    )}
                                </div>
                            </div>


                            <div className="formgrid grid">
                                <div className="field col">
                                <label htmlFor="details" className="font-bold block mb-3 ml-2">Details</label>
                                    <InputTextarea
                                        id="details"
                                        value={patient.details}
                                        onChange={(e) =>
                                            onInputChange(e, "details")
                                        }
                                        required
                                        rows={3}
                                        cols={20}
                                        className='w-full'
                                    />
                                </div>    
                            </div>


                            <div className='text-center'>
                                <Button label="Submit" onClick={handleSubmit}/>
                            </div>
                        </form>

                        </div>
                    </div>
                    
                    
                    
                </div>

                <div
                    className="col-12 mt-8 mb-8 p-2 md:p-8"
                    style={{ borderRadius: '20px', background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #EFE1AF 0%, #C3DCFA 100%)' }}
                >
                    <div className="flex flex-column justify-content-center align-items-center text-center px-3 py-3 md:py-0">
                        <h3 className="text-gray-900 mb-2">Joséphine Miller</h3>
                        <span className="text-gray-600 text-2xl">Peak Interactive</span>
                        <p className="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-4" style={{ maxWidth: '800px' }}>
                            “Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                            laborum.”
                        </p>
                        <img src="/demo/images/landing/peak-logo.svg" className="mt-4" alt="Company logo" />
                    </div>
                </div>

                <div className="py-4 px-4 mx-0 mt-8 lg:mx-8">
                    <div className="grid justify-content-between">
                        <div className="col-12 md:col-2" style={{ marginTop: '-1.5rem' }}>
                            <Link href="/" className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer">
                                <img src={`/layout/images/${layoutConfig.colorScheme === 'light' ? 'logo-dark' : 'logo-white'}.svg`} alt="footer sections" width="50" height="50" className="mr-2" />
                                <span className="font-medium text-3xl text-900">Nitto Digital</span>
                            </Link>
                        </div>

                        <div className="col-12 md:col-10 lg:col-7">
                            <div className="grid text-center md:text-left">
                                <div className="col-12 md:col-3">
                                    <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Company</h4>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">About Us</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">News</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Investor Relations</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Careers</a>
                                    <a className="line-height-3 text-xl block cursor-pointer text-700">Media Kit</a>
                                </div>

                                <div className="col-12 md:col-3 mt-4 md:mt-0">
                                    <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Resources</h4>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Get Started</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Learn</a>
                                    <a className="line-height-3 text-xl block cursor-pointer text-700">Case Studies</a>
                                </div>

                                <div className="col-12 md:col-3 mt-4 md:mt-0">
                                    <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Community</h4>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Discord</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                                        Events
                                        <img src="/demo/images/landing/new-badge.svg" className="ml-2" />
                                    </a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">FAQ</a>
                                    <a className="line-height-3 text-xl block cursor-pointer text-700">Blog</a>
                                </div>

                                <div className="col-12 md:col-3 mt-4 md:mt-0">
                                    <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Legal</h4>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Brand Policy</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Privacy Policy</a>
                                    <a className="line-height-3 text-xl block cursor-pointer text-700">Terms of Service</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

LandingPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};

export default LandingPage;
