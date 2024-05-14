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
  Grid,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
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

export default function AnsweringPaper() {
  const router = useRouter();
  const { query } = router;
  const { paperId } = query;

  const [grade, setGrade] = React.useState(0);
  const [subject, setSubject] = React.useState("");
  const [paperTitle, setPaperTitle] = React.useState("");
  const [questions, setQuestions] = React.useState([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState(null);

  const [timeLeft, setTimeLeft] = useState(60 * 60); // 1 hour in seconds
  const [timeLimitFinished, setTimeLimitFinished] = useState(false);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  const handleSubmit = () => {
    router.push({
      pathname: "/Student/result-sheet",
      query: { paperId: paperId },
    });
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    if (timeLeft <= 0) {
      setTimeLimitFinished(true);
      setOpen(true);
      return "";
    }

    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  //Question number selecting

  const handleQuestionClick = (questionId) => {
    const index = questions.findIndex((question) => question.id === questionId);
    setCurrentQuestionIndex(index);
    setSelectedOption(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = firebaseQuery(
          collection(DB, "Questions"),
          orderBy("questionNumber"),
          where("paperId", "==", paperId)
        );
        const querySnapshot = await getDocs(q);
        const questionData = [];
        querySnapshot.forEach((doc) => {
          questionData.push({ id: doc.id, ...doc.data() });
        });
        setQuestions(questionData);
      } catch (error) {
        console.log("Error getting documents: ", error);
      }
    };
    fetchData();
  }, [paperId]);

  return (
    <Page title="Answering Paper">
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
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
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
                    padding: 10,
                    height: isMobile ? "80vh" : "60vh",
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
                          <li key={index}>
                            <FormControlLabel
                              control={
                                <Radio
                                  value={answer}
                                  checked={selectedOption === answer}
                                  onChange={handleOptionChange}
                                />
                              }
                              label={`${index + 1}. ${answer}`} // Add answer number
                            />
                          </li>
                        )
                      )}
                  </ul>
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
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack
            direction="column"
            justifyContent="space-around"
            alignItems="center"
            spacing={12}
          >
            <Stack>
              {timeLimitFinished ? (
                <>
                  <h1>Time is up!</h1>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="sm"
                    PaperProps={{
                      style: { minWidth: "400px" }, // Adjust the minWidth to your desired value
                    }}
                  >
                    <DialogTitle id="alert-dialog-title">
                      Your time is up!
                    </DialogTitle>
                    <DialogActions>
                      <Button onClick={handleSubmit}>Submit</Button>
                    </DialogActions>
                  </Dialog>
                </>
              ) : (
                <h1>Time left: {formatTime()} </h1>
              )}
            </Stack>

            <Stack>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                {questions
                  .filter((question) => question.questionNumber)
                  .sort((a, b) => a.questionNumber - b.questionNumber)
                  .map((question, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      onClick={() => handleQuestionClick(question.id)}
                      style={{
                        width: 50,
                        height: 50,
                        marginRight: "16px",
                        marginTop: "16px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#Eaedee",
                      }}
                    >
                      {question.questionNumber}
                    </Button>
                  ))}
              </Grid>
            </Stack>
            <Stack>
              <Box
                sx={{
                  position: "relative",
                  marginTop: "20px",
                  marginRight: "20px",
                  textAlign: "right",
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  size="large"
                  color="error"
                >
                  Submit
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Page>
  );
}
