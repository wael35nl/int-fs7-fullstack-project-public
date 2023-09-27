import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

import { registerUserRequest } from '../../services/userServices';

import style from 'module.css/user.module.css';

const Register = () => {
    const [user, setUser] = useState<{ [key: string]: string }>({ firstName: '', lastName: '', age: '', email: '', password: '', phone: '', image: '' });
    const { firstName, lastName, age, email, password, phone } = user;
    const ref = useRef<any>();

    const navigate = useNavigate();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement> | any): void => {
        const {name, value, files} = e.target;
        setUser(user => ({ ...user, [name]: files ? files[0] : String(value) }));
    }

    const handleInputSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const newUser = new FormData();
        for (const key in user) {
            newUser.append(key, user[key]);
        }
        const response = await registerUserRequest(newUser);
        toast.success(response.message);
        setUser({ firstName: '', lastName: '', age: '', email: '', password: '', phone: '', image: '' });
        ref.current.value = '';
        } catch (error: any) {
            if (error.response.data.message === `User with this email ${email} already exists. Please sign in`) {
                navigate('/login');
            }
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className={style.user__auth}>
            <h2 className='page__title'>User registration</h2>
            <form className={style.user__form} onSubmit={handleInputSubmit}>
                <label>First name:</label>
                <input type='text' name='firstName' id='firstName' value={firstName} onChange={handleInputChange} required />
                <hr />
                <hr />
                <label>Last name:</label>
                <input type='text' name='lastName' id='lastName' value={lastName} onChange={handleInputChange} required />
                <hr />
                <hr />
                <label>Age:</label>
                <input type='date' name='age' id='age' value={age} onChange={handleInputChange} required />
                <hr />
                <hr />
                <label>Email:</label>
                <input type='email' name='email' id='email' value={email} onChange={handleInputChange} required />
                <hr />
                <hr />
                <label>Password:</label>
                <input type='password' name='password' id='password' value={password} onChange={handleInputChange} required />
                <hr />
                <hr />
                <label>Phone:</label>
                <input type='tel' name='phone' id='phone' value={phone} onChange={handleInputChange} required />
                <hr />
                <hr />
                <label>Image:</label>
                <input type='file' name='image' id='image' accept='image/*' ref={ref} onChange={handleInputChange} />
                <hr />
                <hr />
                <button type='submit'>Register</button>
            </form>
        </div>
    )
}

export default Register;