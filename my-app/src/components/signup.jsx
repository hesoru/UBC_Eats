import React, {useEffect, useState} from 'react';
import { Button, Label, TextInput } from "flowbite-react";
import { useNavigate, Link } from 'react-router-dom';


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
        <div className="SignupBlock max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="SignupHeader text-2xl font-semibold text-center mb-4">Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <Label htmlFor="first_name">First Name</Label>
                    <TextInput
                        id="first_name"
                        type="text"
                        placeholder="Jane"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <Label htmlFor="last_name">Last Name</Label>
                    <TextInput
                        id="last_name"
                        type="text"
                        placeholder="Doe"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <Label htmlFor="email">Email</Label>
                    <TextInput
                        id="email"
                        type="email"
                        placeholder="name@mail.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
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
                <Button type="submit" className="w-full">Sign Up</Button>
                {message && <p className="text-center text-red-500 mt-2">{message}</p>}
            </form>
            <p className="text-center mt-4">
                Already have an account?{" "}
                <Link to="/signin" className="text-blue-500 hover:underline">Sign In</Link>
            </p>
        </div>
    );
};

export default SignUp;
