import React, { useState } from 'react';
import { Button, Label, TextInput } from "flowbite-react";
import { addUserProfile } from "../scripts";


const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        // console.log(formData);
    };

    const [location, setLocation] = useState({ lat: null, lng: null });
    const [message, setMessage] = useState('');

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
                setMessage('User succesfully added location!');
            } else {
                setMessage(data.message || 'An error occurred.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred registering your location.');
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
           await submitUserLocation(location)
            const response = await fetch('http://localhost:50001/addUserProfile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, location })
            });

            if (response.ok) {
                console.log(message);
                setMessage('User signed up successfully!');
            } else {
                setMessage("Please enter a different username or email");
            }
        } catch (error) {
           // console.error('Error:', error);
            //setMessage('An error occurred registering your Location');
        }
    };

    return (
        <div className={"SignupBlock"}>
            <h1 className={"SignupHeader"}>SIGN UP</h1>
            <form onSubmit={handleSubmit}>
                <div className={"FirstAndLastName"}>
                    <Label className={"SignupLabel"} htmlFor={"first_name"}>
                        First Name:
                        <TextInput id="first_name" type="text" placeholder="Jane" value={formData.first_name}
                                   onChange={handleChange} required/>
                        {/*<input type="text" id="first_name" value={formData.first_name} onChange={handleChange} required/>*/}
                    </Label>
                    <br/>
                    <Label className={"SignupLabel"} htmlFor={"first_name"}>
                        Last Name:
                        <TextInput id="last_name" type="text" placeholder="Doe" value={formData.last_name}
                                   onChange={handleChange} required/>
                        {/*<input type="text" id="last_name" value={formData.last_name} onChange={handleChange} required/>*/}
                    </Label>
                    <br/>
                </div>
                <Label className={"SignupLabel"} htmlFor={"email"}>
                    Email:
                    <TextInput id="email" type="email" placeholder="name@mail.com" value={formData.email}
                               onChange={handleChange} required/>
                    {/*<input type="email" id="email" value={formData.email} onChange={handleChange} required/>*/}
                </Label>
                <Label className={"SignupLabel"} htmlFor={"username"}>
                    Username:
                    <TextInput id="username" type="text" placeholder="myusername98" value={formData.username}
                               onChange={handleChange} required/>
                    {/*<input type="text" id="username" value={formData.username} onChange={handleChange} required/>*/}
                </Label>
                <br/>
                <div className={"GetLocation"}>
                    <Button type="button" onClick={getGeolocation}>
                        Get My Location
                    </Button>
                </div>
                <br/>
                <div className={"SubmitButton"}>
                    <Button type="submit">Sign Up</Button>
                </div>
                {message && <p className="error-message">{message}</p>}
            </form>
        </div>
    );
};

export default SignUp;
