import React, { useEffect, useState } from "react";
import { m } from "framer-motion";
import { useRouter } from "next/router";
// @mui
import { styled } from "@mui/material/styles";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { Typography, Container, Grid, IconButton, Box } from "@mui/material";

// next
import Link from "next/link";

//Components
import Page from "../../components/Page";
import { MotionContainer, varBounce } from "../../components/animate";
import Buttons from "../components/buttons";

//firebase
import { collection, getDocs } from "firebase/firestore";
import { DB } from "src/config";

// ----------------------------------------------------------------------

function teacherGradesHome() {
  const [buttonList, setButtonList] = useState([]);
  const router = useRouter();

  const ContentStyle = styled("div")(({ theme }) => ({
    margin: "auto",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: theme.spacing(12, 0),
  }));

  useEffect(() => {
    const getGrades = async () => {
      try {
        const gradesSnapshot = await getDocs(collection(DB, "grades"));
        const buttonNames = gradesSnapshot.docs.map((doc) => doc.id);
        const sortedButtonNames = buttonNames
          .map((name) => extractNumericPart(name)) // Extract numeric part from grade names
          .sort((a, b) => a - b); // Sort the numbers in ascending order
        setButtonList(sortedButtonNames);
      } catch (error) {
        console.log("Error getting grades collection:", error);
      }
    };

    getGrades();
  }, []);

  const extractNumericPart = (name) => {
    const numericPart = name.replace("Grade ", ""); // Adjust the string manipulation based on your grade name format
    return parseInt(numericPart, 10);
  };

  return (
    <Page title=" Grades">
      <Container component={MotionContainer}>
        <ContentStyle>
          <Grid container spacing={2}>
            {/* <Link href="/teacher-home">
              <IconButton>
                <ArrowCircleLeftOutlinedIcon fontSize="large" />
              </IconButton>
            </Link> */}
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <m.div variants={varBounce().in}>
                <Typography variant="h2" paragraph>
                  Welcome to LEARNIA
                </Typography>
              </m.div>
            </Grid>
          </Grid>
          <Box
            sx={{
              bgcolor: "#D2D6D6",
              width: 0.8,
              borderRadius: "10px",
              padding: "50px",
            }}
          >
            <Box
              item
              xs={12}
              sx={{ textAlign: "center", paddingBottom: "30px" }}
            >
              <Typography variant="h3" paragraph>
                Select your Grade
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
              {buttonList.map((grade, index) => (
                <Grid item key={index}>
                  <Buttons
                    name={`grade ${grade}`}
                    clickHandler={() => {
                      router.push({
                        pathname: "/Teacher/teacher-view-subjects",
                        query: { grade: grade },
                      });
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default teacherGradesHome;
