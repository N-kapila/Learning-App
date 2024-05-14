import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { m } from "framer-motion";
// components
import Page from "../../components/Page";
import { MotionContainer, varBounce } from "../../components/animate";
// @mui
import { styled } from "@mui/material/styles";
import {
  Button,
  Typography,
  Container,
  Grid,
  IconButton,
  Link,
  Box,
  Stack,
} from "@mui/material";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import AddIcon from "@mui/icons-material/Add";
// hooks
import useResponsive from "src/hooks/useResponsive";
// firebase
import { collection, doc, getDocs, where, query } from "firebase/firestore";
import { DB } from "src/config";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  padding: theme.spacing(5, 0),
}));

// ----------------------------------------------------------------------

export default function questionNumberAdd() {
  const smUp = useResponsive("up", "sm");

  const mdUp = useResponsive("up", "md");

  const [questions, setQuestions] = useState([]);

  const router = useRouter();
  const { paperId } = router.query;
  //console.log("paperId:", paperId);

  const handleCreateQuestion = () => {
    router.push({
      pathname: "/Teacher/create-new-question",
      query: { paperId: paperId },
    });
  };

  const handleViewPaper = () => {
    router.push({
      pathname: "/Teacher/teacher-paper-view",
      query: { paperId },
    });
  };

  const handleQuestionClick = async (questionId) => {
    router.push({
      pathname: "/Teacher/view-created-question",
      query: {
        questionId: questionId,
      },
    });
  };

  const handleInstructionAdd = () => {
    router.push({
      pathname: "/Teacher/questions-Instructions",
      query: { paperId: paperId },
    });
  };

  const handleDoPaper = () => {
    router.push({
      pathname: "/Student/view-instructions",
      query: { paperId: paperId },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(DB, "Questions"),
          where("paperId", "==", paperId)
        );
        const querySnapshot = await getDocs(q);
        // console.log("querySnapshot:", querySnapshot.size);
        setQuestions(querySnapshot.docs);

        setQu;
      } catch (error) {
        console.log("Error getting documents: ", error);
      }
    };
    fetchData();
  }, []);

  const handleBack = () => {
    router.back(); // Go back to the previous page
  };

  return (
    <Page title="Question Number Add">
      <RootStyle>
        <Container component={MotionContainer}>
          <ContentStyle>
            <Grid container spacing={2}>
              <Grid container alignItems="center">
                <Grid item xs={6}>
                  <Link href="/Teacher/create-paper">
                    <IconButton>
                      <ArrowCircleLeftOutlinedIcon fontSize="large" />
                    </IconButton>
                  </Link>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Link underline="hover" onClick={handleInstructionAdd}>
                    Add Instructions
                  </Link>
                  <br />
                  {/* <Link underline="hover" onClick={handleDoPaper}>
                    Do paper
                  </Link> */}
                </Grid>
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <m.div variants={varBounce().in}>
                  <Typography variant="h2" paragraph>
                    Create a new Question
                  </Typography>
                </m.div>
              </Grid>

              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                height="50vh"
              >
                <Box
                  style={{
                    width: "80%",
                    textAlign: "center",
                    //display: "flex", alignItems: "center"
                  }}
                >
                  <IconButton
                    variant="contained"
                    style={{
                      backgroundColor: "#A1A2A2",
                      width: 75,
                      height: 75,
                      marginTop: 30,
                      marginBottom: 50,
                    }}
                    onClick={handleCreateQuestion}
                  >
                    <AddIcon fontSize="large" style={{ color: "#ffffff" }} />
                  </IconButton>

                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {questions
                      .sort(
                        (a, b) =>
                          a.data().questionNumber - b.data().questionNumber
                      )
                      .map((question, index) => (
                        <Button
                          key={index}
                          variant="outlined"
                          onClick={() => handleQuestionClick(question.id)}
                          style={{
                            width: 75,
                            height: 75,
                            borderRadius: "50%",
                            marginRight: "16px",
                            marginTop: "16px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#Eaedee",
                          }}
                        >
                          {question.data().questionNumber}
                        </Button>
                      ))}
                  </Grid>
                </Box>
              </Grid>
              <Stack
                direction="row"
                spacing={4}
                sx={{
                  padding: "20px",
                  position: "fixed",
                  bottom: 30,
                  right: 50,
                }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ width: 150 }}
                  onClick={handleViewPaper}
                >
                  View Paper
                </Button>
              </Stack>
            </Grid>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
