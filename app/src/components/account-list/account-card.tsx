import { Card, CardActionArea, CardContent, Grid, Skeleton, Typography } from "@mui/material";
import { formatAddress } from "utils/address";

type Props = {
  dataLoaded?: boolean;
  publicKey: string;
  privateKey: string;
  balance: number;
  onClick: (account: { publicKey: string; privateKey: string }) => void;
};

const AccountCard = ({ dataLoaded, publicKey, privateKey, balance, onClick }: Props) => {
  const handleClick = () => {
    onClick({ publicKey, privateKey });
  };

  return (
    <Card>
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Grid container direction="column">
            {dataLoaded ? (
              <>
                <Grid item xs={8}>
                  <Typography component="div" variant="body2" noWrap>
                    {formatAddress(publicKey, 32, 8)}
                  </Typography>
                  <Typography component="div" variant="body2" noWrap color="gray">
                    {balance} SOL
                  </Typography>
                </Grid>
              </>
            ) : (
              <Skeleton variant="text" animation="wave" height={20} width="60%" />
            )}
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default AccountCard;
