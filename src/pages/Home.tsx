import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ExperienceCard from "../components/ExperienceCard";
import HomeSkeleton from "../components/HomeSkelton";

interface Experience {
  _id: string;
  title: string;
  description: string;
  image?: string;
  images?: string[];
  price: number;
  location?: string;
  duration?: string;
  rating?: number;
}

export default function Home() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/experiences")
      .then((res) => {
        const formatted = res.data.map((exp: any) => ({
          _id: exp._id,
          title: exp.name, 
          description: exp.description,
          image: exp.images?.[0] || "",
          images: exp.images,
          price: exp.price,
          location: exp.location,
          duration: exp.duration,
          rating: exp.rating,
        }));
        setExperiences(formatted);
      })
      .catch((err) => console.error("Error fetching experiences:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <HomeSkeleton/>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Top Experiences Around India
      </h1>

      {experiences.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {experiences.map((exp) => (
            <Link key={exp._id} to={`/details/${exp._id}`}>
              <ExperienceCard experience={exp} />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-20">
          No experiences available right now.
        </p>
      )}
    </div>
  );
}




