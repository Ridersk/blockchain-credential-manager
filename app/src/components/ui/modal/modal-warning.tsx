import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

export type WarningModalProps = {
  open: boolean;
  title: string;
  description: string;
  cancelText?: string;
  acceptText?: string;
  onCancel: () => void;
  onAccept: () => void;
};

const WarningModal = ({ open, title, description, cancelText, acceptText, onCancel, onAccept }: WarningModalProps) => {
  const { t } = useTranslation();
  const handleCancel = () => onCancel();
  const handleAccept = () => onAccept();

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
            <Typography id="transition-modal-title" variant="h6" component="h2" align="center" sx={{ mb: 4 }}>
              {title}
            </Typography>
            <Typography id="transition-modal-description" variant="body1" color="gray" align="center" sx={{ mb: 4 }}>
              {description}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, flexDirection: "column", display: "flex", justifyContent: "flex-end" }}>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button onClick={handleCancel} color="secondary" variant="contained" size="medium">
                {cancelText || t("warning_default_cancel")}
              </Button>
              <Button onClick={handleAccept} color="primary" variant="contained" size="medium">
                {acceptText || t("warning_default_accept")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default WarningModal;
