import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const socket = io('http://localhost:5000');

const Dashboard = () => {
    // const [inquiries, setInquiries] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
            setOrders(JSON.parse(storedOrders)); 
        }
    }, []);

    useEffect(() => {
        if (orders.length > 0) {
            localStorage.setItem('orders', JSON.stringify(orders));
        }
    }, [orders]);

    useEffect(() => {
        if (Notification.permission !== 'granted') {
          Notification.requestPermission();
        }
      }, []);

    useEffect(() => {
        socket.on('newInquiry', (inquiry) => {
            setOrders((prevOrders) => {
                const updatedOrders = [inquiry, ...prevOrders]; // Append new order
                localStorage.setItem('orders', JSON.stringify(updatedOrders)); // Save immediately
                return updatedOrders;
            });

            // Play Notification Sound
            const audio = new Audio('/notification.mp3'); // Path to sound file
            audio.play();
            
            // Show Browser Notification
            if (Notification.permission === 'granted') {
                new Notification('New Inquiry', {
                    body: `From: ${inquiry.name}\nMessage: ${inquiry.message}`,
                });
            }

            toast(`New Inquiry from ${inquiry.name}`);
        });

        return () => socket.off('newInquiry');
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>

            <div className="relative overflow-x-auto">
                <div className="grid lg:grid-cols-2 w-full">
                    {/* Current Orders */}
                    <div>
                        <h3 className="text-xl font-bold text-center py-4">Current Orders</h3>
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Customer Name</th>
                                    <th scope="col" className="px-6 py-3">Order Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr className="bg-white border-b shadow-md border-gray-200" key={index}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {order.name}
                                        </th>
                                        <td className="px-6 py-4">{order.message}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
