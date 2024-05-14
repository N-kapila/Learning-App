import React from "react";
import { Button, Grid } from "@mui/material";
import SubjectIcon from "@mui/icons-material/Subject";

function SubjectButton({ subjects, clickHandler }) {
  return (
    <Grid item xs={6}>
      <Button
        variant="contained"
        fullWidth={true}
        size="Large"
        onClick={clickHandler}
        endIcon={<SubjectIcon />}
      >
        {subjects}
      </Button>
    </Grid>
  );
}

export default SubjectButton;
