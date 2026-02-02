"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { contactService } from "@/service/contactService";
import { Contact, ContactPayload } from "@/type/contact";

const emptyForm: ContactPayload = {
  contactableType: "ORGANISATION",
  firstName: "",
  lastName: "",
  title: "",
  phoneNumber: "",
  secondaryPhoneNumber: "",
  faxNumber: "",
  email: "",
  secondaryEmail: "",
  isFavorite: false,
  isEmailVerified: false,
  isPhoneNumberVerified: false,
};

const formatName = (contact: Contact) =>
  `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Unnamed";

export default function Page() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<ContactPayload>(emptyForm);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contactService.getClientContacts();
      setContacts(data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to fetch contacts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const filteredContacts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return contacts.filter((contact) =>
      [
        formatName(contact),
        contact.email,
        contact.phoneNumber,
        contact.secondaryEmail,
        contact.secondaryPhoneNumber,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [contacts, searchQuery]);

  const openCreate = () => {
    setFormData({ ...emptyForm });
    setShowCreateModal(true);
  };

  const openEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setFormData({
      contactableType: "ORGANISATION",
      firstName: contact.firstName || "",
      lastName: contact.lastName || "",
      title: contact.title || "",
      phoneNumber: contact.phoneNumber || "",
      secondaryPhoneNumber: contact.secondaryPhoneNumber || "",
      faxNumber: contact.faxNumber || "",
      email: contact.email || "",
      secondaryEmail: contact.secondaryEmail || "",
      isFavorite: Boolean(contact.isFavorite),
      isEmailVerified: Boolean(contact.isEmailVerified),
      isPhoneNumberVerified: Boolean(contact.isPhoneNumberVerified),
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    try {
      await contactService.deleteClientContact(id);
      toast.success("Contact deleted.");
      loadContacts();
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete contact.");
    }
  };

  const handleSubmit = async (event: React.FormEvent, mode: "create" | "update") => {
    event.preventDefault();
    try {
      if (mode === "create") {
        await contactService.createClientContact(formData);
        toast.success("Contact created.");
        setShowCreateModal(false);
      } else if (selectedContact) {
        await contactService.updateClientContact(selectedContact.id, formData);
        toast.success("Contact updated.");
        setShowEditModal(false);
      }
      await loadContacts();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  const renderModal = (mode: "create" | "update") => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {mode === "create" ? "Add contact" : "Edit contact"}
          </h2>
          <button onClick={() => (mode === "create" ? setShowCreateModal(false) : setShowEditModal(false))}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={(e) => handleSubmit(e, mode)} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">First name</label>
              <input
                required
                className="w-full p-3 rounded-xl bg-gray-50 border-none font-semibold"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Last name</label>
              <input
                required
                className="w-full p-3 rounded-xl bg-gray-50 border-none font-semibold"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Title</label>
            <input
              className="w-full p-3 rounded-xl bg-gray-50 border-none font-semibold"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Phone</label>
              <input
                className="w-full p-3 rounded-xl bg-gray-50 border-none font-semibold"
                value={formData.phoneNumber || ""}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Secondary phone</label>
              <input
                className="w-full p-3 rounded-xl bg-gray-50 border-none font-semibold"
                value={formData.secondaryPhoneNumber || ""}
                onChange={(e) => setFormData({ ...formData, secondaryPhoneNumber: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email</label>
              <input
                type="email"
                className="w-full p-3 rounded-xl bg-gray-50 border-none font-semibold"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Secondary email</label>
              <input
                type="email"
                className="w-full p-3 rounded-xl bg-gray-50 border-none font-semibold"
                value={formData.secondaryEmail || ""}
                onChange={(e) => setFormData({ ...formData, secondaryEmail: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Fax</label>
            <input
              className="w-full p-3 rounded-xl bg-gray-50 border-none font-semibold"
              value={formData.faxNumber || ""}
              onChange={(e) => setFormData({ ...formData, faxNumber: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <input
                type="checkbox"
                className="accent-primary"
                checked={Boolean(formData.isFavorite)}
                onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
              />
              Favorite
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <input
                type="checkbox"
                className="accent-primary"
                checked={Boolean(formData.isEmailVerified)}
                onChange={(e) => setFormData({ ...formData, isEmailVerified: e.target.checked })}
              />
              Email verified
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <input
                type="checkbox"
                className="accent-primary"
                checked={Boolean(formData.isPhoneNumberVerified)}
                onChange={(e) =>
                  setFormData({ ...formData, isPhoneNumberVerified: e.target.checked })
                }
              />
              Phone verified
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
          >
            {mode === "create" ? "Create contact" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen pb-24 text-gray-800">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <button
            onClick={openCreate}
            className="bg-primary text-white p-3 rounded-full shadow-lg hover:rotate-90 transition-all"
          >
            <PlusIcon className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <ArrowPathIcon className="w-10 h-10 animate-spin mx-auto text-primary" />
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <UserCircleIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
          <p className="text-gray-400 font-medium">No contacts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-[16px] shadow-lg shadow-black/5 border border-gray-50 overflow-hidden"
            >
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{formatName(contact)}</h3>
                    <p className="text-sm text-gray-500">{contact.title || "Contact"}</p>
                  </div>
                  {contact.isFavorite && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-yellow-50 text-yellow-600">
                      Favorite
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>{contact.phoneNumber || "No phone number"}</p>
                  <p>{contact.email || "No email"}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(contact)}
                    className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && renderModal("create")}
      {showEditModal && renderModal("update")}
    </div>
  );
}
