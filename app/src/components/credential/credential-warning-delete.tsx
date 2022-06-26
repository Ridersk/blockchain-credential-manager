import WarningModal from "components/ui/modal/modal-warning";
import { useTranslation } from "react-i18next";

export type CredentialDeletionWarningProps = {
  open: boolean;
  onCancel: () => void;
  onAccept: () => void;
};

const CredentialDeletionWarningModal = ({
  open,
  onCancel,
  onAccept
}: CredentialDeletionWarningProps) => {
  const { t } = useTranslation();

  return (
    <WarningModal
      open={open}
      title={t("warning_delete_credential_title")}
      description={t("warning_delete_credential_description")}
      onCancel={onCancel}
      onAccept={onAccept}
    />
  );
};

export default CredentialDeletionWarningModal;
