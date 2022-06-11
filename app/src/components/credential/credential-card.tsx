import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Avatar, Box, Card, CardContent, IconButton, Skeleton, Typography, useTheme } from "@mui/material";
import { copyTextToClipboard } from "utils/clipboard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {
  dataLoaded?: boolean;
  url: string;
  label: string;
  secret: string;
}

const CredentialCard = ({ dataLoaded = true, url, label, secret }: Props) => {
  const navigate = useNavigate();

  const handleClickCopySecret = () => {
    copyTextToClipboard(secret);
  };

  const goToEditCredentialPage = () => {
    navigate({ pathname: "/credentials-creation" });
  };

  return (
    <Card>
      <CardContent sx={{ display: "flex", padding: { xs: "4px", md: "16px" } }}>
        <Box sx={{ width: "16%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          {dataLoaded ? (
            <Avatar
              src="https://github.githubassets.com/favicons/favicon.svg"
              sx={{ width: { xs: 30, md: 50 }, height: { xs: 30, md: 50 } }}
            />
          ) : (
            <Skeleton variant="circular" animation="wave" sx={{ width: { xs: 30, md: 50 }, height: { xs: 30, md: 50 } }} />
          )}
        </Box>
        <Box sx={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
          {dataLoaded ? (
            <Typography component="div" variant="h6" noWrap>
              {url}
            </Typography>
          ) : (
            <Skeleton variant="text" animation="wave" height={20} width="40%" />
          )}

          {dataLoaded ? (
            <Typography component="div" variant="subtitle2" noWrap>
              {label}
            </Typography>
          ) : (
            <Skeleton variant="text" animation="wave" height={20} width="60%" />
          )}
        </Box>
        {dataLoaded && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <IconButton onClick={goToEditCredentialPage}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={handleClickCopySecret}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CredentialCard;
