export default function Pagination({ total, page, setPage }) {

  const pages = Math.ceil(total / 5);

  return (
    <div className="flex gap-2 mt-4">

      {[...Array(pages)].map((_, i) => (

        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`px-3 py-1 rounded 
          ${page === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
        >
          {i + 1}
        </button>

      ))}

    </div>
  );
}