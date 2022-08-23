import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { LoadingButton } from "@mui/lab";
import { ChangeEvent, useState } from "react";
import { SecretInput } from "../form/inputs/secret-input";

export type WarningModalProps = {
  open: boolean;
  title: string;
  description: string;
  cancelText?: string;
  acceptText?: string;
  requestPassword?: boolean;
  onCancel: () => void;
  onAccept: (password?: string) => Promise<void>;
};

const WarningModal = ({
  open,
  title,
  description,
  cancelText,
  acceptText,
  requestPassword = false,
  onCancel,
  onAccept
}: WarningModalProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState<string>();
  const handleCancel = () => onCancel();

  const handleAccept = async () => {
    try {
      setLoading(true);
      if (requestPassword) {
        await onAccept(password);
      } else {
        await onAccept();
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleCancel}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "100%", md: 400 },
            height: { xs: "100%", md: "fit-content" },
            bgcolor: "background.default",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Box>
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              align="center"
              sx={{ mb: 4 }}
            >
              {title}
            </Typography>
            <Typography
              id="transition-modal-description"
              variant="body1"
              color="gray"
              align="center"
              sx={{ mb: 4 }}
            >
              {description}
            </Typography>

            {requestPassword && (
              <SecretInput
                id="wallet-password"
                name="password"
                label={t("password")}
                value={password}
                onChange={handlePasswordChange}
                valueCopy={false}
              />
            )}
          </Box>
          <Box
            sx={{ flex: 1, flexDirection: "column", display: "flex", justifyContent: "flex-end" }}
          >
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button onClick={handleCancel} color="secondary" variant="contained" size="medium">
                {cancelText || t("warning_default_cancel")}
              </Button>
              <LoadingButton
                onClick={handleAccept}
                loading={loading}
                loadingPosition="center"
                color="primary"
                variant="contained"
                size="medium"
              >
                {acceptText || t("warning_default_accept")}
              </LoadingButton>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default WarningModal;
