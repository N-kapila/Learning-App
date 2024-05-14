import * as Yup from "yup";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
// form
import { Form, FormikProvider, useFormik } from "formik";

// @mui
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Alert,
  Typography,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";
// hooks
import useAuth from "../../../hooks/useAuth";
// components
import Iconify from "../../../components/Iconify";

// firebase
import { DB } from "../../../config";
import { doc, getDoc } from "firebase/firestore";

// ----------------------------------------------------------------------

const StudentRegisterForm = () => {
  const { studentRegister } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const StudentRegisterSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(4, "Minimum 4 characters"),
    firstName: Yup.string().required("First name required"),
    lastName: Yup.string().required("Last name required"),
    birthDay: Yup.string().required("Birthday required"),
    grade: Yup.string().required("Grade required"),
    address: Yup.string().required("Address required"),
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Minimum 6 characters"),
    rePassword: Yup.string()
      .required("Confirm password is required")
      .min(6, "Minimum 6 characters"),
  });

  const initialValues = {
    username: "",
    firstName: "",
    lastName: "",
    birthDay: "",
    grade: "",
    address: "",
    email: "",
    password: "",
    rePassword: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: StudentRegisterSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (values.password != values.rePassword) {
        setErrorMessage({ message: "Password does not match" });
        return;
      }

      const userRef = doc(DB, "users", values.username);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setErrorMessage({ message: "User name exists" });
        return;
      }
      try {
        await studentRegister(
          values.username,
          values.email,
          values.password,
          values.firstName,
          values.lastName,
          values.birthDay,
          values.grade,
          values.address
        );

        setSubmitting(false);
        resetForm();
        enqueueSnackbar("User registered successfully", { variant: "success" });
        router.push("/auth/user-login");
      } catch (error) {
        setErrorMessage(error.message);
        setSubmitting(false);
      }
    },
  });
  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    isValid,
  } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errorMessage && (
            <Alert severity="error">{errorMessage.message}</Alert>
          )}
          <Typography variant="h3" sx={{ mt: 6, mb: 2 }}>
            Student Registration
          </Typography>
          <TextField
            fullWidth
            name="username"
            label="Username"
            {...getFieldProps("username")}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              name="firstName"
              label="First Name"
              {...getFieldProps("firstName")}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />
            <TextField
              fullWidth
              name="lastName"
              label="Last Name"
              {...getFieldProps("lastName")}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>

          <TextField
            fullWidth
            name="address"
            label="Address"
            {...getFieldProps("address")}
            error={Boolean(touched.address && errors.address)}
            helperText={touched.address && errors.address}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              name="birthDay"
              label="Birthday"
              {...getFieldProps("birthDay")}
              error={Boolean(touched.birthDay && errors.birthDay)}
              helperText={touched.birthDay && errors.birthDay}
            />
            <TextField
              fullWidth
              name="grade"
              label="Grade"
              {...getFieldProps("grade")}
              error={Boolean(touched.grade && errors.grade)}
              helperText={touched.grade && errors.grade}
            />
          </Stack>

          <TextField
            fullWidth
            name="email"
            label="Email"
            {...getFieldProps("email")}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Iconify
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...getFieldProps("password")}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <TextField
            name="reEnterPassword"
            label="Re-enter Password"
            type={showRePassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowRePassword(!showRePassword)}
                  >
                    <Iconify
                      icon={
                        showRePassword ? "eva:eye-fill" : "eva:eye-off-fill"
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...getFieldProps("rePassword")}
            error={Boolean(touched.rePassword && errors.rePassword)}
            helperText={touched.rePassword && errors.rePassword}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
          >
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
};

export default StudentRegisterForm;
