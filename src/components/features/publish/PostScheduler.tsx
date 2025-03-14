import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent  // Import this type
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays, addWeeks, addMonths, format, setHours, setMinutes } from 'date-fns';

interface PostSchedulerProps {
  onSchedule: (scheduleDate: Date) => void;
  defaultDate?: Date;
  onCancel: () => void;
}

const PostScheduler: React.FC<PostSchedulerProps> = ({
  onSchedule,
  defaultDate,
  onCancel
}) => {
  const now = new Date();
  const [scheduleDate, setScheduleDate] = useState<Date>(defaultDate || now);
  const [scheduleTime, setScheduleTime] = useState<Date>(defaultDate || now);
  const [preset, setPreset] = useState('custom');

  // Update the event type here to use SelectChangeEvent
  const handlePresetChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setPreset(value);
    
    let newDate = new Date();
    
    switch (value) {
      case 'tomorrow':
        newDate = addDays(now, 1);
        break;
      case 'nextWeek':
        newDate = addWeeks(now, 1);
        break;
      case 'nextMonth':
        newDate = addMonths(now, 1);
        break;
      default:
        break;
    }
    
    setScheduleDate(newDate);
    
    // Keep the existing time for presets
    newDate = setHours(newDate, scheduleTime.getHours());
    newDate = setMinutes(newDate, scheduleTime.getMinutes());
    setScheduleTime(newDate);
  };

  const handleSubmit = () => {
    // Combine date and time
    const finalDate = new Date(
      scheduleDate.getFullYear(),
      scheduleDate.getMonth(),
      scheduleDate.getDate(),
      scheduleTime.getHours(),
      scheduleTime.getMinutes()
    );
    
    onSchedule(finalDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Schedule Your Post
        </Typography>
        
        <Box mb={3}>
          <FormControl fullWidth>
            <InputLabel id="schedule-preset-label">Preset Options</InputLabel>
            <Select
              labelId="schedule-preset-label"
              value={preset}
              onChange={handlePresetChange}
              label="Preset Options"
            >
              <MenuItem value="custom">Custom Date & Time</MenuItem>
              <MenuItem value="tomorrow">Tomorrow</MenuItem>
              <MenuItem value="nextWeek">Next Week</MenuItem>
              <MenuItem value="nextMonth">Next Month</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Date"
              value={scheduleDate}
              onChange={(newDate) => {
                if (newDate) {
                  setScheduleDate(newDate);
                  setPreset('custom');
                }
              }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TimePicker
              label="Time"
              value={scheduleTime}
              onChange={(newTime) => {
                if (newTime) {
                  setScheduleTime(newTime);
                  setPreset('custom');
                }
              }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
        </Grid>
        
        <Typography variant="body2" gutterBottom color="text.secondary">
          Your post will be published on {format(scheduleDate, 'EEEE, MMMM dd, yyyy')} at {format(scheduleTime, 'h:mm a')}
        </Typography>
        
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button onClick={onCancel} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSubmit}
          >
            Schedule
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default PostScheduler;
