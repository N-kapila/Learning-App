import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

// @mui
import { styled } from "@mui/material/styles";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import {
  Button,
  Typography,
  Container,
  Grid,
  IconButton,
  Box,
} from "@mui/material";

// next
import Link from "next/link";

//Components
import Page from "src/components/Page";
import { MotionContainer } from "src/components/animate";
import PaperButton from "src/pages/components/paper-button";

//firebase
import { collection, query, where, getDocs } from "firebase/firestore";
import { DB } from "src/config";

// ----------------------------------------------------------------------

function teacherViewPapers() {
  const router = useRouter();
  const [buttonList, setButtonList] = useState([]);
  const { grade, subject } = router.query;

  const ContentStyle = styled("div")(({ theme }) => ({
    margin: "auto",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: theme.spacing(12, 0),
  }));

  useEffect(() => {
    const getPapers = async () => {
      try {
        const q = query(
          collection(DB, "Paper"),
          where("grade", "==", grade),
          where("subject", "==", subject)
        );

        const querySnapshot = await getDocs(q);

        const papers = [];
        querySnapshot.forEach((doc) => {
          const paper = {
            paperId: doc.id, // Store the paperId
            paperTitle: doc.data().paperTitle,
          };
          papers.push(paper);
        });

        setButtonList(papers);
      } catch (error) {
        console.error("Error retrieving papers:", error);
      }
    };

    if (grade && subject) {
      getPapers();
    }
  }, [grade, subject]);

  const handleBack = () => {
    router.back(); // Go back to the previous page
  };

  return (
    <Page title="Papers">
      <Container component={MotionContainer}>
        <ContentStyle>
          <Grid container spacing={2}>
            <IconButton onClick={handleBack}>
              <ArrowCircleLeftOutlinedIcon fontSize="large" />
            </IconButton>
          </Grid>
          <Box
            sx={{
              bgcolor: "#D2D6D6",
              width: 0.8,
              borderRadius: "10px",
              padding: "50px",
              marginTop: 5,
            }}
          >
            <Box
              item
              xs={12}
              sx={{ textAlign: "center", paddingBottom: "30px" }}
            >
              <Typography variant="h3" paragraph>
                Papers
              </Typography>
              <hr />
            </Box>
            <Grid
              sx={{
                width: 1,
              }}
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              justifyItems="center "
              spacing={4}
            >
              {buttonList.length === 0 ? (
                <Typography variant="body1" sx={{ padding: 10 }}>
                  No papers added yet.....
                </Typography>
              ) : (
                buttonList.map((paper, index) => (
                  <PaperButton
                    key={index}
                    paper={paper.paperTitle}
                    clickHandler={() => {
                      router.push({
                        pathname: "/Teacher/teacher-paper-view",
                        query: {
                          paperId: paper.paperId,
                        },
                      });
                    }}
                  />
                ))
              )}
            </Grid>
          </Box>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default teacherViewPapers;
