import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
// import AppConfig from '../../layout/AppConfig';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { ProductService } from '../../../demo/service/ProductService';
// import { ProductService } from '../../../../assistant/demo/service/ProductService';
import { useForm } from 'react-hook-form';
import AppConfig from '../../../layout/AppConfig';


const BlocksDemo = () => {
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
        ProductService.getChamber().then((data) => setMasterChamber(data));
        ProductService.getSpecialist().then((data) => setMasterSpecialist(data));
        ProductService.getDoctor().then((data) => setMasterDoctor(data));
        ProductService.getTime().then((data) => setMasterTime(data));
        ProductService.getAvailable().then((data) => {
            setMsAvailable(data)
            setMasterAvailable(data);
        });
    }, [toggleRefresh])

    const { control, reset } = useForm({ emptyPatient })

    const handleSubmit = () => {
        setSubmitted(true);

        if(patient.chamber && patient.specialist && patient.doctor && patient.date1 && patient.time1 && patient.name && patient.phone) {
            ProductService.postClient(
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

    console.log(patient, "Patient")

    return (
        <>
            <div className="grid grid-nogutter surface-0 text-800">
                <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
                    <section>
                        <span className="block text-6xl font-bold mb-1">স্বাগতম,</span>
                        <div className="text-6xl text-primary font-bold mb-3">আমি, ডাঃ মোর্শেদা খাতুন (স্বপ্না)</div>
                        <div className="mt-0 mb-4 text-4xl line-height-8">গাইনি রোগ, প্রসূতিবিদ্যা ও বন্ধ্যাত্ব বিশেষজ্ঞ এবং সার্জন</div>
                        <p className="mt-0 mb-4 text-2xl line-height-8">সভ্যতা ও উন্নয়নের কেন্দ্র থেকে একেবারে প্রান্তিক পর্যায়ের সকল মানুষের স্বাস্থ্য সেবা প্রাপ্তি নিশ্চিত করাটাই এখন অন্যতম প্রধান চ্যালেঞ্জ হিসাবে গণ্য করা হচ্ছে। স্বাভাবিক স্রোতের বিপরীতে পূর্ন পেশাদারীত্বের সাথে সকল শ্রেণীর মানুষের জন্য স্বাস্থ্য সেবাটাকে সাবলীল, সাশ্রয়ী ও নিশ্চয়তাপূর্ণ করে প্রদানের লক্ষে আমার এই প্রয়াস।</p>
                    </section>
                </div>
                <div className="col-12 md:col-6 overflow-hidden">
                    <img src="/demo/images/dr-sopna/dr.Swapna-Solo.png" alt="hero-1" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
                </div>
            </div>



            <div className="grid grid-nogutter surface-0 text-800">
            <div className="flex align-items-center justify-content-center w-full">
                <div className="surface-card mt-8 p-4 shadow-2 border-round w-full lg:w-4">
                    <div className="text-center mb-5">
                        <img src="/demo/images/blocks/logos/hyper.svg" alt="hyper" height={50} className="mb-3" />
                        <div className="text-900 text-3xl font-medium mb-3">Get An Appointment</div>
                    </div>
                    
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
            


            <div className="surface-0 p-4 shadow-2 border-round">
                <div className="text-3xl font-medium text-900 mb-3">Card Title</div>
                <div className="font-medium text-500 mb-3">Vivamus id nisl interdum, blandit augue sit amet, eleifend mi.</div>
                <div style={{ height: '150px' }} className="border-2 border-dashed border-300"></div>
            </div>
        </>
    );
};

export default BlocksDemo;

BlocksDemo.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig />
        </React.Fragment>
    );
};