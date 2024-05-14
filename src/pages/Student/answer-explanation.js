import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// components
import Page from "../../components/Page";
// mui
import {
  Typography,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Link,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
// firebase
import {
  collection,
  doc,
  where,
  query as firebaseQuery,
  getDoc,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { DB } from "src/config";

//-----------------------------------------------------------------------

export default function answerExplanation() {
  const router = useRouter();
  const { query } = router;
  const { paperId } = query;

  const [grade, setGrade] = React.useState(0);
  const [subject, setSubject] = React.useState("");
  const [paperTitle, setPaperTitle] = React.useState("");
  const [questions, setQuestions] = React.useState([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState(null);

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

    const fetchQuestions = async () => {
      try {
        const q = firebaseQuery(
          collection(DB, "Questions"),
          orderBy("questionNumber"),
          where("paperId", "==", paperId)
        );

        const querySnapshot = await getDocs(q);

        const questionData = [];
        querySnapshot.forEach((doc) => {
          questionData.push(doc.data());
        });

        setQuestions(questionData);
      } catch (error) {
        console.error("Error retrieving questions:", error);
      }
    };

    fetchData();
    fetchQuestions();
  }, [paperId]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleBack = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    setSelectedOption(null);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleRetry = () => {
    router.push({
      pathname: "/Student/view-instructions",
      query: { paperId: paperId },
    });
  };

  const handleHome = () => {
    router.push({
      pathname: "/Student/grades-home",
    });
  };

  return (
    <Page title="Answering Explanation">
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Grade {grade}</Typography>
        <Typography variant="h4">{subject}</Typography>
        <Typography variant="h5">{paperTitle}</Typography>
      </Box>

      <Box
        style={{
          margin: 20,
          backgroundColor: "#D9D9D9",
          padding: 20,
        }}
      >
        {questions.length > 0 && (
          <>
            <Box
              sx={{
                backgroundColor: "#F7F5F6",
                padding: 7,
                height: isMobile ? "90vh" : "75vh",
                overflowY: "scroll",
              }}
            >
              {/* Display current question number and text */}
              <Typography variant="h6">
                Question {currentQuestionIndex + 1}{" "}
                {questions[currentQuestionIndex]?.questionText}
              </Typography>
              <br />

              {/* Display current question */}
              <Typography>
                {questions[currentQuestionIndex]?.question}
              </Typography>

              {/* Display options */}
              <FormControl component="fieldset">
                <RadioGroup
                  value={selectedOption}
                  onChange={handleOptionChange}
                >
                  {questions[currentQuestionIndex]?.options &&
                    questions[currentQuestionIndex]?.options.map(
                      (option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      )
                    )}
                </RadioGroup>
              </FormControl>

              {/* Display answers */}
              <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                {questions[currentQuestionIndex]?.answerList &&
                  questions[currentQuestionIndex]?.answerList.map(
                    (answer, index) => (
                      <li key={index}>{`${index + 1}. ${answer}`}</li>
                    )
                  )}
              </ul>
              <br />
              <br />

              {/* Display explanation */}
              <Box
                sx={{
                  padding: 5,
                  backgroundColor: "#DBDEE0",
                  borderRadius: "10px",
                }}
              >
                <Typography>
                  <b>Correct Answer: </b>
                  {questions[currentQuestionIndex]?.correctAnswer}
                </Typography>
                <br />
                <Typography>
                  <b>Explanation: </b>
                  {questions[currentQuestionIndex]?.explainedAnswer}
                </Typography>
              </Box>
            </Box>
            {/* Navigation buttons */}
            <Box display="flex" justifyContent="space-between" padding={3}>
              <Button
                variant="contained"
                onClick={handleBack}
                disabled={currentQuestionIndex === 0}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
              </Button>
            </Box>
          </>
        )}
      </Box>

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ paddingBottom: "2%" }}
      >
        <Button
          variant="contained"
          size="large"
          color="secondary"
          onClick={handleRetry}
        >
          Retry
        </Button>

        <Button
          variant="contained"
          size="large"
          color="secondary"
          onClick={handleHome}
        >
          Home
        </Button>
      </Stack>
    </Page>
  );
}
