import React from "react";
import { Button, Grid } from "@mui/material";
import FeedIcon from "@mui/icons-material/Feed";

function PaperButton({ paper, clickHandler }) {
  return (
    <Grid item xs={4}>
      <Button
        variant="contained"
        fullWidth={true}
        size="Large"
        onClick={clickHandler}
        endIcon={<FeedIcon />}
      >
        {paper}
      </Button>
    </Grid>
  );
}

export default PaperButton;
