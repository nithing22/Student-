import { useState, useEffect } from "react";

export default function StudentForm({ onSubmit, editingStudent }) {

  const [student, setStudent] = useState({
    name: "",
    email: "",
    dob: "",
    age: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingStudent) {
      setStudent(editingStudent);
    }
  }, [editingStudent]);

  // Calculate max DOB (today - 1 year)
  const today = new Date();

  const maxDateObj = new Date();
  maxDateObj.setFullYear(today.getFullYear() - 1);

  const maxDate = maxDateObj.toISOString().split("T")[0];

  // Age calculation
  const calculateAge = (dob) => {

    const birthDate = new Date(dob);
    const todayDate = new Date();

    let age = todayDate.getFullYear() - birthDate.getFullYear();

    const monthDiff = todayDate.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && todayDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Validation
  const validate = () => {

    const err = {};

    if (!student.name.trim()) {
      err.name = "Name is required";
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!gmailRegex.test(student.email)) {
      err.email = "Email must be a @gmail.com address";
    }

    if (!student.dob) {
      err.dob = "DOB is required";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    if (name === "dob") {

      const age = calculateAge(value);

      setStudent({
        ...student,
        dob: value,
        age
      });

    } else {

      setStudent({
        ...student,
        [name]: value
      });

    }
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!validate()) return;

    onSubmit(student);

    setStudent({
      name: "",
      email: "",
      dob: "",
      age: ""
    });

  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow mb-6"
    >

      <div className="grid grid-cols-2 gap-4">

        {/* Name */}
        <div>
          <input
            name="name"
            placeholder="Student Name"
            value={student.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <p className="text-red-500 text-sm">{errors.name}</p>
        </div>

        {/* Email */}
        <div>
          <input
            name="email"
            placeholder="example@gmail.com"
            value={student.email}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <p className="text-red-500 text-sm">{errors.email}</p>
        </div>

        {/* DOB */}
        <div>
          <input
            type="date"
            name="dob"
            value={student.dob}
            onChange={handleChange}
            max={maxDate}
            className="border p-2 rounded w-full"
          />
          <p className="text-red-500 text-sm">{errors.dob}</p>
        </div>

        {/* Age */}
        <div>
          <input
            value={student.age}
            readOnly
            placeholder="Age (Auto Calculated)"
            className="border p-2 rounded w-full bg-gray-100"
          />
        </div>

      </div>

      <button
        type="submit"
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Save Student
      </button>

    </form>
  );
}