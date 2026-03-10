import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (students) => {

  const data = students.map((s) => ({
    RollNumber: s.rollNumber,
    Name: s.name,
    Email: s.email,
    DOB: s.dob,
    Age: s.age
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream"
  });

  saveAs(blob, "students.xlsx");
};