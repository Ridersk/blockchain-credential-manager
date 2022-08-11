import { LoadingButton } from "@mui/lab";
import { Container, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const WelcomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goToRegisterPage = () => {
    navigate({ pathname: "/register" });
  };

  const goToImportPage = () => {
    navigate({ pathname: "/import" });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: "16px" }}>
      <Grid container direction="column" sx={{ minHeight: "100vh" }}>
        <Grid item xs={12} my={4}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            {t("welcome_new_user")}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            flex: "1 !important",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <Grid container justifyContent="center">
            <LoadingButton
              type="submit"
              sx={{ width: { xs: "100%", md: "200px" } }}
              loadingPosition="center"
              size="medium"
              variant="contained"
              color="primary"
              onClick={goToRegisterPage}
            >
              {t("btn_new_vault")}
            </LoadingButton>
            <LoadingButton
              type="submit"
              sx={{ width: { xs: "100%", md: "200px" } }}
              loadingPosition="center"
              size="medium"
              variant="contained"
              color="secondary"
              onClick={goToImportPage}
            >
              {t("btn_import_vault")}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WelcomePage;
