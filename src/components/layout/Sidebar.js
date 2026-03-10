export default function Sidebar() {
  return (
    <div className="w-60 bg-white shadow-lg h-screen p-6">
      <h1 className="text-2xl font-bold text-indigo-600 mb-10">
        StudentApp
      </h1>

      <ul className="space-y-4">
        <li className="text-gray-700 font-medium hover:text-indigo-600 cursor-pointer">
          Dashboard
        </li>

        <li className="text-gray-700 font-medium hover:text-indigo-600 cursor-pointer">
          Students
        </li>
      </ul>
    </div>
  );
}