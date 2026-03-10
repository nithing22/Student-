import { motion } from "framer-motion";

export default function ConfirmModal({ onConfirm, onCancel }) {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-white p-6 rounded-xl shadow-xl"
      >

        <h2 className="text-lg font-semibold mb-4">
          Confirm Delete?
        </h2>

        <div className="flex gap-4">

          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>

          <button
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>

        </div>

      </motion.div>

    </div>
  );
}