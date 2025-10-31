import { useLocation, useNavigate } from "react-router-dom";
import { useState, type ChangeEvent } from "react";
import api from "../services/api";

// 🧩 Type definitions
interface Experience {
  _id: string;
  title: string;
  image: string;
  price: number;
}

interface Slot {
  _id: string;
  date: string;
  time: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  promoCode: string;
}

interface LocationState {
  experience?: Experience;
  selectedSlot?: Slot;
}

interface PromoResponse {
  discount: number;
  finalPrice: number;
  message: string;
}

interface BookingResponse {
  success?: boolean;
  bookingId?: string;
  message?: string;
  confirmationNumber?: string;
  error?: string;
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { experience, selectedSlot } = (location.state || {}) as LocationState;

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    promoCode: "",
  });

  const [discount, setDiscount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // ❗ Handle missing experience or slot
  if (!experience || !selectedSlot) {
    return (
      <div className="text-center mt-20 text-gray-600 text-lg font-medium">
        No booking data found.
      </div>
    );
  }

  // 🧾 Input handler
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🎟️ Apply promo code
  const handleApplyPromo = async () => {
    if (!form.promoCode.trim()) return;

    try {
      console.log("🔍 Applying promo:", form.promoCode);
      const res = await api.post<PromoResponse>("/promo/validate", {
        code: form.promoCode,
        currentPrice: experience.price,
        
      });

      console.log("✅ Promo Response:", res.data);
      setDiscount(res.data.discount || 0);
      setError("");
    } catch (err: any) {
      console.error("🔥 Promo Error:", err.response?.data || err);
      setError(err.response?.data?.message || "❌ Invalid promo code!");
      setDiscount(0);
    }
  };

  // ✅ Handle booking confirmation
  const handleBooking = async () => {
    const phoneRegex = /^[0-9]{10}$/;

    if (!form.email || !form.phone || !phoneRegex.test(form.phone)) {
      alert("Please fill all required fields correctly!");
      return;
    }

    const finalPrice = Math.max(experience.price - discount, 0);

    const bookingData = {
      experienceId: experience._id,
      slot: selectedSlot._id, // ✅ fixed key for backend
      user: {
        name: form.name?.trim() || "user1", // ✅ default username if empty
        email: form.email,
        phone: form.phone,
      },
      totalPrice: finalPrice,
      promoCode: form.promoCode,
      numTickets: 1,
    };

    console.log("🟡 Booking Request Sent:", bookingData);

    setLoading(true);
    try {
      const res = await api.post<BookingResponse>("/bookings", bookingData);
      console.log("✅ Booking Success:", res.data);
      navigate("/result", { state: { success: true, booking: res.data } });
    } catch (err: any) {
      console.error("🔥 Booking Error:", err.response?.data || err);
      const errorMsg =
        err.response?.data?.message || "Something went wrong with booking.";
      navigate("/result", { state: { success: false, error: errorMsg } });
    } finally {
      setLoading(false);
    }
  };

  const finalPrice = Math.max(experience.price - discount, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 border-l-8 border-yellow-400 pl-4">
        Checkout
      </h1>

      {/* 🎭 Experience Summary */}
      <div className="bg-white border shadow-md rounded-2xl p-5 flex gap-5 mb-8">
        <img
          src={experience.image}
          alt={experience.title}
          className="h-32 w-40 rounded-xl object-cover"
        />
        <div>
          <h2 className="text-xl font-bold">{experience.title}</h2>
          <p className="text-sm text-gray-500">
            📅 {selectedSlot.date} • 🕓 {selectedSlot.time}
          </p>
          <p className="text-yellow-600 font-bold text-lg mt-2">
            ₹{experience.price.toLocaleString("en-IN")}
          </p>
          {discount > 0 && (
            <p className="text-green-600 text-sm">
              Discount applied: ₹{discount}
            </p>
          )}
        </div>
      </div>

      {/* 👤 User Details */}
      <div className="bg-white border shadow-md rounded-2xl p-5 mb-8">
        <h3 className="text-xl font-semibold mb-4">👤 Your Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name (optional)"
            value={form.name}
            onChange={handleChange}
            className="border rounded-md p-3 focus:ring-2 focus:ring-yellow-400 outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border rounded-md p-3 focus:ring-2 focus:ring-yellow-400 outline-none"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="border rounded-md p-3 focus:ring-2 focus:ring-yellow-400 outline-none"
          />
        </div>
      </div>

      {/* 🎟️ Promo Code */}
      <div className="bg-white border shadow-md rounded-2xl p-5 mb-8">
        <h3 className="text-xl font-semibold mb-4">🎟️ Promo Code</h3>
        <div className="flex gap-3">
          <input
            type="text"
            name="promoCode"
            placeholder="Enter Promo Code"
            value={form.promoCode}
            onChange={handleChange}
            className="border rounded-md p-3 flex-grow focus:ring-2 focus:ring-yellow-400 outline-none"
          />
          <button
            onClick={handleApplyPromo}
            className="bg-yellow-400 text-gray-900 px-5 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            Apply
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* 💰 Final Price */}
      <div className="bg-white border shadow-md rounded-2xl p-5 mb-8 flex justify-between items-center">
        <p className="text-lg font-medium text-gray-700">Total Payable:</p>
        <p className="text-2xl font-bold text-blue-600">
          ₹{finalPrice.toLocaleString("en-IN")}
        </p>
      </div>

      {/* ✅ Confirm Booking */}
      <div className="text-right">
        <button
          onClick={handleBooking}
          disabled={loading}
          className={`px-8 py-3 rounded-xl font-bold text-lg shadow-md transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Booking..." : "✅ Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
