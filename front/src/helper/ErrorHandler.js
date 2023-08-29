import { swalNotification } from "../components/Alerts/Notifications";

export const validationErrors = (error) => {
  if (error.response.data.code === 400) {
    let errors = "";
    if (error.response.data.data !== null) {
      const objKeys = Object.keys(error.response.data.data);
      if (Object.values(error.response.data.data).length > 1) {
        Object.values(error.response.data.data).map((k, i) => {
          // errors += objKeys[i] + " -- " + k + " on row " + (i + 1) + "\n";
          errors +=
            objKeys[i].substring(objKeys[i].indexOf(".") + 1) +
            " -- " +
            k +
            " on row " +
            (i + 1) +
            "\n";
          return "";
        });
      } else {
        Object.values(error.response.data.data).map((k, i) => {
          errors = objKeys[i].substring(objKeys[i].indexOf(".") + 1) + " -- " + k;
          return "";
        });
      }
      swalNotification(error.response.data.message, errors, "error");
    } else {
      swalNotification(
        error.response.data.message,
        error.response.data.message,
        "error"
      );
    }
    return null;
  }
  if (error.response.data.code === 401) {
    swalNotification(
      error.response.data.code,
      error.response.data.errorMessage,
      "error"
    );
    localStorage.removeItem("persist:tpf");
    window.location = "/";
  }
  if (error.response.data.code === 406) {
    // openNotification(
    //   error.response.statusText,
    //   error.response.data.message,
    //   "error"
    // );
    swalNotification(
      error.response.statusText,
      error.response.data.message,
      "error"
    );
    return null;
  }
  if (error.response.data.code === 409) {
    swalNotification(
      error.response.statusText,
      error.response.data.message,
      "error"
    );
    return null;
  }
  if (error.response.data.code === 500) {
    swalNotification(
      error.response.statusText,
      error.response.data.message,
      "error"
    );
    return null;
  } else {
    swalNotification("There was an error!", error.message, "error");
    console.error("There was an error!", error.message);
  }
};
