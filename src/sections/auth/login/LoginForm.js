import * as Yup from "yup";
import { useState } from "react";
// next
import NextLink from "next/link";
import { useRouter } from "next/router";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// routes
import { PATH_AUTH } from "../../../routes/paths";
// hooks
import useAuth from "../../../hooks/useAuth";
import useIsMountedRef from "../../../hooks/useIsMountedRef";
// components
import Iconify from "../../../components/Iconify";
import {
  FormProvider,
  RHFTextField,
  RHFCheckbox,
} from "../../../components/hook-form";
// firebase
import { AUTH, DB } from "../../../config";
import { doc, getDoc } from "firebase/firestore";
import { collection, getDocs, where, query } from "firebase/firestore";

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // const defaultValues = {
  //   email: "shpsachitha@gmail.com",
  //   password: "12345678",
  //   remember: true,
  // };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    // defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);

      const user = AUTH.currentUser;

      if (user) {
        const querySnapshot = query(
          collection(DB, "users"),
          where("uid", "==", user.uid)
        );
        const data = await getDocs(querySnapshot);
        const { role, username } = data.docs[0].data();

        if (role === "STUDENT") {
          router.push("/Student/grades-home").then(() => {
            // Any additional logic after redirection
          });
        } else if (role === "TEACHER") {
          router.push("/Teacher/teacher-home").then(() => {
            // Any additional logic after redirection
          });
        }
      }
    } catch (error) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError("afterSubmit", { ...error, message: error.message });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}></Stack>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}
        <Alert severity="info">
          Use email : <strong>teacher1@gmail.com</strong> / password :
          <strong> Teacher1</strong>
        </Alert>{" "}
        <Alert severity="info" sx={{ mb: 5 }}>
          Use email : <strong>student1@gmail.com</strong> / password :
          <strong> Student1</strong>
        </Alert>
        <RHFTextField name="email" label="Email addresss" />
        {/*  Teacher login credentials= teacher1@gmail.com/ Teacher1 */}
        {/*  Student login credentials=  student1@gmail.com/ Student1 */}
        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 2 }}
      >
        <RHFCheckbox name="remember" label="Remember me" />
        <NextLink href={PATH_AUTH.resetPassword} passHref>
          <Link variant="subtitle2">Forgot password?</Link>
        </NextLink>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>
    </FormProvider>
  );
}
