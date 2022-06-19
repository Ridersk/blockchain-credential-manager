import { Box, Button, styled, ButtonProps } from "@mui/material";
import { SxProps } from "@mui/system";
import { useNavigate } from "react-router-dom";

interface WalletOptionButtonProps extends ButtonProps {
  title: string;
  onClick: () => void;
  sx?: SxProps;
}

const WalletOptionButton = (props: WalletOptionButtonProps) => {
  const { title, onClick } = props;

  const handleOnClick = () => {
    onClick();
  };

  return (
    <Button
      {...props}
      variant="contained"
      color="primary"
      size="large"
      onClick={handleOnClick}
      sx={{ backgroundColor: "#27293D", fontSize: "12px", height: "64px", textTransform: "none" }}
    >
      {title}
    </Button>
  );
};

export default styled(WalletOptionButton)();
