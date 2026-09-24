
import React from 'react';
import { useNavigate } from 'react-router-dom';

const EsewaFailure: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#111827] text-white">
            <div className="bg-[#1F2937] p-8 rounded-2xl text-center max-w-md w-full">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Payment Failed!</h2>
                <p className="text-gray-400 mb-6">Your payment could not be processed successfully.</p>
                <button 
                    onClick={() => navigate('/my-cart')}
                    className="bg-white text-black px-6 py-2 rounded-lg font-bold"
                >
                    Return to Cart
                </button>
            </div>
        </div>
    );
};

export default EsewaFailure;
