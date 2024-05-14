import * as Yup from "yup";
import { m } from "framer-motion";
import { useState } from "react";
import { useSnackbar } from "notistack";
// next
import { useRouter } from "next/router";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/material/styles";
import { Box, Stack, Button, Typography, Container } from "@mui/material";
// firebase
import { collection, doc, setDoc } from "firebase/firestore";
// routes
//components
import Page from "../../components/Page";
import {
  RHFEditor,
  FormProvider,
  RHFTextField,
} from "src/components/hook-form";
//
import { MotionContainer, varBounce } from "../../components/animate";
import { DB } from "src/config";
import Markdown from "src/components/Markdown";
import NewQuestionPreview from "src/sections/@dashboard/blog/NewQuestionPreview";

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

export default function createNewQuestion() {
  const { query } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [answerList, setAnswerList] = useState([]);
  const [answer, setAnswer] = useState("");
  const { paperId } = query;
  const router = useRouter();

  const NewQuestionSchema = Yup.object().shape({
    question: Yup.string().required("Question is required"),
    explainedAnswer: Yup.string(),
    correctAnswer: Yup.number().required("Correct answer is required"),
    questionNumber: Yup.number().required("Question number is required"),
  });

  const defaultValues = {
    question: "",
    explainedAnswer: "",
    correctAnswer: "",
    questionNumber: "",
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

  const onSubmit = async (values) => {
    if (answerList.length === 0) {
      enqueueSnackbar("Please add at least one answer", { variant: "error" });
      return;
    }

    try {
      const blogRef = doc(collection(DB, "Questions"));
      await setDoc(blogRef, {
        questionNumber: parseInt(values.questionNumber),
        question: values.question.replace(/<[^>]+>/g, ""),
        answerList: answerList.map((answer) => answer.replace(/<[^>]+>/g, "")),
        correctAnswer: values.correctAnswer,
        explainedAnswer: values.explainedAnswer.replace(/<[^>]+>/g, ""),
        paperId: paperId,
      });

      console.log("question added");
      reset();
      setAnswerList([]);
      enqueueSnackbar("New question added", { variant: "success" });
      handleClosePreview();

      // Redirect to the question number add page after saving the question
      router.push({
        pathname: "/Teacher/question-number-add",
        query: {
          paperId: paperId,
          questionNumber: values.questionNumber,
          question: values.question,
          answerList: answerList,
          correctAnswer: values.correctAnswer,
          explainedAnswer: values.explainedAnswer,
        },
      });
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
    <Page title="Create Questions">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Container fixed component={MotionContainer}>
          <Box sx={{ textAlign: "center" }}>
            <m.div variants={varBounce().in}>
              <Typography variant="h2" paragraph>
                Create a new question
              </Typography>
            </m.div>
          </Box>

          <Stack spacing={3} sx={{ paddingBottom: "150px" }}>
            <Box>
              <LabelStyle>Question Number</LabelStyle>
              <RHFTextField
                label="Question Number"
                fullWidth
                name="questionNumber"
                type="number"
              />
            </Box>
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
                placeholder="Write your answers...(Add your answers one by one)"
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

            <h2>Correct answer</h2>
            <RHFTextField
              name={"correctAnswer"}
              label={"Correct Answer"}
              fullWidth
              //type={"number"}
            />

            <div>
              <LabelStyle>Explain answers</LabelStyle>
              <RHFEditor
                simple
                name="explainedAnswer"
                placeholder="Explaination.."
                superAndSub={true}
                multiFormats={true}
                color={true}
                list={true}
                directions={true}
              />
            </div>
          </Stack>

          <Stack
            direction="row"
            spacing={4}
            sx={{ padding: "20px", position: "fixed", bottom: 30, right: 50 }}
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
        </Container>
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
    </Page>
  );
}
