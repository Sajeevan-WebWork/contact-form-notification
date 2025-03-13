import React from 'react'
import { useState } from "react";
import toast from 'react-hot-toast';


const ContactForm = () => {

    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    // const [responseMessage, setResponseMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:5000/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        // setResponseMessage(data.message);
        toast.success(data.message, {
            position: "top-right"
        })
    };



    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Your Name" onChange={handleChange} required className="border p-2 w-full" />
                <input type="email" name="email" placeholder="Your Email" onChange={handleChange} required className="border p-2 w-full" />
                <textarea name="message" placeholder="Your Message" onChange={handleChange} required className="border p-2 w-full"></textarea>
                <button type="submit" className="bg-blue-500 text-white p-2 w-full">Submit</button>
                {/* {responseMessage && <p className="text-green-500">{responseMessage}</p>} */}
            </form>
        </div>
    )
}

export default ContactForm
