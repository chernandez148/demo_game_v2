import React from 'react'
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik'
import * as yup from 'yup'
import "./LoginForm.css"


function LoginForm({ handleFadeOut, fadeMenuIn, hide, setHide, updateUser, login }) {
    const navigate = useNavigate()

    const formSchema = yup.object().shape({
        fname: yup.string(),
        lname: yup.string(),
        username: yup.string().required("Please enter your username"),
        dob: yup.string(),
        email: yup.string().email(),
        password: yup.string().required("Please enter your password"),
    });

    const formik = useFormik({
        initialValues: {
            fname: "",
            lname: "",
            username: "NoahCarr",
            dob: "",
            email: "",
            password: "7777",
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            setHide(true)

            fetch(login ? '/login' : '/signup', {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({ ...values, password: values.password }),
            }).then((resp) => {
                if (resp.ok) {
                    resp.json().then((user) => {
                        updateUser(user)
                        navigate("/")
                    })
                } else {
                    resp.json().then(console.log)
                }
            })
        }
    })

    const modelMox = fadeMenuIn ? "opacity-1" : "opacity-0"
    const displayNone = !hide ? "block" : "hidden"

    return (
        <div className={`model-box bg-dark px-5 py-8 ${modelMox} ${displayNone}`}>
            <IoClose className='cursor-pointer float-right' onClick={handleFadeOut} />
            <h2 className='mt-4 mb-4'>{login ? "Sign In" : "Sign Up"}</h2>
            <form className='flex flex-col'>
                {formik.errors && (
                    <>
                        {!login && (
                            <>
                                <input
                                    className='mb-4 border rounded-0 p-1 text-black'
                                    type="text"
                                    placeholder='First Name'
                                    name='fname'
                                    onChange={formik.handleChange}
                                    value={formik.values.fname}
                                />
                                <span>{formik.errors.fname}</span>
                                <input
                                    className='mb-4 border rounded-0 p-1 text-black'
                                    type="text"
                                    placeholder='Last Name'
                                    name='lname'
                                    onChange={formik.handleChange}
                                    value={formik.values.lname}
                                />
                                <span>{formik.errors.lname}</span>
                            </>

                        )}
                        <input
                            className='mb-4 border rounded-0 p-1 text-black'
                            type="text"
                            placeholder='Username'
                            name='username'
                            onChange={formik.handleChange}
                            value={formik.values.username}
                        />
                        <span>{formik.errors.username}</span>

                        {!login && (
                            <>
                                <input
                                    className='mb-4 border rounded-0 p-1 text-black'
                                    type="date"
                                    placeholder='MM/DD/YYYY'
                                    name='dob'
                                    onChange={formik.handleChange}
                                    value={formik.values.dob}
                                />
                                <span>{formik.errors.dob}</span>
                                <input
                                    className='mb-4 border rounded-0 p-1 text-black'
                                    type="email"
                                    placeholder='Email'
                                    name='email'
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                />
                                <span>{formik.errors.email}</span>
                            </>
                        )}
                        <input
                            className='border rounded-0 p-1 text-black'
                            type="password"
                            placeholder='Password'
                            name='password'
                            onChange={formik.handleChange}
                            value={formik.values.password}
                        />
                        <span>{formik.errors.password}</span>
                    </>
                )}
                <button className='mt-4 rounded-0 p-1' type='submit' onClick={formik.handleSubmit}>Sign In</button>
            </form>
        </div>
    )
}

export default LoginForm