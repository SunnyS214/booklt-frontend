import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";

interface Slot {
  date: string;
  time: string;
  isAvailable: boolean;
}

interface Experience {
  _id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  slots: Slot[];
  location: string; 
  duration: string; 
  rating: number;   
}

export default function Details() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); 

  useEffect(() => {
    if (id) {
      setLoading(true);
      api
        .get(`/experiences/${id}`)
        .then((res) => {
          const data = res.data;

          const formattedExperience: Experience = {
            _id: data.experience._id,
            title: data.experience.name,
            description: data.experience.description,
            location: data.experience.location || "Unknown Location", 
            duration: data.experience.duration || "Flexible",
            rating: data.experience.rating || 4.0, 
            images: data.experience.images?.length
              ? data.experience.images
              : ["https://via.placeholder.com/1000x600?text=Experience+Image"],
            price: data.experience.price,
            slots:
              data.availableSlots?.map((slot: any) => ({
                date: new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                time: slot.time,
                isAvailable: slot.status === "Available",
              })) || [],
          };

          setExperience(formattedExperience);
        })
        .catch((err) => console.error("Error fetching details:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleBook = () => {
    if (!selectedSlot) {
      alert("Please select a slot before booking.");
      return;
    }
    navigate("/checkout", { state: { experience, selectedSlot } });
  };

  const handlePrev = () => {
    if (experience) {
      setCurrentIndex((prev) =>
        prev === 0 ? experience.images.length - 1 : prev - 1
      );
    }
  };

  const handleNext = () => {
    if (experience) {
      setCurrentIndex((prev) =>
        prev === experience.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (loading) return <Loader />;

  if (!experience)
    return (
      <div className="text-center mt-20 text-xl font-medium text-gray-500">
        ❌ Experience details not found.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-0 md:p-8">
      
      <div className="p-4 md:p-0">
        <button 
          onClick={() => navigate(-1)} 
          className="text-blue-600 hover:text-blue-800 font-semibold flex items-center mb-6 transition"
        >
          <span className="mr-1">←</span> Back to Experiences
        </button>
      </div>

      <div className="w-full mb-8">
        <div className="relative w-full h-80 sm:h-96 lg:h-[500px] overflow-hidden lg:rounded-2xl shadow-xl">
          <div
            className="flex transition-transform duration-500 h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {experience.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${experience.title} ${i + 1}`}
                className="w-full h-full object-cover flex-shrink-0"
              />
            ))}
          </div>

          {experience.images.length > 1 && (
            <>
              <button onClick={handlePrev} className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 text-gray-800 p-3 rounded-full hover:bg-white transition shadow-md">
                <span className="font-bold">❮</span>
              </button>
              <button onClick={handleNext} className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 text-gray-800 p-3 rounded-full hover:bg-white transition shadow-md">
                <span className="font-bold">❯</span>
              </button>
            </>
          )}
          {experience.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {experience.images.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2.5 w-2.5 rounded-full cursor-pointer transition ${
                    currentIndex === i ? "bg-blue-600 shadow-lg ring-2 ring-white" : "bg-gray-400 opacity-70"
                  }`}
                ></div>
              ))}
            </div>
          )}
        </div>
      </div>
      
   
   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-0 lg:items-stretch">
  
  <div className="lg:col-span-2 flex flex-col bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
      {experience.title}
    </h1>

    {/* Location, Duration, Rating */}
    <div className="flex flex-wrap gap-4 mb-6 text-gray-700">
      <span className="flex items-center text-lg font-medium text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
        <span className="mr-2">📍</span>
        <strong className="text-yellow-800">{experience.location}</strong>
      </span>
      <span className="flex items-center text-lg font-medium">
        <span className="mr-2 text-yellow-500">⭐</span>
        {experience.rating.toFixed(1)} Rating
      </span>
      <span className="flex items-center text-lg font-medium">
        <span className="mr-2 text-green-500">⏱️</span>
        {experience.duration}
      </span>
    </div>

    <h2 className="text-2xl font-semibold mb-2 text-gray-800 border-b pb-2">
      Description
    </h2>
    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap flex-grow">
      {experience.description}2
    </p>

    <div className="mt-auto pt-6 border-t border-gray-100">
      <p className="text-gray-500 text-sm">
        Experience curated by <span className="font-semibold text-blue-600">HumanKind Adventures</span>
      </p>
    </div>
  </div>

  <div className="lg:col-span-1 flex">
    <div className="flex flex-col justify-between bg-white p-6 rounded-2xl shadow-xl border-t-4 border-yellow-400 w-full">
      
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-3">
          Booking & Availability
        </h2>

        <div className="mb-6 py-2 flex justify-between items-center border-b border-gray-100">
          <span className="text-lg font-medium text-gray-500">Price Per Person:</span>
          <p className="text-3xl font-extrabold text-yellow-600">
            ₹{experience.price.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Select Slot:</h3>
          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
            {experience.slots.map((slot, index) => (
              <button
                key={index}
                disabled={!slot.isAvailable}
                onClick={() => setSelectedSlot(slot)}
                className={`border-2 rounded-lg py-2 px-1 text-center transition duration-200 shadow-sm ${
                  !slot.isAvailable
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
                    : selectedSlot === slot
                    ? "bg-yellow-400 text-black border-yellow-400 shadow-lg"
                    : "bg-white text-gray-800 hover:bg-yellow-100 hover:border-yellow-400"
                }`}
              >
                <div className="font-semibold text-sm">{slot.date}</div>
                <div
                  className={`text-xs ${
                    slot.isAvailable
                      ? selectedSlot === slot
                        ? "text-black/80"
                        : "text-gray-600"
                      : "text-gray-400"
                  }`}
                >
                  {slot.time}
                </div>
              </button>
            ))}
            {experience.slots.length === 0 && (
              <p className="text-sm text-gray-500 col-span-full">
                No available slots found.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 mt-auto">
        <div className="p-3 bg-yellow-50 rounded-lg text-sm border border-yellow-200 mb-4">
          {selectedSlot ? (
            <p>
              Selected:{" "}
              <strong className="text-blue-700">
                {selectedSlot.date} @ {selectedSlot.time}
              </strong>
            </p>
          ) : (
            <p className="text-gray-600">Please select an available slot.</p>
          )}
        </div>

        <button
          onClick={handleBook}
          disabled={!selectedSlot}
          className={`w-full text-gray-900 px-6 py-3 rounded-xl font-bold text-lg transition shadow-md ${
            selectedSlot
              ? "bg-yellow-400 hover:bg-yellow-500"
              : "bg-gray-400 cursor-not-allowed text-white"
          }`}
        >
          Book Now
        </button>
      </div>
    </div>
  </div>
</div>

   
    </div>
  );
}