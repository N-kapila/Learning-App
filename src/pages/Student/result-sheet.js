import React, { useEffect } from "react";
import { useRouter } from "next/router";
// components
import Page from "../../components/Page";
//mui
import { Box, Stack, Button, Typography } from "@mui/material";
// next
import Link from "next/link";
// firebase
import { doc, query as firebaseQuery, getDoc } from "firebase/firestore";
import { DB } from "src/config";

//------------------------------------------------------------

export default function resultSheet() {
  const router = useRouter();
  const { query } = router;
  const { paperId } = query;

  const [grade, setGrade] = React.useState(0);
  const [subject, setSubject] = React.useState("");
  const [paperTitle, setPaperTitle] = React.useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(DB, "Paper", paperId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const documentData = docSnap.data();
          setGrade(documentData.grade);
          setSubject(documentData.subject);
          setPaperTitle(documentData.paperTitle);
        } else {
          console.log("Document not found.");
        }
      } catch (error) {
        console.error("Error retrieving document:", error);
      }
    };

    fetchData();
  }, [paperId]);

  const handleRetry = () => {
    router.push({
      pathname: "/Student/view-instructions",
      query: { paperId: paperId },
    });
  };

  const handleViewAnswers = () => {
    router.push({
      pathname: "/Student/answer-explanation",
      query: { paperId: paperId },
    });
  };

  const handleHome = () => {
    router.push({
      pathname: "/Student/grades-home",
    });
  };

  return (
    <Page title="Result Sheet">
      <Box
        justifyContent="center"
        sx={{
          backgroundColor: "#D9D9D9",
          margin: "1%",
          borderRadius: "10px",
          padding: "2%",
          height: "100vh",
        }}
      >
        <Typography variant="h5">Grade {grade}</Typography>
        <Typography variant="h4">{subject}</Typography>
        <Typography variant="h5">{paperTitle}</Typography>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={8}
          height="100%"
        >
          <Box
            sx={{
              backgroundColor: "#FC5050",
              padding: "75px",
              textAlign: "center",
              borderRadius: "25px",
            }}
          >
            <p>Time duration 1 hour</p>
            <br />
            <h1>You got 68% marks</h1>
          </Box>

          <Stack direction="row" spacing={4}>
            <Button variant="contained" size="large" onClick={handleRetry}>
              Retry
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleViewAnswers}
            >
              View Answers
            </Button>
            <Button variant="contained" size="large" onClick={handleHome}>
              Home
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Page>
  );
}
