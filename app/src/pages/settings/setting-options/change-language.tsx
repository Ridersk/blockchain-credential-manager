import {
  Box,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { localeOptions } from "locales";
import { setCurrentLanguage } from "i18n";
import { useNavigate } from "react-router";
import { sleep } from "utils/time";
import useNotification from "hooks/useNotification";

const ChangeLanguagePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sendNotification = useNotification();
  const [languageOptions, setLanguageOptions] = useState<LanguageOption[]>([]);

  useEffect(() => {
    const languages: LanguageOption[] = [];

    for (const key in localeOptions) {
      languages.push({ id: key, name: localeOptions[key as keyof typeof localeOptions].name });
    }

    setLanguageOptions(languages);
  }, []);

  const handleSelectLanguage = async (langId: string) => {
    setCurrentLanguage(langId);
    sendNotification({
      message: t("language_changed"),
      variant: "success"
    });
    await sleep(500);
    navigate(-1);
    // window.location.reload();
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t("change_language")}
        </Typography>
      </Box>

      <Box my={4} display="flex" flexDirection="column">
        <List>
          {languageOptions.map((option, index) => (
            <ListItem key={index} disablePadding onClick={() => handleSelectLanguage(option.id)}>
              <ListItemButton>
                <ListItemText primary={option.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default ChangeLanguagePage;

export type LanguageOption = { id: string; name: string };
