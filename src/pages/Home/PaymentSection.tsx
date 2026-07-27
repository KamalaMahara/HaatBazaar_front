

const PaymentSection = () => {
  return (
    <section className="bg-[#111827] py-20 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-10 border-l-2 border-[#F59E0B] pl-6">

          <div>
            <h2 className="text-4xl font-black text-[#F9FAFB] tracking-tighter uppercase italic leading-none">
              Payment{" "}
              <span className="text-[#F59E0B]">
                Methods
              </span>
            </h2>

            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
              Secure Payments
            </p>
          </div>

          <p className="text-xl uppercase tracking-[0.25em] text-[#F59E0B]  ">
            We Accept
          </p>

        </div>

        {/* Payment Logos */}

        <div className="bg-[#1F2937] border border-white/10 rounded-2xl p-8">

          <div className="flex justify-center flex-wrap items-center  gap-18">

            {/* COD */}

            <img
              src="https://cdn-icons-png.flaticon.com/512/2489/2489756.png"
              alt="Cash On Delivery"
              className="h-16 object-contain  transition-all duration-300 "
            />

            {/* eSewa */}

            <img
              src="https://cdn.esewa.com.np/ui/images/logos/esewa-icon-large.png"
              alt="eSewa"
              className="h-16 object-contain  transition-all duration-300 "
            />

            {/* Khalti */}

            <img
              src="https://avatars.githubusercontent.com/u/31564639?s=280&v=4"
              alt="Khalti"
              className="h-16 object-contain  transition-all duration-300 "
            />

          </div>

        </div>
      </div>
    </section>
  );
};

export default PaymentSection;