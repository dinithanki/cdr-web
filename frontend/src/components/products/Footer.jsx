import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { Utensils } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 px-6 py-12 mt-10">
      <div className="max-w-6xl mx-auto grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 text-white text-xl font-bold mb-3">
            <Utensils className="w-6 h-6" />
            Dragon Dine
          </div>

          <p className="text-sm text-gray-400">
            Premium food delivery with fresh meals and fast service.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="/products" className="hover:text-white">
                Menu
              </a>
            </li>
            <li>
              <a href="/orders" className="hover:text-white">
                Orders
              </a>
            </li>
            <li>
              <a href="/cart" className="hover:text-white">
                Cart
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>

          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt /> Kurunegala, Sri Lanka
            </div>
            <div className="flex items-center gap-2">
              <FaPhone /> +94 77 123 4567
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope /> support@dragondine.com
            </div>
          </div>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-white font-semibold mb-3">Follow Us</h3>

          <div className="flex gap-4 text-lg">
            <a href="#" className="hover:text-white">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-white">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-white">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Dragon Dine. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
