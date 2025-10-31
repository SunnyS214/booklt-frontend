
interface Props {
  experience: {
    title: string;
    description: string;
    image?: string;
    images?: string[];
    price: number;
    location?: string;
    duration?: string;
    rating?: number;
  };
}

export default function ExperienceCard({ experience }: Props) {
  const imageUrl =
    experience.image ||
    experience.images?.[0] ||
    "https://via.placeholder.com/400x250?text=No+Image";

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col group">
      
      {/* 🖼️ Image Section */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={experience.title}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* ⭐ Subtle Rating - visible softly on hover */}
        {experience.rating && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/70 backdrop-blur-sm text-yellow-600 text-sm font-semibold px-2.5 py-1 rounded-full shadow-sm border border-yellow-100 flex items-center gap-1">
              ⭐ {experience.rating.toFixed(1)}
            </div>
          </div>
        )}
      </div>

      {/* 🧾 Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
          {experience.title}
        </h3>

        {experience.location && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
            {experience.location}
          </p>
        )}

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {experience.description}
        </p>

        {experience.duration && (
          <p className="text-xs text-gray-400 mt-2"> {experience.duration}</p>
        )}

        <div className="flex justify-between items-center mt-auto pt-4">
          <p className="text-lg font-semibold text-blue-600">
            ₹{experience.price}
          </p>
          <button className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
