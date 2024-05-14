import React, { useEffect } from "react";
import { useRouter } from "next/router";
//components
import Page from "../../components/Page";
// @mui
import { Typography, Link, IconButton, Box } from "@mui/material";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
//firebase
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

function teacherPaperView() {
  const router = useRouter();
  const { query } = useRouter();
  const { paperId } = query;

  const [grade, setGrade] = React.useState(0);
  const [subject, setSubject] = React.useState("");
  const [paperTitle, setPaperTitle] = React.useState("");
  const [questions, setQuestions] = React.useState([]);

  const handleBack = () => {
    router.back(); // Go back to the previous page
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
        // console.log(questionData);
      } catch (error) {
        console.error("Error retrieving questions:", error);
      }
    };

    fetchData();
    fetchQuestions();
  }, [paperId]);

  return (
    <Page title="View Paper">
      <Box style={{ position: "relative", marginTop: 20 }}>
        <Box style={{ position: "absolute", top: 20, left: 70 }}>
          <Link onClick={handleBack}>
            <IconButton>
              <ArrowCircleLeftOutlinedIcon fontSize="large" />
            </IconButton>
          </Link>
        </Box>
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
      </Box>

      <Box sx={{ padding: 10 }}>
        {/* Render the questions */}
        {questions.map((question, index) => (
          <Box
            key={index}
            sx={{
              padding: "20px 20px 20px 40px",
              border: "1px solid black",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Question {question.questionNumber}
            </Typography>
            <Typography>{question.question}</Typography>
            <Typography variant="subtitle2" sx={{ marginTop: "10px" }}>
              Answers:
            </Typography>
            <ol>
              {question.answerList.map((answer, index) => (
                <li key={index}>{answer}</li>
              ))}
            </ol>
          </Box>
        ))}
      </Box>
    </Page>
  );
}
export default teacherPaperView;
