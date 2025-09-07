import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";
import { FaEye, FaRegTrashAlt } from "react-icons/fa";
import useToast from "../../hooks/toast-hook";
import { useLoading } from "../../lib/loading-context";

const Comments = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
  const [viewComment, setViewComment] = useState({ show: false, comment: "" });

  const fetchContacts = async () => {
    const querySnapshot = await getDocs(collection(db, "comments"));
    setContacts(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

    );
    console.log(contacts);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    setConfirmDelete({ show: true, id });
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(contacts.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      setConfirmDelete({ show: true, id: "bulk" });
    }
  };

  const confirmDeleteContact = async () => {
    showLoading();
    try {
      if (confirmDelete.id === "bulk") {
        // Bulk delete
        await Promise.all(
          selectedIds.map(async (id) => {
            await deleteDoc(doc(db, "comments", id));
          })
        );
        showToast(
          "success",
          `Deleted ${selectedIds.length} contacts successfully`
        );
        setSelectedIds([]);
      } else if (confirmDelete.id) {
        await deleteDoc(doc(db, "comments", confirmDelete.id));
        showToast("success", "Contact deleted successfully");
      }
      fetchContacts();
    } catch (err) {
      showToast("error", "Error deleting contact(s)");
      console.error("Error deleting document: ", err);
    }
    hideLoading();
    setConfirmDelete({ show: false, id: null });
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0]">
      <h1 className="w-full text-2xl p-6 pt-6 pb-2 font-extrabold text-white drop-shadow-xl">
        COMMENTS
      </h1>
      <p className="w-full text-sm px-6 pb-6 font-medium text-white/80 drop-shadow-xl border-b-[1px] border-b-white/20">
        Here you can manage your comments and delete unwanted ones.
      </p>
      <div className="w-full p-6 pb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-white">
            Total: {contacts.length}
          </span>
          <button
            className={`px-4 py-2 rounded bg-red-500 text-white font-bold shadow hover:bg-red-600 transition ${
              selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={selectedIds.length === 0}
            onClick={handleBulkDelete}
          >
            Delete Selected
          </button>
        </div>
        <div className="lg:w-full lg:max-w-full overflow-x-auto">
          <table className="w-[1024px] lg:w-full text-left">
          <thead>
            <tr className="text-white border-b border-[#33A1E0]/20">
              <th className="py-2 px-3">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === contacts.length &&
                    contacts.length > 0
                  }
                  onChange={handleSelectAll}
                  title="Select all"
                />
              </th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Comment</th>
              <th className="py-2 px-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-white">
                  No contacts found.
                </td>
              </tr>
            ) : (
              contacts.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-[#33A1E0]/10 hover:bg-[#33A1E0]/5 transition"
                >
                  <td className="py-2 px-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(c.id)}
                      onChange={() => handleSelect(c.id)}
                      title="Select contact"
                    />
                  </td>
                  <td className="py-2 px-3 text-white">{c.email}</td>
                  <td className="py-2 px-3 text-white">{c.yourName}</td>
                  <td className="py-2 px-3 text-white max-w-xs break-words">
                    {c.comment.length > 40 ? (
                      <>
                        {c.comment.slice(0, 40)}...
                        <button
                          className="ml-2 text-[#33A1E0] underline text-xs hover:text-[#154D71]"
                          onClick={() =>
                            setViewComment({ show: true, comment: c.comment })
                          }
                        >
                          View
                        </button>
                      </>
                    ) : (
                      c.comment
                    )}
                  </td>
                  <td className="py-2 px-3 flex gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 p-2 rounded-full bg-white border border-blue-200 hover:bg-blue-50"
                      onClick={() =>
                        setViewComment({ show: true, comment: c.comment })
                      }
                      title="View comment"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 p-2 rounded-full bg-white border border-red-200 hover:bg-red-50"
                      onClick={() => handleDelete(c.id)}
                      title="Delete contact"
                    >
                      <FaRegTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
        
      </div>
      {confirmDelete.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-2xl flex flex-col gap-4 text-center max-w-xs w-full">
            <p className="text-lg font-semibold text-[#2E236C]">
              {confirmDelete.id === "bulk"
                ? `Are you sure you want to delete ${selectedIds.length} selected contacts?`
                : "Are you sure you want to delete this contact?"}
            </p>
            <div className="flex gap-4 justify-center mt-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold"
                onClick={confirmDeleteContact}
              >
                Delete
              </button>
              <button
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 font-bold"
                onClick={() => setConfirmDelete({ show: false, id: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {viewComment.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-2xl flex flex-col gap-4 text-left max-w-md w-full">
            <h3 className="text-lg font-bold text-[#2E236C] mb-2">
              Comment Details
            </h3>
            <p className="text-[#154D71] whitespace-pre-line break-words">
              {viewComment.comment}
            </p>
            <div className="flex gap-4 justify-end mt-2">
              <button
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 font-bold"
                onClick={() => setViewComment({ show: false, comment: "" })}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
