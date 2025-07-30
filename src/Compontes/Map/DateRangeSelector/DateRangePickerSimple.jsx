import React, { useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function DateRangePickerSimple({ onRangeChange }) {
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs());

  const handleStartChange = (newValue) => {
    setStartDate(newValue);
    if (onRangeChange && newValue && endDate) {
      onRangeChange(
        newValue.format("YYYY-MM-DD"),
        endDate.format("YYYY-MM-DD")
      );
    }
  };

  const handleEndChange = (newValue) => {
    setEndDate(newValue);
    if (onRangeChange && startDate && newValue) {
      onRangeChange(
        startDate.format("YYYY-MM-DD"),
        newValue.format("YYYY-MM-DD")
      );
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          maxWidth: 500,
          margin: "auto",
          mt: 1,
          p: 1,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#f1f1f1",
        }}
      >
        <Typography variant="h6" mb={2} textAlign="center">
          Select Date Range
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <DatePicker
            label="From"
            value={startDate}
            onChange={handleStartChange}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <DatePicker
            label="To"
            value={endDate}
            onChange={handleEndChange}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Box>

        {/* <Typography mt={3} textAlign="center">
          من: <strong>{startDate.format('YYYY-MM-DD')}</strong> &nbsp; إلى: <strong>{endDate.format('YYYY-MM-DD')}</strong>
        </Typography> */}
      </Box>
    </LocalizationProvider>
  );
}
