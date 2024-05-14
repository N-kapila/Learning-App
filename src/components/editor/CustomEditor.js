import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from 'react-hook-form';
// next
import dynamic from "next/dynamic";
// @mui
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
//
import EditorToolbar, { formats } from "./EditorToolbar";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: "absolute",
        bgcolor: "background.paper",
      }}
    >
      Loading...
    </Box>
  ),
});

// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`,
  "& .ql-container.ql-snow": {
    borderColor: "transparent",
    ...theme.typography.body1,
    fontFamily: theme.typography.fontFamily,
  },
  "& .ql-editor": {
    minHeight: 200,
    maxHeight: 640,
    "&.ql-blank::before": {
      fontStyle: "normal",
      color: theme.palette.text.disabled,
    },
    "& pre.ql-syntax": {
      ...theme.typography.body2,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[900],
    },
  },
}));

// ----------------------------------------------------------------------

CustomEditor.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.node,
  simple: PropTypes.bool,
  sx: PropTypes.object,
  placeholder: PropTypes.string,
  list: PropTypes.bool,
  superAndSub: PropTypes.bool,
  directions: PropTypes.bool,
  multiFormats: PropTypes.bool,
  indent: PropTypes.bool,
};

export default function CustomEditor({
  id = "minimal-quill",
  name,
  error,
  value,
  onChange,
  simple = false,
  helperText,
  sx,
  placeholder,
  list,
  superAndSub,
  directions,
  multiFormats,
  indent,
  ...other
}) {
  const modules = {
    toolbar: {
      container: `#${id}`,
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    syntax: true,
    clipboard: {
      matchVisual: false,
    },
  };

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <RootStyle
            sx={{
              ...(error && {
                border: (theme) => `solid 1px ${theme.palette.error.main}`,
              }),
              ...sx,
            }}
          >
            <EditorToolbar
              id={id}
              isSimple={simple}
              list={list}
              directions={directions}
              multiFormats={multiFormats}
              superAndSub={superAndSub}
              indent={indent}
            />
            <ReactQuill
              value={value}
              onChange={onChange}
              modules={modules}
              formats={formats}
              placeholder={placeholder}
              {...other}
            />
          </RootStyle>

          {helperText && helperText}
        </>
      )}
    />
  );
}
