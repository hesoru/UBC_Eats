import React, { useState } from 'react';
import { Button, Label, TextInput } from "flowbite-react";
import { useNavigate, Link } from 'react-router-dom';
import {isValidUserName} from "../scripts";

const SignIn = ({ setCurrentUser }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    function isEmptyOrSpaces(str) {
        return !str || str.trim() === '';
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        setCurrentUser(formData.username);
        if (isEmptyOrSpaces(formData.username)) {
            setMessage("Please enter a valid username");
            return;
        }
        //console.log("current username:", formData.username)
        const response = await isValidUserName(formData.username)
        const result = response.result
       // console.log(result)
        if(result) {
            navigate(`/user/${formData.username}`);
        } else {
            setMessage("This username does not exist")
        }



    };

    return (
        <div className="SignInBlock max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="SignInHeader text-2xl font-semibold text-center mb-4">Sign In</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <Label htmlFor="username">Username</Label>
                    <TextInput
                        id="username"
                        type="text"
                        placeholder="myusername98"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <Button type="submit" className="w-full">Sign In</Button>
                {message && <p className="text-center text-red-500 mt-2">{message}</p>}
            </form>
            <p className="text-center mt-4">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
            </p>
        </div>
    );
};

export default SignIn;
