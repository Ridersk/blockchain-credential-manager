import { IconButton } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useSnackbar, VariantType, SnackbarKey } from "notistack";
import { Close } from "@mui/icons-material";

interface NotificationAlert {
  message: string;
  variant: VariantType;
}

const useNotification = (): ((data: NotificationAlert) => void) => {
  const [notification, setNotification] = useState<NotificationAlert>({ message: "", variant: "info" });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const action = (key: SnackbarKey) => (
    <Fragment>
      <IconButton
        onClick={() => {
          closeSnackbar(key);
        }}
      >
        <Close />
      </IconButton>
    </Fragment>
  );
  useEffect(() => {
    if (notification?.message) {
      enqueueSnackbar(notification.message, {
        variant: notification.variant,
        autoHideDuration: 5000,
        action
      });
    }
  }, [notification]);
  return setNotification;
};

export default useNotification;
