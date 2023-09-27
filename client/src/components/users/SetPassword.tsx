import {useState, ChangeEvent, FormEvent} from 'react';
import { toast } from 'react-toastify';

import { forgetPasswordRequest } from 'services/userServices';

import style from 'module.css/user.module.css';

type PasswordProps = {
    inputType: string,
    setInputType: React.Dispatch<React.SetStateAction<string>>,
    getPassword: Boolean,
    setGetPassword: React.Dispatch<React.SetStateAction<boolean>>
}

const SetPassword = ({inputType, setInputType, getPassword, setGetPassword}: PasswordProps) => {
    const [userPasswordData, setUserPasswordData] = useState({ email: '', password: '' });
    const { email, password } = userPasswordData;

    const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setUserPasswordData({ ...userPasswordData, [e.target.name]: e.target.value });
    }
    
    const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const response = await forgetPasswordRequest(userPasswordData);
        if (response.status === 200) {
            toast.success(response.data.message);
        }
        setUserPasswordData({ email: '', password: '' });
    } catch (error: any) {
        toast.error(error.response.data.message);
    }
}

  return (
    <div className={style.user__auth}>
        <h2 className='page__title'>Reset password</h2>
        <form className={style.user__form} onSubmit={handlePasswordSubmit}>
            <label>Email</label>
            <input type='email' name='email' id='email' value={email} onChange={handlePasswordInputChange} required />
            <label>New password</label>
            <div className={style.login__password}>
                <input type={inputType} name='password' id='password' value={password} onChange={handlePasswordInputChange} required />
                <i className="far fa-eye" style={{marginLeft: '-32px', cursor: 'pointer'}} onClick={() => setInputType(inputType === 'password' ? 'text' : 'password')}></i>
            </div>
            <button type='submit'>Set new password</button>
            <button onClick={(e) => {e.preventDefault(); setGetPassword(!getPassword)}}>Back to login</button>
        </form>
    </div>
  )
}

export default SetPassword;