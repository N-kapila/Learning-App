import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// @mui
import { styled } from "@mui/material/styles";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { Typography, Container, Grid, IconButton, Box } from "@mui/material";

// next
import Link from "next/link";

//Components
import Page from "src/components/Page";
import { MotionContainer } from "src/components/animate";
import Buttons from "src/pages/components/buttons";

//firebase
import {
  collection,
  getDocs,
  getDoc,
  getFirestore,
  doc,
} from "firebase/firestore";

// ----------------------------------------------------------------------

function teacherViewSubjects() {
  const router = useRouter();
  const [buttonList, setButtonList] = useState([]);
  const { grade } = router.query;

  const ContentStyle = styled("div")(({ theme }) => ({
    margin: "auto",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: theme.spacing(12, 0),
  }));

  useEffect(() => {
    const getSubjects = async () => {
      try {
        const firestore = getFirestore();
        const gradeDocRef = doc(firestore, "grades", `Grade ${grade}`);
        const gradeDocSnapshot = await getDoc(gradeDocRef);
        if (gradeDocSnapshot.exists()) {
          const subjectNames = [];

          // Fetch subcollection names from the 'grade' document
          const subjectCollectionRef = collection(gradeDocRef, "subjects");
          const subcollectionsSnapshot = await getDocs(subjectCollectionRef);
          subcollectionsSnapshot.forEach((subcollectionSnapshot) => {
            subjectNames.push(subcollectionSnapshot.data().name);
          });

          // console.log("Subcollection names:", subjectNames);

          setButtonList(subjectNames);
        } else {
          console.log("Grade document not found");
        }
      } catch (error) {
        console.log("Error getting subjects:", error);
      }
    };

    if (grade) {
      getSubjects();
    }
  }, [grade]);

  const handleBack = () => {
    router.back(); // Go back to the previous page
  };

  return (
    <Page title="Subjects">
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
                Subjects
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
                  No subjects added yet.....
                </Typography>
              ) : (
                buttonList.map((subject, index) => (
                  <Grid item key={index}>
                    <Buttons
                      name={` ${subject}`}
                      clickHandler={() => {
                        router.push({
                          pathname: "teacher-papers-view",
                          query: { subject: subject, grade: grade },
                        });
                      }}
                    />
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default teacherViewSubjects;
