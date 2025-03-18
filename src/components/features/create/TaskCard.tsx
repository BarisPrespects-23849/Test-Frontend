import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  CardActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Task } from '../../../types/Task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  // Format the due date with both date and time
  const formatDueDateTime = (date: Date) => {
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  };

  // Different background colors based on task status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unassigned':
        return '#f5f5f5';
      case 'todo':
        return '#e3f2fd';
      case 'in-progress':
        return '#fff8e1';
      case 'done':
        return '#e8f5e9';
      default:
        return '#ffffff';
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        backgroundColor: getStatusColor(task.status),
        '&:hover': {
          boxShadow: 3
        },
        transition: 'box-shadow 0.3s ease-in-out'
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {task.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {task.description}
        </Typography>
        
        {task.assignee && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Assigned to: {task.assignee}
            </Typography>
          </Box>
        )}
        
        {task.dueDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Due: {formatDueDateTime(task.dueDate)}
            </Typography>
          </Box>
        )}
        
        {task.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
            {task.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(0,0,0,0.08)',
                  fontSize: '0.7rem',
                  height: 24
                }}
              />
            ))}
          </Box>
        )}
      </CardContent>
      
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', pt: 0 }}>
        <Tooltip title="Edit">
          <IconButton 
            size="small" 
            onClick={() => onEdit(task)}
            sx={{ color: 'primary.main' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton 
            size="small" 
            onClick={() => onDelete(task.id)}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default TaskCard;
