import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
//mui
import { Box, Button, TextField, Typography, Stack, Grid } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
//firebase
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { DB } from "src/config";
//components
import Page from "../../components/Page";

//-----------------------------------------------------------------------

export default function ViewCreatedQuestions() {
  const router = useRouter();
  const { questionId } = router.query;
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [updatedQuestionNumber, setUpdatedQuestionNumber] = React.useState(0);
  const [updatedQuestion, setUpdatedQuestion] = React.useState("");
  const [updatedAnswerList, setUpdatedAnswerList] = React.useState([]);
  const [updatedCorrectAnswer, setUpdatedCorrectAnswer] = React.useState("");
  const [updatedExplainedAnswer, setUpdatedExplainedAnswer] =
    React.useState("");

  const updateData = async () => {
    try {
      const docRef = doc(DB, "Questions", questionId); // Replace 'documentId' with the actual document ID

      const updatedData = {
        questionNumber: updatedQuestionNumber,
        question: updatedQuestion,
        answerList: updatedAnswerList,
        correctAnswer: updatedCorrectAnswer,
        explainedAnswer: updatedExplainedAnswer,
      };

      await updateDoc(docRef, updatedData);
      enqueueSnackbar("Question has been updated", { variant: "success" });
      console.log(`Document has been updated successfully.`);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const deleteData = async () => {
    try {
      const docRef = doc(DB, "Questions", questionId);
      await deleteDoc(docRef);
      enqueueSnackbar("Question has been deleted", { variant: "success" });
      console.log("Document has been deleted successfully.");
      router.back();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(DB, "Questions", questionId); // Replace 'documentId' with the actual document ID

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const documentData = docSnap.data();
          console.log("Document data:", documentData);
          setUpdatedQuestionNumber(documentData.questionNumber);
          setUpdatedQuestion(documentData.question);
          setUpdatedAnswerList(documentData.answerList);
          setUpdatedCorrectAnswer(documentData.correctAnswer);
          setUpdatedExplainedAnswer(documentData.explainedAnswer);
        } else {
          console.log("Document not found.");
        }
      } catch (error) {
        console.error("Error retrieving document:", error);
      }
    };
    fetchData();
  }, []);

  const handleBack = () => {
    router.back(); // Go back to the previous page
  };

  return (
    <Page title="View Created question" sx={{ padding: "20px" }}>
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Typography variant="h2" paragraph>
          Created Question
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ margin: 10 }}>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Typography variant="h5" sx={{ minWidth: "200px" }}>
            Question Number:
          </Typography>
          <TextField
            fullWidth
            value={updatedQuestionNumber}
            size="small"
            onChange={(e) => setUpdatedQuestionNumber(e.target.value)}
          />
        </Box>
        <br />
        <Box display="flex" flexDirection="row" alignItems="center">
          <Typography variant="h5" sx={{ minWidth: "200px" }}>
            Question:
          </Typography>
          <TextField
            fullWidth
            value={updatedQuestion}
            size="small"
            onChange={(e) => setUpdatedQuestion(e.target.value)}
            multiline
          />
        </Box>
        <br />
        <Box display="flex" flexDirection="row" alignItems="center">
          <Typography variant="h5" sx={{ minWidth: "200px" }}>
            Answer List:
          </Typography>
          <TextField
            fullWidth
            onChange={(e) => setUpdatedAnswerList(e.target.value.split("\n"))}
            multiline
            rows={4}
            value={updatedAnswerList
              .map((answer, index) => `${index + 1}. ${answer}`)
              .join("\n")}
            // helperText="You cannot edit answers here"
            disabled
          />
        </Box>

        <br />
        <Box display="flex" flexDirection="row" alignItems="center">
          <Typography variant="h5" sx={{ minWidth: "200px" }}>
            Correct Answer:
          </Typography>
          <TextField
            fullWidth
            value={updatedCorrectAnswer}
            size="small"
            onChange={(e) => setUpdatedCorrectAnswer(e.target.value)}
          />
        </Box>
        <br />
        <Box display="flex" flexDirection="row" alignItems="center">
          <Typography variant="h5" sx={{ minWidth: "200px" }}>
            Explained Answer:
          </Typography>
          <TextField
            fullWidth
            value={updatedExplainedAnswer}
            size="small"
            onChange={(e) => setUpdatedExplainedAnswer(e.target.value)}
            multiline
          />
        </Box>
      </Grid>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={updateData}
        >
          Update
        </Button>
        <Button
          variant="contained"
          color="error"
          size="large"
          onClick={handleClickOpen}
        >
          Delete
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure want to permanently delete this Question?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={deleteData}>Yes</Button>
            <Button onClick={handleClose} autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleBack}
        >
          Back
        </Button>
      </Stack>
    </Page>
  );
}
