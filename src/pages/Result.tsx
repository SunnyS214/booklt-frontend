import { useLocation, useNavigate } from "react-router-dom";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { success, booking } = location.state || {};

  const handleBackHome = () => navigate("/");
console.log("Location State:", location.state);

  if (success && booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 text-center p-6">
        <img
          src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
          alt="Success"
          className="h-24 w-24 mb-4 animate-pulse"
        />
        <h1 className="text-3xl font-extrabold text-blue-600 mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you, <span className="font-semibold">{booking.user?.name}</span>!  
          Your booking for <span className="font-semibold">{booking.experience?.title}</span>  
          is confirmed.
        </p>

        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mb-6">
          <h2 className="text-xl font-semibold mb-3 text-left text-blue-700">Booking Summary</h2>
          <div className="text-left text-gray-700 space-y-1">
            <p><strong>Date:</strong> {booking.slot?.date}</p>
            <p><strong>Time:</strong> {booking.slot?.time}</p>
            <p><strong>Amount Paid:</strong> ₹{booking.totalPrice}</p>
            <p><strong>Email:</strong> {booking.user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleBackHome}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 text-center p-6">
      <img
        src="https://cdn-icons-png.flaticon.com/512/463/463612.png"
        alt="Failure"
        className="h-24 w-24 mb-4 animate-pulse"
      />
      <h1 className="text-3xl font-extrabold text-red-600 mb-2">
        Booking Failed
      </h1>
      <p className="text-gray-600 mb-6">
        Sorry! Something went wrong during the booking process.  
        Please try again later.
      </p>

      <button
        onClick={handleBackHome}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Back to Home
      </button>
    </div>
  );
}
