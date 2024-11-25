import React, { useState } from 'react';
import { Button, Label, TextInput } from "flowbite-react";

const SignUp = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {

        try {
            const response = await fetch('http://localhost:50013/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.text();
            alert(data);
        } catch (error) {
            console.error('Error signing up:', error);
            alert('Error signing up. Please try again.');
        }
    };

    return (
        <div className={"SignupBlock"}>
            <h1 className={"SignupHeader"}>SIGN UP</h1>
            <form onSubmit={handleSubmit}>
                <div className={"FirstAndLastName"}>
                    <Label className={"SignupLabel"} htmlFor={"first_name"}>
                        First Name:
                        <TextInput id="first_name" type="text" placeholder="Jane" value={formData.first_name} onChange={handleChange} required />
                        {/*<input type="text" id="first_name" value={formData.first_name} onChange={handleChange} required/>*/}
                    </Label>
                    <br/>
                    <Label className={"SignupLabel"} htmlFor={"first_name"}>
                        Last Name:
                        <TextInput id="last_name" type="text" placeholder="Doe" value={formData.last_name} onChange={handleChange} required />
                        {/*<input type="text" id="last_name" value={formData.last_name} onChange={handleChange} required/>*/}
                    </Label>
                    <br/>
                </div>
                <Label className={"SignupLabel"} htmlFor={"email"}>
                    Email:
                    <TextInput id="email" type="email" placeholder="name@mail.com" value={formData.email} onChange={handleChange} required />
                    {/*<input type="email" id="email" value={formData.email} onChange={handleChange} required/>*/}
                </Label>
                <Label className={"SignupLabel"} htmlFor={"username"}>
                    Username:
                    <TextInput id="username" type="text" placeholder="myusername98" value={formData.username} onChange={handleChange} required />
                    {/*<input type="text" id="username" value={formData.username} onChange={handleChange} required/>*/}
                </Label>
                <br/>
                <div className={"SubmitButton"}>
                    <Button type="submit">Sign Up</Button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
