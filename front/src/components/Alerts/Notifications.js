import swal from "sweetalert2";

export const swalNotification = (title, message, type) => {
  return new swal({
    title: title,
    text: message,
    icon: type,
  });
};
