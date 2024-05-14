import React, { useEffect } from "react";
import { useRouter, useState } from "next/router";
//mui
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
// components
import Page from "../../components/Page";
//firebase
import { doc, getDoc, setDoc } from "firebase/firestore";
import { DB } from "src/config";
//next
import { useSnackbar } from "notistack";

//-----------------------------------------------------------------------

export default function questionsInstructions() {
  const router = useRouter();
  const { query } = useRouter();
  const { paperId } = query;
  const { enqueueSnackbar } = useSnackbar();

  const [grade, setGrade] = React.useState(0);
  const [subject, setSubject] = React.useState("");
  const [paperTitle, setPaperTitle] = React.useState("");
  const [instructions, setInstructions] = React.useState("");

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
          setInstructions(documentData.instructions || ""); // Set the instructions if available or an empty string if not
        } else {
          console.log("Document not found.");
        }
      } catch (error) {
        console.error("Error retrieving document:", error);
      }
    };

    fetchData();
  }, [paperId]);

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    try {
      const docRef = doc(DB, "Paper", paperId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await setDoc(docRef, { instructions: instructions }, { merge: true });
        enqueueSnackbar("Instruction saved successfully", {
          variant: "success",
        });
        console.log("Instruction updated successfully!");
      } else {
        console.log("Document not found.");
      }
    } catch (error) {
      console.error("Error updating instruction:", error);
    }
  };

  return (
    <Page title="Questions Instructions">
      <Box
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

        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <TextField
            fullWidth
            label="Add Instructions"
            multiline
            rows={8}
            value={instructions.toString()} // Convert instructions to a string
            onChange={(e) => setInstructions(e.target.value)}
            sx={{
              width: "80%",
              height: "200px",
              display: "flex",
              alignItems: "center",
            }}
          />
        </Box>

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={4}
          sx={{ marginTop: 10 }}
        >
          <Button variant="contained" size="large" onClick={handleSave}>
            Save
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleBack}
          >
            Back
          </Button>
        </Stack>
      </Box>
    </Page>
  );
}
