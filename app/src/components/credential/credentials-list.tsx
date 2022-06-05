import { Avatar, List, ListItem } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

const CredentialsList = () => {
  return (
    <List>
      <ListItem>
        <Avatar>
          <ImageIcon />
        </Avatar>
      </ListItem>
    </List>
  );
};

export default CredentialsList;
