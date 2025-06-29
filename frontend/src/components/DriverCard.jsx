import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const DriverCard = ({ driver }) => {
  const { givenName, familyName, nationality, dateOfBirth } = driver;

  return (
    <Card sx={{ marginTop: 2 }}>
      <CardContent>
        <Typography variant="h6">{`${givenName} ${familyName}`}</Typography>
        <Typography variant="body2">Nacionalidade: {nationality}</Typography>
        <Typography variant="body2">Nascimento: {dateOfBirth}</Typography>
      </CardContent>
    </Card>
  );
};

export default DriverCard;
