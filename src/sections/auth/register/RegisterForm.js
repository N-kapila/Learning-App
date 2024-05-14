import { useState } from "react";
// @mui
import {
  Stack,
  Select,
  MenuItem,
  Typography,
  Button,
  Link,
} from "@mui/material";

// firebase
import StudentRegisterForm from "./StudentRegisterForm";
import TeacherRegisterForm from "./TeacherRegisterForm";

// role
const ROLES_OPTIONS = ["Teacher", "Student"];

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(ROLES_OPTIONS[1]);

  const renderRegisterForm = () => {
    if (role === ROLES_OPTIONS[1]) {
      // Student form
      setStep(1);
    } else {
      setStep(2); // Teacher form
    }
  };

  const handleOnRoleChange = (event) => {
    setRole(event.target.value);
  };

  switch (step) {
    case 0:
      return (
        <Stack direction="column">
          <Typography sx={{ marginBottom: 2 }}>Select Role</Typography>
          <Select
            labelId="role-select-label"
            id="role-select"
            value={role}
            label=""
            fullWidth
            onChange={handleOnRoleChange}
          >
            {ROLES_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            sx={{ marginTop: 2 }}
            onClick={renderRegisterForm}
          >
            Next
          </Button>
        </Stack>
      );
    case 1:
      return <StudentRegisterForm />;
    case 2:
      return <TeacherRegisterForm />;
  }
}
