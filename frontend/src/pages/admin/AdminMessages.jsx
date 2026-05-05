import { useEffect, useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { useContactStore } from "../../store/contactStore";

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminMessages() {
  const {
    contacts,
    isLoading,
    error,
    fetchAllContacts,
    updateContactStatus,
    deleteContact,
  } = useContactStore();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAllContacts();
  }, [fetchAllContacts]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteContact(id);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateContactStatus(id, { status: newStatus });
  };

  const filteredContacts =
    filter === "all"
      ? contacts
      : contacts.filter((c) => (c.status || "Pending") === filter);

  if (isLoading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600 animate-pulse">
          Loading messages...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-orange-600" />
            Messages
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage customer contact messages
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 border-b">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 font-medium transition border-b-2 ${
              filter === "all"
                ? "text-orange-600 border-orange-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            All ({contacts.length})
          </button>
          <button
            onClick={() => setFilter("Pending")}
            className={`px-4 py-2 font-medium transition border-b-2 ${
              filter === "Pending"
                ? "text-orange-600 border-orange-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Pending (
            {
              contacts.filter((c) => (c.status || "Pending") === "Pending")
                .length
            }
            )
          </button>
          <button
            onClick={() => setFilter("Under Review")}
            className={`px-4 py-2 font-medium transition border-b-2 ${
              filter === "Under Review"
                ? "text-orange-600 border-orange-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Under Review (
            {contacts.filter((c) => c.status === "Under Review").length})
          </button>
          <button
            onClick={() => setFilter("Replied")}
            className={`px-4 py-2 font-medium transition border-b-2 ${
              filter === "Replied"
                ? "text-orange-600 border-orange-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Replied ({contacts.filter((c) => c.status === "Replied").length})
          </button>
          <button
            onClick={() => setFilter("Closed")}
            className={`px-4 py-2 font-medium transition border-b-2 ${
              filter === "Closed"
                ? "text-orange-600 border-orange-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Closed ({contacts.filter((c) => c.status === "Closed").length})
          </button>
        </div>

        {/* Messages List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredContacts.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-lg">
              No messages found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
                    <th className="p-4 font-semibold">Contact Info</th>
                    <th className="p-4 font-semibold">Message</th>
                    <th className="p-4 font-semibold w-40">Status</th>
                    <th className="p-4 font-semibold w-24 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">
                          {contact.userId?.firstName
                            ? `${contact.userId.firstName} ${contact.userId.lastName || ""}`.trim()
                            : "Unknown User"}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <a
                            href={`mailto:${contact.userId?.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {contact.userId?.email || "N/A"}
                          </a>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatDate(contact.createdAt)}
                        </div>
                      </td>
                      <td className="p-4 max-w-md">
                        <div className="font-medium text-gray-900 mb-1">
                          {contact.subject}
                        </div>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
                          {contact.message}
                        </p>
                      </td>
                      <td className="p-4">
                        <select
                          className={`w-full rounded border px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                            contact.status === "Replied"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : contact.status === "Closed"
                                ? "bg-gray-50 text-gray-700 border-gray-200"
                                : contact.status === "Under Review"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }`}
                          value={contact.status || "Pending"}
                          onChange={(e) =>
                            handleStatusChange(contact._id, e.target.value)
                          }
                          disabled={isLoading}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Replied">Replied</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(contact._id)}
                          disabled={isLoading}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition disabled:opacity-50"
                          title="Delete Message"
                        >
                          <Trash2 className="w-5 h-5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
