import PropTypes from "prop-types";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  DialogActions,
} from "@mui/material";
// components
import Markdown from "../../../components/Markdown";
import Scrollbar from "../../../components/Scrollbar";
import EmptyContent from "../../../components/EmptyContent";
import { DialogAnimate } from "../../../components/animate";

// ----------------------------------------------------------------------

NewQuestionPreview.propTypes = {
  values: PropTypes.object,
  isValid: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default function NewQuestionPreview({
  values,
  answerList,
  isValid,
  isSubmitting,
  isOpen,
  onClose,
  onSubmit,
}) {
  const { question, explainedAnswer, correctAnswer, questionNumber } = values;

  const hasContent = answerList.length > 0 || !!question || !!explainedAnswer;

  const hasHero = question;

  const renderAnswerList = () => {
    if (answerList.length === 0) {
      return (
        <Typography sx={{ color: "gray" }}>
          There are no answers entered yet.{" "}
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

  const handleOnSubmit = (e) => {
    e.preventDefault();
    onClose();
    onSubmit();
  };
  return (
    <DialogAnimate fullScreen open={isOpen} onClose={onClose}>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          Preview Question
        </Typography>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={handleOnSubmit}
        >
          Submit
        </LoadingButton>
      </DialogActions>

      {hasContent ? (
        <Scrollbar>
          <Typography variant="subtitle2" sx={{ mt: 5, mb: 1, mx: 5 }}>
            Question Number : {questionNumber}
          </Typography>

          <Box sx={{ margin: 5 }}>
            {hasHero ? (
              <Markdown children={question} />
            ) : (
              <Typography sx={{ color: "gray" }}>
                There is no question entered yet.
              </Typography>
            )}
          </Box>

          <Container>
            <Box sx={{ mt: 5, mb: 10 }}>{renderAnswerList()}</Box>
          </Container>
          <Typography variant="subtitle2" sx={{ mt: 5, mb: 1, mx: 5 }}>
            Correct Answer : {correctAnswer}
          </Typography>
          <Box sx={{ marginX: 5 }}>
            <Typography variant="subtitle2" sx={{}}>
              Explained Answer
            </Typography>
            <Markdown children={explainedAnswer} />
          </Box>
        </Scrollbar>
      ) : (
        <EmptyContent title="Empty content" />
      )}
    </DialogAnimate>
  );
}
