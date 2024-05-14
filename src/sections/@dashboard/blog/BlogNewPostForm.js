import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
// next
import { useRouter } from "next/router";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/material/styles";
import {
  Grid,
  Card,
  Chip,
  Stack,
  Button,
  TextField,
  Typography,
  Autocomplete,
  MenuItem,
} from "@mui/material";
// firebase
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
// routes
//components
import {
  RHFSwitch,
  RHFEditor,
  FormProvider,
  RHFTextField,
  RHFSelect,
} from "../../../components/hook-form";
//

import { DB } from "../../../config";
import Markdown from "src/components/Markdown";
import NewQuestionPreview from "./NewQuestionPreview";
const MEDIUM_OPTIONS = ["Sinhala", "Tamil", "English"];

// ----------------------------------------------------------------------

const TAGS_OPTION = [
  "Toy Story 3",
  "Logan",
  "Full Metal Jacket",
  "Dangal",
  "The Sting",
  "2001: A Space Odyssey",
  "Singin' in the Rain",
  "Toy Story",
  "Bicycle Thieves",
  "The Kid",
  "Inglourious Basterds",
  "Snatch",
  "3 Idiots",
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

export default function BlogNewPostForm() {
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [answerList, setAnswerList] = useState([]);
  const [answer, setAnswer] = useState("");
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const NewQuestionSchema = Yup.object().shape({
    question: Yup.string().required("Question is required"),
    explainedAnswer: Yup.string(),
    correctAnswer: Yup.number().required("Correct answer is required"),
    grade: Yup.string().required("Grade is required"),
    subject: Yup.string().required("Subject is required"),
    chapter: Yup.string().required("Chapter is required"),
    medium: Yup.string(),
  });

  const defaultValues = {
    question: "",
    explainedAnswer: "",
    correctAnswer: "",
    grade: "",
    subject: "",
    chapter: "",
    medium: MEDIUM_OPTIONS[0],
    tags: ["Logan"],
    publish: true,
    comments: true,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: ["Logan"],
  };

  const methods = useForm({
    resolver: yupResolver(NewQuestionSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  const handleOpenPreview = () => {
    setOpen(true);
  };

  const handleClosePreview = () => {
    setOpen(false);
  };

  const getGrades = async () => {
    const gradesSnapshot = await getDocs(collection(DB, "grades"));
    const gradeResults = gradesSnapshot.docs.map((doc) => doc.data().title);
    setGrades(gradeResults);
  };

  const getSubjects = async () => {
    const gradeNumber = values.grade.split(" ")[1];
    console.log(gradeNumber);
    // const subjectsSnapshot = await getDocs(
    //   collection(DB, "grades/1", "title")
    // );
    // console.log(subjectsSnapshot.docs.map((doc) => doc.data()));
    // const subjectResults = subjectsSnapshot.docs.map((doc) => doc.data());
    // console.log(subjectResults);
    // setSubjects(subjectResults);
  };

  useEffect(() => {
    getGrades();
    getSubjects();
  }, []);

  useEffect(() => {
    getSubjects();
  }, [values.grade]);

  const onSubmit = async (data) => {
    if (answerList.length === 0) {
      enqueueSnackbar("Please add at least one answer", { variant: "error" });
      return;
    }

    try {
      const blogRef = doc(collection(DB, "questions"));
      await setDoc(blogRef, {
        question: data.question,
        answerList: answerList,
        correctAnswer: data.correctAnswer,
        explainedAnswer: data.explainedAnswer,
        grade: data.grade,
        subject: data.subject,
        chapter: data.chapter,
        medium: data.medium.toUpperCase(),
        tags: data.tags,
        publish: data.publish,
        comments: data.comments,
        metaTitle: data.metaTitle,
        metaDescription: data.metaKeywords,
        metaKeywords: data.metaKeywords,
      });
      reset();
      setAnswerList([]);
      enqueueSnackbar("New question added", { variant: "success" });
      handleClosePreview();
      // push(PATH_DASHBOARD.blog.posts);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnChangeAnswer = (value) => {
    setAnswer(value);
  };

  const handleOnAddAnswerToAnswerList = () => {
    setAnswerList([...answerList, answer]);
    setAnswer("");
  };

  const renderAnswerList = () => {
    if (answerList.length === 0) {
      return (
        <Typography sx={{ color: "#FF4842", fontSize: "0.75rem" }}>
          There are no answers entered yet.
        </Typography>
      );
    }
    return answerList.map((answer, index) => {
      return (
        <Stack direction="row" spacing={1} key={index}>
          <span>
            <b>{index + 1}</b>.
          </span>
          <Markdown key={index} children={answer} />
        </Stack>
      );
    });
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <div>
                  <LabelStyle>Question</LabelStyle>
                  <RHFEditor
                    simple
                    name="question"
                    placeholder="Write your question..."
                    superAndSub={true}
                    multiFormats={true}
                    color={true}
                    list={true}
                    directions={true}
                  />
                </div>

                <div>
                  <LabelStyle>Answers</LabelStyle>
                  <Stack sx={{ marginY: 3 }}>{renderAnswerList()}</Stack>
                  <RHFEditor
                    simple
                    name="answerList"
                    placeholder="Write your question..."
                    value={answer}
                    onChange={handleOnChangeAnswer}
                    superAndSub={true}
                    multiFormats={true}
                    color={true}
                    list={true}
                    directions={true}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                    onClick={handleOnAddAnswerToAnswerList}
                  >
                    Add Answer
                  </Button>
                </div>

                <LabelStyle>Correct answer</LabelStyle>
                <RHFTextField
                  name={"correctAnswer"}
                  label={"Correct Answer"}
                  fullWidth
                  type={"number"}
                />

                <div>
                  <LabelStyle>Explain answer</LabelStyle>
                  <RHFEditor
                    simple
                    name="explainedAnswer"
                    placeholder="Explain your question..."
                    superAndSub={true}
                    multiFormats={true}
                    color={true}
                    list={true}
                    directions={true}
                  />
                </div>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, marginBottom: 3 }}>
              <Stack spacing={3}>
                <RHFSelect
                  name="grade"
                  label="Grade"
                  fullWidth
                  size="large"
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{
                    native: false,
                    sx: { textTransform: "capitalize" },
                  }}
                >
                  {grades.map((grade, index) => (
                    <MenuItem key={index} value={grade}>
                      {grade}
                    </MenuItem>
                  ))}
                </RHFSelect>

                <RHFSelect
                  name="subject"
                  label="Subject"
                  fullWidth
                  size="large"
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{
                    native: false,
                    sx: { textTransform: "capitalize" },
                  }}
                >
                  {grades.map((grade, index) => (
                    <MenuItem key={index} value={grade}>
                      {grade}
                    </MenuItem>
                  ))}
                </RHFSelect>

                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={subjects}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="Movie" />
                  )}
                />

                <RHFTextField name="chapter" label="Chapter" />

                <RHFSelect
                  name="medium"
                  label="Medium"
                  fullWidth
                  size="large"
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{
                    native: false,
                    sx: { textTransform: "capitalize" },
                  }}
                >
                  {MEDIUM_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <div>
                  <RHFSwitch
                    name="publish"
                    label="Publish"
                    labelPlacement="start"
                    sx={{
                      mb: 1,
                      mx: 0,
                      width: 1,
                      justifyContent: "space-between",
                    }}
                  />

                  <RHFSwitch
                    name="comments"
                    label="Enable comments"
                    labelPlacement="start"
                    sx={{ mx: 0, width: 1, justifyContent: "space-between" }}
                  />
                </div>

                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      freeSolo
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={TAGS_OPTION.map((option) => option)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option}
                            size="small"
                            label={option}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField label="Tags" {...params} />
                      )}
                    />
                  )}
                />

                <RHFTextField name="metaTitle" label="Meta title" />

                <RHFTextField
                  name="metaDescription"
                  label="Meta description"
                  fullWidth
                  multiline
                  rows={3}
                />

                <Controller
                  name="metaKeywords"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      freeSolo
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={TAGS_OPTION.map((option) => option)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option}
                            size="small"
                            label={option}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField label="Meta keywords" {...params} />
                      )}
                    />
                  )}
                />
              </Stack>
            </Card>

            <Stack
              direction="row"
              spacing={4}
              sx={{ mt: 3, position: "fixed", bottom: 30, right: 30 }}
            >
              <Button
                fullWidth
                color="inherit"
                variant="contained"
                size="large"
                sx={{ width: 150 }}
                onClick={handleOpenPreview}
              >
                Preview
              </Button>
              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ width: 150 }}
                loading={isSubmitting}
              >
                Submit
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>

      <NewQuestionPreview
        values={values}
        answerList={answerList}
        isOpen={open}
        isValid={isValid}
        isSubmitting={isSubmitting}
        onClose={handleClosePreview}
        onSubmit={handleSubmit(onSubmit)}
      />
    </>
  );
}
