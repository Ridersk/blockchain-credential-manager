import { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  Slider,
  Stack,
  Typography
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { FormInput } from "components/ui/form/inputs/form-input";
import { useTranslation } from "react-i18next";

import generator from "generate-password";
import { CustomCheckbox } from "components/ui/form/inputs/checkbox";
import { useNavigate } from "react-router";
import { extractURLHashSearchParams } from "utils/url";

const CredentialGeneratorPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [secretParams, setSecretParams] = useState<SecretParams>({
    length: 8,
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true
  });
  const [secret, setSecret] = useState("");

  const submitGeneratedSecret = () => {
    const locationUrlQsParams = extractURLHashSearchParams(window.location.toString());
    const currentQs = new URLSearchParams(locationUrlQsParams);
    navigate(`/credential?${currentQs.toString()}`, {
      state: { generatedSecret: secret }
    });
  };

  const generateSecret = async (values: SecretParams) => {
    const generatedSecret = generator.generate({
      length: values.length,
      uppercase: values.uppercase,
      lowercase: values.lowercase,
      numbers: values.numbers,
      symbols: values.symbols
    });
    setSecret(generatedSecret);
  };

  useEffect(() => {
    generateSecret(secretParams);
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const secretParamsUpdate = {
      ...secretParams,
      [event.target.name]:
        event.target.type === "checkbox" ? event.target.checked : event.target.value
    };
    setSecretParams(secretParamsUpdate);
    generateSecret(secretParamsUpdate);
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t("generate_credential_title")}
        </Typography>
      </Box>

      <Box my={4}>
        <FormInput
          type="text"
          id="credential-secret"
          name="secret"
          label={t("generated_secret")}
          disabled={true}
          value={secret}
          valueCopy={true}
          extraAdornment={
            <IconButton color="inherit" onClick={() => generateSecret(secretParams)}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          }
        />
      </Box>

      <Stack spacing={2} direction="row" sx={{ mb: 2, mt: 2 }} alignItems="center">
        <Grid container direction="row">
          <Grid item xs={8}>
            <FormControl
              fullWidth
              sx={{ height: "100%", flexDirection: "column", justifyContent: "center" }}
            >
              <InputLabel
                htmlFor="credential-length-slider"
                variant="outlined"
                focused
                sx={{ position: "relative" }}
              >
                {t("secret_length")}
              </InputLabel>
              <Slider
                id="credential-length-slider"
                name="length"
                value={secretParams.length}
                onChange={(event) => {
                  handleChange(event as unknown as ChangeEvent<HTMLInputElement>);
                }}
                sx={{ width: "90%", margin: "auto" }}
                min={4}
                max={64}
              />
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <Box sx={{ ml: 1 }}>
              <FormInput
                type="number"
                id="credential-length"
                name="length"
                value={secretParams.length}
                inputProps={{ min: 4, max: 64, step: 1 }}
                onChange={handleChange}
              />
            </Box>
          </Grid>
        </Grid>
      </Stack>

      <FormGroup>
        <CustomCheckbox
          id="credential-lowercase"
          name="lowercase"
          label={t("lowercase_option")}
          checked={secretParams.lowercase}
          onChange={handleChange}
        />
        <CustomCheckbox
          id="credential-uppercase"
          name="uppercase"
          label={t("uppercase_option")}
          checked={secretParams.uppercase}
          onChange={handleChange}
        />
        <CustomCheckbox
          id="credential-numbers"
          name="numbers"
          label={t("numbers_option")}
          checked={secretParams.numbers}
          onChange={handleChange}
        />
        <CustomCheckbox
          id="credential-symbols"
          name="symbols"
          label={t("symbols_option")}
          checked={secretParams.symbols}
          onChange={handleChange}
        />
      </FormGroup>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          size="medium"
          sx={{ width: { xs: "100%", md: "200px" } }}
          onClick={submitGeneratedSecret}
        >
          {t("create_credential")}
        </Button>
      </Box>
    </Container>
  );
};

export default CredentialGeneratorPage;

type SecretParams = {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
};
