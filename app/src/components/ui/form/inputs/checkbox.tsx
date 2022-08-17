import { Checkbox, FormControlLabel, OutlinedInputProps } from "@mui/material";

export interface Props extends OutlinedInputProps {
  id: string;
  name?: string;
  label?: string;
  checked?: boolean;
  error?: boolean;
  errorMessage?: string;
  valueCopy?: boolean;
  extraAdornment?: React.ReactElement;
  onChange?: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
}

export const CustomCheckbox = ({ id, name, label, checked, onChange, onBlur }: Props) => {
  return (
    <FormControlLabel
      control={
        <Checkbox id={id} name={name} checked={checked} onChange={onChange} onBlur={onBlur} />
      }
      label={label}
      sx={{ justifyContent: "space-between" }}
    />
  );
};
