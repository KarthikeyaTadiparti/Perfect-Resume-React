import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleError, handleSuccess } from "../lib/utils";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";

function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const UserInfo = useSelector((state) => state.auth.UserInfo);
    const token = useSelector((state) => state.auth.token);
    const handleChanges = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let response = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/signup`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            // console.log(response.data);
            let result = response.data;
            dispatch(
                setCredentials({ UserInfo: result.user, token: result.token })
            );

            if (result.success) {
                handleSuccess(result.message);
                navigate("/resume");
            }
        } catch (error) {
            console.log(error);
            let msg = error?.response?.data?.message;
            handleError(msg);
        }
    };
    return (
        <div className="w-screen h-full flex justify-center items-center bg-back">
            <form
                onSubmit={handleSubmit}
                className="w-1/4 shadow-md border border-gray-200 mx-auto px-6 py-4 rounded-lg bg-white"
            >
                <h1 className="font-bold text-3xl text-center mb-6">Sign Up</h1>

                <FormInput
                    name="name"
                    value={formData.name}
                    labelName="Full Name"
                    handleChanges={handleChanges}
                />
                <FormInput
                    name="email"
                    value={formData.email}
                    labelName="Email"
                    handleChanges={handleChanges}
                />
                <FormInput
                    type="password"
                    name="password"
                    value={formData.password}
                    labelName="Password"
                    handleChanges={handleChanges}
                />

                <FormButton name="Sign Up" />
                <hr />
                <p className="mt-5 text-center">
                    Have an account?
                    <Link
                        to="/auth/login"
                        className="mx-1 text-pri-blue hover:underline hover:decoration-pri-blue"
                    >
                        Log In
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Signup;
