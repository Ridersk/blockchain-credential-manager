import { Button, styled, ButtonProps } from "@mui/material";
import { SxProps } from "@mui/system";

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
      sx={{
        backgroundColor: "#27293D",
        fontSize: "12px",
        height: "64px",
        textTransform: "none",
        flex: { xs: 1, sm: "none" }
      }}
    >
      {title}
    </Button>
  );
};

export default styled(WalletOptionButton)({});
