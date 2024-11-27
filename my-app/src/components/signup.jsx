import React, { useState } from 'react';
import { Button, Label, TextInput } from "flowbite-react";
import { addUserProfile } from "../scripts";
import { useNavigate } from 'react-router-dom';


const SignUp = ({setCurrentUser}) => {
    const navigate = useNavigate();
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

    const [isSignUp, setIsSignUp] = useState(true);
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
        if (isSignUp) {
            try {
                await submitUserLocation(location)
                const response = await fetch('http://localhost:50001/addUserProfile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, location })
                });

                if (response.ok) {
                    console.log(message);
                    setCurrentUser(formData.username)
                    setMessage('User signed up successfully!');
                    navigate('/success');
                } else {
                    setMessage("Please enter a different username or email");
                }
            } catch (error) {
                // console.error('Error:', error);
                setMessage('An error occurred during sign-up process');
            }
        } else {
            setCurrentUser(formData.username);
            navigate('/user/' + formData.username);
        }
    };

    return (
        <div className={"SignupBlock"}>
            <h1 className={"SignupHeader"}>{isSignUp ? 'SIGN UP' : 'SIGN IN'}</h1>
            <form onSubmit={handleSubmit}>
                {isSignUp && (
                    <>
                        <div className={"FirstAndLastName"}>
                            <Label className={"SignupLabel"} htmlFor={"first_name"}>
                                First Name:
                                <TextInput id="first_name" type="text" placeholder="Jane" value={formData.first_name}
                                           onChange={handleChange} required/>
                            </Label>
                            <br/>
                            <Label className={"SignupLabel"} htmlFor={"last_name"}>
                                Last Name:
                                <TextInput id="last_name" type="text" placeholder="Doe" value={formData.last_name}
                                           onChange={handleChange} required/>
                            </Label>
                            <br/>

                        </div>
                        <Label className={"SignupLabel justify-items-center"} htmlFor={"email"}>
                            Email:
                            <TextInput id="email" type="email" placeholder="name@mail.com" value={formData.email}
                                       onChange={handleChange} required/>
                        </Label>
                    </>
                )}

                <Label className={"SignupLabel"} htmlFor={"username"}>
                    Username:
                    <TextInput id="username" type="text" placeholder="myusername98" value={formData.username}
                               onChange={handleChange} required />
                </Label>
                <br />
                <div className={"SubmitButton justify-items-center"}>
                    <Button className={"align-middle justify-center justify-items-center"} type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
                </div>
                {message && <p className="error-message">{message}</p>}
            </form>

            <div className="toggleOption justify-items-center">
                <p>
                    {isSignUp ? 'Already have an account?' : 'Don’t have an account?'}{' '}
                    <Button className={"align-middle justify-center"} type="button" onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </Button>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
