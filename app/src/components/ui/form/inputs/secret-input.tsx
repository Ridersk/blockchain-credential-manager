import { useState } from "react";
import { IconButton } from "@mui/material";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from "@mui/icons-material";
import { FormInput, Props as TextInputProps } from "./form-input";

interface Props extends TextInputProps {}

export const SecretInput = ({
  id,
  name,
  label,
  value,
  error = false,
  errorMessage,
  onChange,
  onBlur,
  ...rest
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormInput
      type={showPassword ? "text" : "password"}
      id={id}
      name={name}
      label={label}
      value={value}
      error={error}
      errorMessage={errorMessage}
      valueCopy={true}
      onChange={onChange}
      onBlur={onBlur}
      extraAdornment={
        <IconButton
          aria-label={`toggle ${label} visibility`}
          onClick={handleClickShowPassword}
          edge="end"
        >
          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      }
      {...rest}
    />
  );
};
