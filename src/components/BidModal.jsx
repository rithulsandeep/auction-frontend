import React, { useState } from 'react';
import api from '../api/axios';

const BidModal = ({ isOpen, onClose, auctionId, onSuccess }) => {
    const [bidAmount, setBidAmount] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleBid = async () => {
        console.log('Token sent:', localStorage.getItem('token'));
        setError('');

        try {
            await api.post(`/auctions/${auctionId}/bid`, { amount: bidAmount }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            onSuccess(); // refresh parent data
            onClose();   // close modal
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Place Your Bid</h2>
                <input
                    type="number"
                    placeholder="Enter amount in ₹"
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-3"
                />
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleBid}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-lg"
                    >
                        Place Bid
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BidModal;
