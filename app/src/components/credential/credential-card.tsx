import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LandscapeIcon from "@mui/icons-material/Landscape";
import { Avatar, Box, Card, CardContent, IconButton, Skeleton, Typography } from "@mui/material";
import { copyTextToClipboard } from "utils/clipboard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Props {
  dataLoaded?: boolean;
  credentialKey: string;
  url: string;
  label: string;
  secret: string;
}

const CredentialCard = ({ dataLoaded = true, credentialKey, url, label, secret }: Props) => {
  const navigate = useNavigate();
  const [iconUrl, setIconUrl] = useState<string>();

  useEffect(() => {
    try {
      setIconUrl(new URL(url).origin + "/favicon.ico");
    } catch (error) {}
  }, [url]);

  const handleClickCopySecret = () => {
    copyTextToClipboard(secret);
  };

  const goToEditCredentialPage = () => {
    navigate({ pathname: "/credential", search: `?cred=${credentialKey}` });
  };

  function renderAvatar() {
    if (iconUrl) {
      return (
        <Avatar src={iconUrl} sx={{ width: { xs: 40, md: 64 }, height: { xs: 40, md: 64 } }} />
      );
    } else {
      return (
        <Avatar sx={{ width: { xs: 40, md: 64 }, height: { xs: 40, md: 64 } }}>
          <LandscapeIcon />
        </Avatar>
      );
    }
  }

  return (
    <Card>
      <CardContent
        sx={{ display: "flex", padding: { xs: "8px !important", md: "16px !important" } }}
      >
        <Box
          sx={{
            width: "24%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {dataLoaded ? (
            renderAvatar()
          ) : (
            <Skeleton
              variant="circular"
              animation="wave"
              sx={{ width: { xs: 30, md: 50 }, height: { xs: 30, md: 50 } }}
            />
          )}
        </Box>
        <Box
          sx={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden"
          }}
        >
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
