import React, { useState } from 'react';
import { Button, Label, TextInput } from "flowbite-react";
import { useNavigate, Link } from 'react-router-dom';
import {isValidUserName} from "../scripts";

const SignIn = ({ setCurrentUser }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '' });
    // const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const validateInput = () => {
        const errors = {};
        if (!/^[a-zA-Z0-9._-]{3,20}$/.test(formData.username)) {
            errors.username =
              "Username must be 3-20 characters long and can only contain letters, numbers, dots, underscores, or dashes.";
        }
        return errors;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors[id];
            return updatedErrors;
        });
    };

    // function isEmptyOrSpaces(str) {
    //     return !str || str.trim() === '';
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // validate inputs
        const validationErrors = validateInput();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // don't submit input to database if invalid
            return;
        }
        
        // else sanitize inputs
        const sanitizedData = {username: formData.username.trim()};
        console.log("Sending sanitized data to backend:", sanitizedData);
        
        setCurrentUser(formData.username);
        // if (isEmptyOrSpaces(formData.username)) {
        //     setMessage("Please enter a valid username");
        //     return;
        // }
        //console.log("current username:", formData.username)
        const response = await isValidUserName(formData.username)
        // console.log(result)
        if (response.result) {
            navigate(`/user/${formData.username}`);
        } else {   
            setErrors((prevErrors) => ({
                ...prevErrors,
                doesNotExist: "This username does not exist.",
            }));
        }
    };

    return (
        <div className="SignInBlock max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 style={{ marginBottom: '1em'}} className="text-3xl font-extrabold font-mono">Sign In</h1> 
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <Label htmlFor="username" className="text-xl font-extrabold font-mono">Username</Label>
                    <TextInput
                        id="username"
                        type="text"
                        placeholder="myusername98"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <Button type="submit" className="text-xl font-extrabold font-mono w-full">Sign In</Button>
                {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
                {errors.doesNotExist && <p style={{ color: "red" }}>{errors.doesNotExist}</p>}
                {/* {message && <p className="text-center text-red-500 mt-2">{message}</p>} */}
            </form>
            <p className="text-center mt-4 font-extrabold font-mono">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
            </p>
        </div>
    );
};

export default SignIn;
