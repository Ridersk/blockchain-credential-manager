import { forwardRef } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";
import { ReactNode } from "react";

// constant
const headerSX = {
  "& .MuiCardHeader-action": { mr: 0 }
};

// ==============================|| CUSTOM MAIN CARD ||============================== //
type Props = React.HTMLProps<HTMLDivElement> & {
  border?: boolean;
  boxShadow?: boolean;
  content?: boolean;
  contentClass?: string;
  contentSX?: object;
  darkTitle?: boolean;
  secondary?: ReactNode;
  shadow?: string;
  title?: ReactNode | string | object;
  sx: object;
};

const MainCard = forwardRef<HTMLDivElement, Props>(
  (
    {
      border = true,
      boxShadow = false,
      children,
      content = false,
      contentClass = "",
      contentSX = {},
      darkTitle = false,
      secondary,
      shadow,
      sx = {},
      title
      //   ...others
    },
    ref
  ) => {
    const theme = useTheme();

    return (
      <Card
        ref={ref}
        // {...others}
        sx={{
          border: border ? "1px solid" : "none",
          // borderColor: theme.palette.primary[200] + 75,
          ":hover": {
            boxShadow: boxShadow ? shadow || "0 2px 14px 0 rgb(32 40 45 / 8%)" : "inherit"
          },
          ...sx
        }}
      >
        {/* card header and action */}
        {!darkTitle && title && <CardHeader sx={headerSX} title={title} action={secondary} />}
        {darkTitle && title && (
          <CardHeader
            sx={headerSX}
            title={<Typography variant="h3">{title}</Typography>}
            action={secondary}
          />
        )}

        {/* content & header divider */}
        {title && <Divider />}

        {/* card content */}
        {content && (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  }
);

export default MainCard;
