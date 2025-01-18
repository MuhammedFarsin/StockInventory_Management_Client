// ConfirmationModal.js
import Swal from 'sweetalert2';

// eslint-disable-next-line react/prop-types
const ConfirmationModal = ({ onConfirm, onCancel, title, text }) => {

  const handleConfirm = async () => {
    const result = await Swal.fire({
      title: title || 'Are you sure?',
      text: text || "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      onConfirm();  // Trigger the onConfirm action if the user confirms
    } else {
      onCancel();  // Trigger onCancel action if the user cancels
    }
  };

  return (
    <button onClick={handleConfirm} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg">
      Delete
    </button>
  );
};

export default ConfirmationModal;
