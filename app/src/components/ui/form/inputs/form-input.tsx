import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps
} from "@mui/material";
import { ContentCopy as ContentCopyIcon } from "@mui/icons-material";
import { copyTextToClipboard } from "utils/clipboard";
import React from "react";

export interface Props extends OutlinedInputProps {
  type?: string;
  id: string;
  fieldName: string;
  label: string;
  value?: string;
  error?: boolean;
  errorMessage?: string;
  valueCopy?: boolean;
  extraAdornment?: React.ReactElement;
  onChange?: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
}

export const FormInput = ({
  type = "text",
  id,
  fieldName,
  label,
  value,
  error = false,
  errorMessage,
  valueCopy = false,
  extraAdornment,
  onChange,
  onBlur,
  ...rest
}: Props) => {
  const { sx, ...restInputProps } = rest;
  const handleClickCopyInput = (inputValue: string) => {
    copyTextToClipboard(inputValue);
  };

  const renderAdornment = () => {
    return (
      <InputAdornment position="end">
        <>
          {Boolean(extraAdornment) && extraAdornment}
          {valueCopy && (
            <IconButton
              aria-label={`copy ${label} value`}
              onClick={() => {
                handleClickCopyInput(value as string);
              }}
              edge="end"
            >
              <ContentCopyIcon />
            </IconButton>
          )}
        </>
      </InputAdornment>
    );
  };

  return (
    <FormControl fullWidth error={error} sx={{ marginTop: 2, ...sx }}>
      <InputLabel htmlFor={id} variant="outlined">
        {label}
      </InputLabel>
      <OutlinedInput
        id={id}
        type={type}
        value={value}
        name={fieldName}
        onBlur={onBlur}
        onChange={onChange}
        label={label}
        endAdornment={renderAdornment()}
        {...restInputProps}
      />
      {error && (
        <FormHelperText error id={`${id}-helper`}>
          {errorMessage}
        </FormHelperText>
      )}
    </FormControl>
  );
};
