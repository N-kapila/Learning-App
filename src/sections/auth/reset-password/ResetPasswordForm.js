import * as Yup from "yup";
import { useSnackbar } from "notistack";
// next
import { useRouter } from "next/router";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// routes
import { PATH_AUTH } from "../../../routes/paths";
// components
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

// ----------------------------------------------------------------------

export default function ResetPasswordForm() {
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
  });
  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, data.email);

      // Password reset email sent successfully
      enqueueSnackbar(
        "Password reset email sent successfully, check your Emails",
        { variant: "success" }
      );
      // push(PATH_AUTH.newPassword);
    } catch (error) {
      setError("email", { type: "manual", message: error.message });
      console.error(error);
      // Handle any errors that occur during password reset
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email address" />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Send Request
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
