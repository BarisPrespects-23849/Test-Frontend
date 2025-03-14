import React from 'react';
import { Box, Typography, Container, Paper, Divider } from '@mui/material';
import TaskBoard from '../components/features/create/TaskBoard';
import { TaskProvider } from '../context/TaskContext';

const CreatePage: React.FC = () => {
  return (
    <TaskProvider>
      <Container maxWidth="xl">
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Content Creation Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Plan, create, and manage your content across all platforms. Organize tasks by status to streamline your workflow.
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mt: 3 }}>
            <TaskBoard />
          </Box>
        </Paper>
      </Container>
    </TaskProvider>
  );
};

export default CreatePage;
