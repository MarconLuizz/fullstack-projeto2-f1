import React, { useContext } from "react";
import { F1Context } from "../contexts/F1Context";
import { Alert } from "@mui/material";

const ErrorMessage = () => {
  const { state } = useContext(F1Context);

  return state.error ? (
    <Alert severity="error" sx={{ mb: 2 }}>
      {state.error}
    </Alert>
  ) : null;
};

export default ErrorMessage;
