import axios from 'axios';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useContext, useRef, useState } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { getJWTAdmin, saveAdmin, saveJWTAdmin, saveRole } from '../../../admin-utils/utils';
import { URL } from '../../../demo/service/PatientService';

const LoginPage = () => {
    const toast = useRef();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const handleLogin = async(e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${URL}/super-admin`, {userName, password});
            const token = res.data.token;
            saveJWTAdmin(token);
            saveAdmin('admin');
            console.log("token", getJWTAdmin())

            router.push('/home')
        } catch (err) {
            console.log(err);
            toast.current.show({ severity: 'error', summary: 'Credintial is Wrong' });
        }
    }

    const handleRouter = () => {
        router.push('/auth/login-assis')
    }
    

    
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            {/* <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" /> */}
                            <div className="text-900 text-3xl font-medium mb-3">Welcome, Nitto Admin</div>
                            <span className="text-600 font-medium">Sign in for Admin</span>
                        </div>


                        <form onSubmit={handleLogin}>
                        <Toast ref={toast} />
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                UserName
                            </label>
                            <InputText inputid="userName" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="User Name" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password inputid="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputid="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Remember me</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Forgot password?
                                </a>
                            </div>
                            <Button label="Sign In" className="w-full p-3 text-xl"></Button>
                        </form>
                        <Button className='mt-2' label="Go to Doctor Login Page" icon="pi pi-arrow-right" text onClick={handleRouter} />
                    </div>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage;
