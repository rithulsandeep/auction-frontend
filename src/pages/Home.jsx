import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BidModal from '../components/BidModal';
import api from '../api/axios';

const Home = () => {
    const [auctions, setAuctions] = useState([]);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const { user, logout } = useAuth();

    const fetchAuctions = async () => {
        const res = await api.get('/auctions');
        const data = res.data;
        setAuctions(data);
    };

    useEffect(() => {
        fetchAuctions();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            {/* Cold start alert */}
            <div className="max-w-6xl mx-auto mb-6">
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
                    <p className="font-semibold">Notice:</p>
                    <p>
                        If you do not see any auctions or cannot log in, please wait 2-3 minutes and refresh the page.
                        The server may be starting up after a period of inactivity (free hosting puts it to sleep).
                    </p>
                </div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center max-w-6xl mx-auto mb-8">
                <h1 className="text-3xl font-bold">Auction Platform</h1>
                <div className="space-x-4">
                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium"
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/create"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                            >
                                Create Auction
                            </Link>
                            <span className="text-gray-700 font-medium">
                                Welcome, <span className="font-semibold">{user.username}</span>
                            </span>
                            <button
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Auctions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {auctions.map(auction => (
                    <div
                        key={auction._id}
                        className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                    >
                        <h2 className="text-xl font-semibold mb-2">{auction.title}</h2>
                        <p className="text-gray-600 mb-4">{auction.description}</p>
                        <p className="text-sm text-gray-500 mb-2">
                            Starting Bid: ₹{auction.startingBid}
                        </p>
                        <p className="text-sm text-green-700 font-semibold mb-4">
                            Current Highest Bid: ₹{auction.currentBid || auction.startingBid}
                        </p>
                        {user && (
                            <button
                                onClick={() => setSelectedAuction(auction._id)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                            >
                                Place Bid
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Bid Modal */}
            <BidModal
                isOpen={!!selectedAuction}
                onClose={() => setSelectedAuction(null)}
                auctionId={selectedAuction}
                onSuccess={fetchAuctions}
            />
        </div>
    );
};

export default Home;
