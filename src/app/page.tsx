"use client";

import { useState, useEffect } from "react";
import { addLead, getLeads, Lead } from "./api";

interface FormData {
  name: string;
  email: string;
  status: string;
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    status: "",
  });

  const fetchLeads = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`);
    const data = await response.json();
    setLeads(data);
  };
  
  // Call fetchLeads on component mount
  useEffect(() => {
    fetchLeads();
  }, []);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await addLead(formData);
    if (!("error" in response)) {
      setLeads([...leads, response]);
      setFormData({ name: "", email: "", status: "" });

      fetchLeads();
    } else {
      alert(response.error);
    }
  };

  return (
    <div className="bg-neutral-100 min-h-screen w-full">
      <div className="relative overflow-x-auto flex flex-col items-center">
        <div className="text-center text-xl font-bold mt-10 mb-2">Simple lead management</div>
        <div className="w-full flex justify-center">
          <table className="container w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-x text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Lead ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) =>
                lead._id ? (
                  <tr key={lead._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {lead.name}
                    </th>
                    <td className="px-6 py-4">{lead._id}</td>
                    <td className="px-6 py-4">{lead.email}</td>
                    <td className="px-6 py-4">{lead.status}</td>
                    <td className="px-6 py-4">{lead.createdAt}</td>
                  </tr>
                ) : null
              )}
            </tbody>

          </table>
        </div>
        <div className="w-full container flex justify-center mt-5">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Add new lead
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Add New Lead</h2>

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Lead Name"
                  className="w-full p-2 border rounded-md mb-3 dark:bg-gray-700 dark:text-white"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Lead Email"
                  className="w-full p-2 border rounded-md mb-3 dark:bg-gray-700 dark:text-white"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <select
                  className="w-full p-2 border rounded-md mb-3 dark:bg-gray-700 dark:text-white"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Lead Status</option>
                  <option value="New">New</option>
                  <option value="Engaged">Engaged</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Closed Won">Closed-Won</option>
                  <option value="Closed Lost">Closed-Lost</option>
                </select>


                {/* Submit & Close Buttons */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-600 bg-gray-200 px-4 py-2 rounded-lg me-2 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg"
                  >
                    Save Lead
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
