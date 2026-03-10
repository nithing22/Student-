import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function StudentTable({ user }) {
  const storageKey = `students_${user}`;

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", dob: "" });
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [sortField, setSortField] = useState("roll");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const rowsPerPage = 5;

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageKey)) || [];
    setStudents(data);
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(students));
  }, [students]);

  const generateRoll = () => {
    return "STU" + String(students.length + 1).padStart(3, "0");
  };

  const calculateAge = (dob) => {
    const birth = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    return age;
  };

  const validate = () => {
    if (!form.name || !form.email || !form.dob) return "All fields required";

    if (!form.email.endsWith("@gmail.com"))
      return "Email must be a Gmail address";

    if (calculateAge(form.dob) < 1) return "Student must be at least 1 year old";

    return null;
  };

  const handleSubmit = () => {
    const error = validate();
    if (error) return showToast(error);

    const age = calculateAge(form.dob);

    if (editing !== null) {
      const updated = [...students];
      updated[editing] = { ...updated[editing], ...form, age };
      setStudents(updated);
      setEditing(null);
      showToast("Student updated");
    } else {
      setStudents([...students, { roll: generateRoll(), ...form, age }]);
      showToast("Student added");
    }

    setForm({ name: "", email: "", dob: "" });
  };

  const deleteStudent = (index) => {
    if (!window.confirm("Delete student?")) return;
    const updated = students.filter((_, i) => i !== index);
    setStudents(updated);
    showToast("Student deleted");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // ---------- EXCEL DOWNLOAD FUNCTIONS ----------
  const downloadExcel = (dataToExport, fileName = "students.xlsx") => {
    // Only keep relevant fields for Excel
    const data = dataToExport.map(({ roll, name, email, age }) => ({
      Roll: roll,
      Name: name,
      Email: email,
      Age: age
    }));

    const sheet = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Students");
    XLSX.writeFile(wb, fileName);
  };

  const handleDownloadFull = () => downloadExcel(students, "students_full.xlsx");
  const handleDownloadFiltered = () =>
    downloadExcel(filteredStudents, "students_filtered.xlsx");

  // ---------- FILTER + SORT + PAGINATION ----------
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filteredStudents].sort((a, b) => {
    const v1 = a[sortField];
    const v2 = b[sortField];
    if (v1 < v2) return sortAsc ? -1 : 1;
    if (v1 > v2) return sortAsc ? 1 : -1;
    return 0;
  });

  const pages = Math.ceil(sorted.length / rowsPerPage);
  const displayed = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const maxDOB = new Date();
  maxDOB.setFullYear(maxDOB.getFullYear() - 1);

  return (
    <div>
      {toast && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Student</h2>

        <div className="grid grid-cols-4 gap-4">
          <input
            placeholder="Name"
            className="border p-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Email"
            className="border p-2 rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="date"
            className="border p-2 rounded"
            max={maxDOB.toISOString().split("T")[0]}
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
          />

          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {editing !== null ? "Update" : "Add"}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-6 flex justify-between items-center">
        <input
          placeholder="Search student..."
          className="border p-2 rounded w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-x-2">
          <button
            onClick={handleDownloadFull}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download Full Excel
          </button>

          <button
            onClick={handleDownloadFiltered}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Download Filtered Excel
          </button>
        </div>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            {["roll", "name", "email", "age"].map((field) => (
              <th
                key={field}
                className="p-3 cursor-pointer"
                onClick={() => {
                  setSortField(field);
                  setSortAsc(sortField === field ? !sortAsc : true);
                }}
              >
                {field.toUpperCase()}
              </th>
            ))}
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {displayed.map((s, i) => (
            <tr key={i} className="border-t">
              <td className="p-3">{s.roll}</td>
              <td className="p-3">{s.name}</td>
              <td className="p-3">{s.email}</td>
              <td className="p-3">{s.age}</td>

              <td className="p-3 space-x-2">
                <button
                  onClick={() => {
                    setForm(s);
                    setEditing(i);
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteStudent(i)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4 space-x-2">
        {[...Array(pages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}