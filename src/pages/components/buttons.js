import React from "react";
import { Button, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  width: 200,
}));

function Buttons({ name, clickHandler }) {
  return (
    <Grid item xs={4} md={3} lg={2}>
      <StyledButton
        variant="contained"
        fullWidth={true}
        size="large"
        onClick={clickHandler}
      >
        {name}
      </StyledButton>
    </Grid>
  );
}

export default Buttons;
