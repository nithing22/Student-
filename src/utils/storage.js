export const getStudents = (user) => {
  return JSON.parse(localStorage.getItem(`students_${user}`)) || [];
};

export const saveStudents = (user, students) => {
  localStorage.setItem(`students_${user}`, JSON.stringify(students));
};