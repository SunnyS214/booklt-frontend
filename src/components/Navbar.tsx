import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react"; 

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-700";

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">

        <Link to="/" className="text-2xl font-bold text-blue-600  hover:text-yellow-500 transition">
          BookIt
        </Link>

        <div className="hidden md:flex gap-6">
          <Link to="/" className={`${isActive("/")} hover:text-blue-600 transition`}>
            Home
          </Link>
          <Link to="/checkout" className={`${isActive("/checkout")} hover:text-blue-600 transition`}>
            Checkout
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700 hover:text-blue-600 transition"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Home
          </Link>
          <Link
            to="/checkout"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Checkout
          </Link>
        </div>
      )}
    </nav>
  );
}
