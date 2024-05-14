import { m } from "framer-motion";
import * as React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useState } from "react";

// @mui
import { styled } from "@mui/material/styles";
import {
  Button,
  Typography,
  Container,
  Grid,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
// next
import Link from "next/link";
// components
import Page from "../../components/Page";
import { MotionContainer, varBounce } from "../../components/animate";
// firebase
import { collection, doc, setDoc } from "firebase/firestore";
import "firebase/firestore";
import { DB } from "src/config";
import { useRouter } from "next/router";

// ----------------------------------------------------------------------

const ContentStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

// createPaper.getLayout = function getLayout(page) {
//   return <Layout variant="logoOnly">{page}</Layout>;
// };

// ----------------------------------------------------------------------

export default function createPaper() {
  const router = useRouter();
  const validationSchema = yup.object({
    grade: yup.string().required("Please select grade"),
    subject: yup.string().required("Please select subject"),
    medium: yup.string().required("Please select medium"),
    paperTitle: yup.string().required("Please enter paper name"),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [paperId, setPaperId] = useState(null);
  const { push } = useRouter();

  const formik = useFormik({
    initialValues: {
      grade: "",
      subject: "",
      medium: "",
      chapter: "",
      paperTitle: "",
    },
    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);

      const paperRef = doc(collection(DB, "Paper")); //add , values.paperTitle for the paper title as document name
      const paperData = {
        grade: values.grade,
        subject: values.subject,
        medium: values.medium,
        paperTitle: values.paperTitle,
        chapter: values.chapter,
        uid: paperRef.id,
      };

      try {
        await setDoc(paperRef, paperData);
        const paperID = paperRef.id;
        console.log("Paper added to Firestore! ID:", paperID);

        push({
          pathname: "/Teacher/question-number-add",
          query: { paperId: paperID },
        });

        resetForm();
      } catch (error) {
        console.error("Error adding paper to Firestore: ", error);
      }

      setIsLoading(false);
    },
  });

  const handleBack = () => {
    router.back(); // Go back to the previous page
  };

  return (
    <Page title="Create Paper">
      <form onSubmit={formik.handleSubmit}>
        <Container component={MotionContainer}>
          <ContentStyle>
            <Grid container spacing={2}>
              <Link href="/Teacher/teacher-home">
                <IconButton>
                  <ArrowCircleLeftOutlinedIcon fontSize="large" />
                </IconButton>
              </Link>

              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <m.div variants={varBounce().in}>
                  <Typography variant="h2" paragraph>
                    Create a new paper
                  </Typography>
                </m.div>
              </Grid>
            </Grid>

            <Box
              sx={{
                bgcolor: "#D2D6D6",
                width: "100vh",
                borderRadius: "10px",
                padding: "50px",
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Grade</InputLabel>
                <Select
                  name="grade"
                  value={formik.values.grade}
                  label="Grade"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.grade && Boolean(formik.errors.grade)}
                  helperText={formik.touched.grade && formik.errors.grade}
                  sx={{ backgroundColor: "white" }}
                >
                  <MenuItem value="">
                    <em>Select Grade</em>
                  </MenuItem>
                  <MenuItem value="5">5</MenuItem>
                  <MenuItem value="6">6</MenuItem>
                  <MenuItem value="7">7</MenuItem>
                  <MenuItem value="8">8</MenuItem>
                  <MenuItem value="9">9</MenuItem>
                  <MenuItem value="10">10</MenuItem>
                  <MenuItem value="11">11</MenuItem>
                  <MenuItem value="12">12</MenuItem>
                  <MenuItem value="13">13</MenuItem>
                </Select>
              </FormControl>

              <br />
              <br />

              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select
                  name="subject"
                  value={formik.values.subject}
                  label="Subject"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.subject && Boolean(formik.errors.subject)
                  }
                  helperText={formik.touched.subject && formik.errors.subject}
                  sx={{ backgroundColor: "white" }}
                >
                  <MenuItem value="">
                    <em>Select Subject</em>
                  </MenuItem>
                  <MenuItem value={"Mathematics"}> Mathematics</MenuItem>
                  <MenuItem value={"Science"}> Science</MenuItem>
                  <MenuItem value={"History"}> History</MenuItem>
                  <MenuItem value={"Sinhala"}> Sinhala</MenuItem>
                  <MenuItem value={"Geography"}> Geography</MenuItem>
                  <MenuItem value={"Biology"}> Biology</MenuItem>
                  <MenuItem value={"CombinedMaths"}> Combined Maths</MenuItem>
                  <MenuItem value={"Physics"}> Physics</MenuItem>
                  <MenuItem value={"Chemistry"}> Chemistry</MenuItem>
                </Select>
              </FormControl>
              <br />
              <br />

              <FormControl fullWidth>
                <InputLabel>Medium</InputLabel>
                <Select
                  name="medium"
                  value={formik.values.medium}
                  label="Medium"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.medium && Boolean(formik.errors.medium)}
                  helperText={formik.touched.medium && formik.errors.medium}
                  sx={{ backgroundColor: "white" }}
                >
                  <MenuItem value="">
                    <em>Select Medium</em>
                  </MenuItem>
                  <MenuItem value={"Sinhala"}> Sinhala</MenuItem>
                  <MenuItem value={"English"}> English</MenuItem>
                  <MenuItem value={"Tamil"}> Tamil</MenuItem>
                </Select>
              </FormControl>
              <br />
              <br />

              <TextField
                fullWidth
                label="Paper Title"
                name="paperTitle"
                value={formik.values.paperTitle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.paperTitle && Boolean(formik.errors.paperTitle)
                }
                helperText={
                  formik.touched.paperTitle && formik.errors.paperTitle
                }
                sx={{ backgroundColor: "white" }}
              />
              <br />
              <br />

              <TextField
                fullWidth
                label="Chapter"
                name="chapter"
                value={formik.values.chapter}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.chapter && Boolean(formik.errors.chapter)}
                helperText={formik.touched.chapter && formik.errors.chapter}
                multiline
                maxRows={2}
                sx={{ backgroundColor: "white" }}
              />

              <Box sx={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  sx={{ padding: "5px 100px 5px 100px", marginTop: "70px" }}
                >
                  {" "}
                  Next
                </Button>
              </Box>
            </Box>
          </ContentStyle>
        </Container>
      </form>
    </Page>
  );
}
