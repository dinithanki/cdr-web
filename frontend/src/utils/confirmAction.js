let confirmHandler = null;

export const registerConfirmHandler = (handler) => {
  confirmHandler = handler;

  return () => {
    if (confirmHandler === handler) {
      confirmHandler = null;
    }
  };
};

export const confirmAction = (options) => {
  const dialogOptions =
    typeof options === "string" ? { message: options } : options;

  if (confirmHandler) {
    return confirmHandler(dialogOptions);
  }

  return Promise.resolve(false);
};
