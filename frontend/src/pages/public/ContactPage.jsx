import { useState } from "react";
import { useContactStore } from "../../store/contactStore";
import { useAuthStore } from "../../store/authStore";
import { Link } from "react-router-dom";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const { submitContactForm, isLoading } = useContactStore();
  const { authUser } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) return;
    
    await submitContactForm(formData);
    
    // Clear form after successful submission
    setFormData({ subject: "", message: "" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Contact Us</h1>
      
      {!authUser ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md shadow-sm">
          <p className="text-yellow-700">
            You must be logged in to send a message. Please{" "}
            <Link to="/login" className="font-bold underline hover:text-yellow-800">
              login here
            </Link>{" "}
            first.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this regarding?"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                disabled={isLoading}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.subject || !formData.message}
              className={`w-full py-3 px-4 flex justify-center items-center rounded-md text-white font-medium transition-colors
                ${
                  isLoading || !formData.subject || !formData.message
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-4 rounded-lg bg-gray-50">
          <h3 className="font-semibold text-gray-800 mb-2">Email Us</h3>
          <p className="text-gray-600">support@yourdomain.com</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50">
          <h3 className="font-semibold text-gray-800 mb-2">Call Us</h3>
          <p className="text-gray-600">+1 (555) 123-4567</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50">
          <h3 className="font-semibold text-gray-800 mb-2">Visit Us</h3>
          <p className="text-gray-600">123 Main Street<br/>City, State 12345</p>
        </div>
      </div>
    </div>
  );
}
