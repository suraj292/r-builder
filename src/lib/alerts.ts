import Swal from 'sweetalert2';

export const showAlert = {
  success: (title: string, message?: string) => {
    return Swal.fire({
      title,
      text: message,
      icon: 'success',
      confirmButtonColor: '#4f46e5', // indigo-600
      customClass: {
        popup: 'rounded-3xl shadow-xl border border-slate-100 font-sans',
        confirmButton: 'rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all cursor-pointer'
      }
    });
  },
  error: (title: string, message?: string) => {
    return Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#4f46e5', // indigo-600 to match theme
      customClass: {
        popup: 'rounded-3xl shadow-xl border border-slate-100 font-sans',
        confirmButton: 'rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all cursor-pointer'
      }
    });
  },
  warning: (title: string, message?: string) => {
    return Swal.fire({
      title,
      text: message,
      icon: 'warning',
      confirmButtonColor: '#4f46e5', // indigo-600
      customClass: {
        popup: 'rounded-3xl shadow-xl border border-slate-100 font-sans',
        confirmButton: 'rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all cursor-pointer'
      }
    });
  },
  info: (title: string, message?: string) => {
    return Swal.fire({
      title,
      text: message,
      icon: 'info',
      confirmButtonColor: '#4f46e5', // indigo-600
      customClass: {
        popup: 'rounded-3xl shadow-xl border border-slate-100 font-sans',
        confirmButton: 'rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all cursor-pointer'
      }
    });
  },
  confirm: async (title: string, message?: string) => {
    const result = await Swal.fire({
      title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5', // indigo-600
      cancelButtonColor: '#94a3b8', // slate-400
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-3xl shadow-xl border border-slate-100 font-sans',
        confirmButton: 'rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all cursor-pointer mr-2',
        cancelButton: 'rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all cursor-pointer'
      }
    });
    return result.isConfirmed;
  }
};
