import React, {useEffect, useState} from 'react';
import { Button, Label, TextInput } from "flowbite-react";
import { useNavigate, Link } from 'react-router-dom';
import validator from "validator";
import {isProfileUnique} from "../scripts";

const SignUp = ({setCurrentUser}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
    });
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        const errors = {};

        if (!/^[a-zA-Z0-9._-]{2,20}$/.test(formData.first_name)) {
            errors.first_name = "First name must be at least 2 characters and can only contain letters, numbers, dots, underscores, or dashes.";
        }
        if (!/^[a-zA-Z0-9._-]{2,20}$/.test(formData.last_name)) {
            errors.last_name = "Last name must be at least 2 characters and can only contain letters, numbers, dots, underscores, or dashes.";
        }
        if (!validator.isEmail(formData.email)) {
            errors.email = "Invalid email format.";
        }
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!emailRegex.test(formData.email)) {
        //   errors.email = "Invalid email format";
        // }
        if (!/^[a-zA-Z0-9._-]{3,20}$/.test(formData.username)) {
            errors.username =
              "Username must be 3-20 characters long and can only contain letters, numbers, dots, underscores, or dashes.";
        }
        
        return errors;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        // console.log(formData);
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            if (id === "first_name") delete updatedErrors.first_name;
            if (id === "last_name") delete updatedErrors.last_name;
            if (id === "email") {
                delete updatedErrors.email;
                delete updatedErrors.unique;
            }
            if (id === "username") {
                delete updatedErrors.username;
                delete updatedErrors.unique;
            }
            delete updatedErrors.geolocation_request;
            delete updatedErrors.geolocation;
            delete updatedErrors.adding_request;
            delete updatedErrors.general;
            return updatedErrors;
        });  
    };

    const [isSignUp, setIsSignUp] = useState(true);
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const getGeolocation = () => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });
                        console.log(position.coords.latitude);
                        console.log(position.coords.longitude);
                    },
                    (error) => {
                        console.error('Error getting geolocation:', error);
                        alert('Unable to get your location.');
                    }
                );
            } else {
                alert('Geolocation is not available on your browser.');
            }
        };
        getGeolocation()
    }, []);

    const submitUserLocation = async (location) => {
        try {
            console.log({ ...formData, location});
            console.log("this is my form data");
            const response = await fetch('http://localhost:50001/addUserLocation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ location })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('User successfully added location!');
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    geolocation_request: (data.message || 'An error occurred fetching your location.'),
                }));
            // setMessage(data.message || 'An error occurred.');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                geolocation: "An error occurred registering your location.",
            }));
            // setMessage('An error occurred registering your location.');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSignUp) {
            try {
                // validate inputs
                const validationErrors = validateInputs();
                if (Object.keys(validationErrors).length > 0) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        ...validationErrors,
                    }));
                    // setErrors(validationErrors);
                    // don't submit input to database if invalid
                    return;
                }

                // sanitize inputs
                const sanitizedData = {
                    username: formData.username.trim(),
                    first_name: formData.first_name.trim(),
                    last_name: formData.last_name.trim(),
                    email: formData.email.trim(),
                };
                console.log("Sending sanitized data to backend:", sanitizedData);

                const isUniqueProfile = await isProfileUnique(sanitizedData.username, sanitizedData.email);
                console.log(isUniqueProfile.result);
                if (!isUniqueProfile.result) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        unique: "Username and/or email is not unique, try another.",
                    }));
                    return;
                }
                
                await submitUserLocation(location)
                const response = await fetch('http://localhost:50001/addUserProfile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...sanitizedData, location })
                });

                if (response.ok) {
                    console.log(message);
                    setCurrentUser(sanitizedData.username)
                    setMessage('User signed up successfully!');
                    navigate('/success');
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        adding_request: "Adding user profile to the server failed.",
                    }));
                    // setMessage("Please enter a different username or email");
                }
            } catch (error) {
                // console.error('Error:', error);
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    general: "An error occurred during sign-up process.",
                }));
                // setMessage('An error occurred during sign-up process');
            }
        } else {
            setCurrentUser(formData.username);
            navigate('/user/' + formData.username);
        }
    };
    return (
        <div className="SignupBlock max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 style={{ marginBottom: '1em'}} className="text-3xl font-extrabold font-mono">Create Account</h1> 
            {/* <h1 className="SignupHeader text-2xl font-semibold text-center mb-4">Sign Up</h1> */}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <Label htmlFor="first_name" className="text-xl font-extrabold font-mono">First Name</Label>
                    <TextInput
                        id="first_name"
                        type="text"
                        placeholder="Jane"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                    {errors.first_name && <p style={{ color: "red" }}>{errors.first_name}</p>}
                </div>
                <div className="mb-4">
                    <Label htmlFor="last_name" className="text-xl font-extrabold font-mono">Last Name</Label>
                    <TextInput
                        id="last_name"
                        type="text"
                        placeholder="Doe"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                    {errors.last_name && <p style={{ color: "red" }}>{errors.last_name}</p>}
                </div>
                <div className="mb-4">
                    <Label htmlFor="email" className="text-xl font-extrabold font-mono">Email</Label>
                    <TextInput
                        id="email"
                        type="email"
                        placeholder="name@mail.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
                </div>
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
                    {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
                </div>
                <Button type="submit" className="text-xl font-extrabold font-mono w-full">Sign Up</Button>
                {Object.keys(errors).map((key) => (
                    <p key={key} style={{ color: "red" }}>{errors[key]}</p>
                ))}
                {message && <p className="text-center text-red-500 mt-2">{message}</p>}
            </form>
            <p className="text-center mt-4 font-extrabold font-mono">
                Already have an account?{" "}
                <Link to="/signin" className="text-blue-500 hover:underline">Sign In</Link>
            </p>
        </div>
    );
};

export default SignUp;
