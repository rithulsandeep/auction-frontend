import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AuctionDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [auction, setAuction] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const fetchAuction = async () => {
        try {
            const res = await api.get(`/auctions/${id}`);
            setAuction(res.data);
        } catch (err) {
            console.error('Failed to fetch auction:', err);
            setError('Auction not found');
        }
    };

    useEffect(() => {
        fetchAuction();
    }, []);

    const handleBid = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            await api.post(
                `/auctions/${id}/bid`,
                { amount: bidAmount },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setMessage('Bid placed successfully!');
            setBidAmount('');
            fetchAuction(); // refresh auction
        } catch (err) {
            const msg =
                err.response?.data?.message || 'Failed to place bid';
            setError(msg);
        }
    };

    if (error) return <p>{error}</p>;
    if (!auction) return <p>Loading auction...</p>;

    const isOwner =
        user && (auction.owner._id === user._id || auction.owner === user._id);


    return (
        <div>
            <h2>{auction.title}</h2>
            <p>{auction.description}</p>
            <p>
                Current Bid: ₹{auction.currentBid} <br />
                Starting Bid: ₹{auction.startingBid}
            </p>
            <p>
                Ends At:{' '}
                {new Date(auction.endsAt).toLocaleString()}
            </p>

            {auction.isEnded ? (
                <p style={{ color: 'red' }}>This auction has ended.</p>
            ) : user ? (
                isOwner ? (
                    <p style={{ color: 'gray' }}>
                        You are the owner of this auction.
                    </p>
                ) : (
                    <form onSubmit={handleBid}>
                        <input
                            type="number"
                            placeholder="Enter your bid"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            required
                        />
                        <button type="submit">Place Bid</button>
                    </form>
                )
            ) : (
                <button onClick={() => navigate('/login')}>
                    Login to bid
                </button>
            )}

            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default AuctionDetail;
