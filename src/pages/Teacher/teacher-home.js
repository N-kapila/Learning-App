import { m } from "framer-motion";
// @mui
import { styled } from "@mui/material/styles";
import { Button, Stack, Container, Box, Grid } from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PreviewIcon from "@mui/icons-material/Preview";
// next
import Link from "next/link";
// layouts
import Layout from "../../layouts";
// components
import Page from "../../components/Page";
import { MotionContainer, varBounce } from "../../components/animate";

// ----------------------------------------------------------------------

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

// teacherHome.getLayout = function getLayout(page) {
//   return <Layout variant="logoOnly">{page}</Layout>;
// };

// ----------------------------------------------------------------------

export default function teacherHome() {
  return (
    <Page title="Teacher Home">
      <Container component={MotionContainer}>
        <ContentStyle sx={{ textAlign: "center", alignItems: "center" }}>
          <m.div variants={varBounce().in}>
            <h1> Welcome to LEARNIA</h1>
          </m.div>

          <Box
            sx={{
              bgcolor: "#D2D6D6",
              width: "100vh",
              borderRadius: "10px",
              marginTop: "50px",
              padding: "20px",
            }}
          >
            <h2>Select your option</h2>
            <hr />

            <Stack spacing={2} sx={{ padding: "40px" }}>
              <Link href="/Teacher/create-paper">
                <Button variant="contained" sx={{ height: "75px" }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={8}>
                      <h1> Create Paper</h1>
                    </Grid>
                    <Grid item xs={2} container justifyContent="flex-end">
                      <NoteAddIcon fontSize="large" />
                    </Grid>
                  </Grid>
                </Button>
              </Link>

              <Link href="/Teacher/teacher-grades-home">
                <Button variant="contained" sx={{ height: "75px" }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={8}>
                      <h1>View Papers</h1>
                    </Grid>
                    <Grid item xs={2} container justifyContent="flex-end">
                      <PreviewIcon fontSize="large" />
                    </Grid>
                  </Grid>
                </Button>
              </Link>
            </Stack>
          </Box>
        </ContentStyle>
      </Container>
    </Page>
  );
}
