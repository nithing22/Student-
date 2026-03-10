import { useState, useEffect } from "react";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import StudentForm from "../components/students/StudentForm";
import StudentsTable from "../components/students/StudentsTable";
import ConfirmModal from "../components/students/ConfirmModal";

import { exportToExcel } from "../utils/excelExport";

export default function Dashboard() {

  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  // Generate Roll Number
  const generateRollNumber = () => {
    const nextNumber = students.length + 1;
    return `STU${String(nextNumber).padStart(3, "0")}`;
  };

  // Add or Edit Student
  const addStudent = (student) => {

    if (editingStudent) {

      setStudents(
        students.map((s) =>
          s.rollNumber === editingStudent.rollNumber
            ? { ...student, rollNumber: editingStudent.rollNumber }
            : s
        )
      );

      setEditingStudent(null);

    } else {

      const newStudent = {
        ...student,
        rollNumber: generateRollNumber()
      };

      setStudents([...students, newStudent]);
    }
  };

  // Delete Student
  const deleteStudent = () => {

    setStudents(
      students.filter((s) => s.rollNumber !== deleteId)
    );

    setDeleteId(null);
  };

  // Search Filter
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading Students...
      </div>
    );
  }

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-8">

        <Header />

        {/* Search + Download */}
        <div className="flex justify-between mb-6">

          <input
            type="text"
            placeholder="Search student by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-64"
          />

          <button
            onClick={() => exportToExcel(filteredStudents)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Download Excel
          </button>

        </div>

        {/* Student Form */}
        <StudentForm
          onSubmit={addStudent}
          editingStudent={editingStudent}
        />

        {/* Students Table */}
        <StudentsTable
          students={filteredStudents}
          onEdit={setEditingStudent}
          onDelete={setDeleteId}
        />

        {/* Delete Confirmation */}
        {deleteId && (
          <ConfirmModal
            onConfirm={deleteStudent}
            onCancel={() => setDeleteId(null)}
          />
        )}

      </div>

    </div>
  );
}