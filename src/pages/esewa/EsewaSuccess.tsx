
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { APIWITHTOKEN } from '../../http';

const EsewaSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const navigate = useNavigate();

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const data = searchParams.get('data');
                if (!data) {
                    setStatus('error');
                    return;
                }

                const response = await APIWITHTOKEN.post('/order/verify-esewa', { data });
                if (response.status === 200 && response.data.message.includes('successfully')) {
                    setStatus('success');
                } else {
                    setStatus('error');
                }
            } catch (error) {
                console.error(error);
                setStatus('error');
            }
        };

        verifyPayment();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#111827] text-white">
            <div className="bg-[#1F2937] p-8 rounded-2xl text-center max-w-md w-full">
                {status === 'loading' && <h2 className="text-xl font-bold text-[#F59E0B]">Verifying Payment...</h2>}
                {status === 'success' && (
                    <>
                        <h2 className="text-2xl font-bold text-green-400 mb-4">Payment Successful!</h2>
                        <p className="text-gray-400 mb-6">Your order has been placed successfully.</p>
                        <button 
                            onClick={() => navigate('/my-orders')}
                            className="bg-[#F59E0B] text-[#111827] px-6 py-2 rounded-lg font-bold"
                        >
                            Go to My Orders
                        </button>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <h2 className="text-2xl font-bold text-red-500 mb-4">Payment Verification Failed</h2>
                        <p className="text-gray-400 mb-6">There was an issue verifying your payment.</p>
                        <button 
                            onClick={() => navigate('/my-cart')}
                            className="bg-white text-black px-6 py-2 rounded-lg font-bold"
                        >
                            Return to Cart
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default EsewaSuccess;
