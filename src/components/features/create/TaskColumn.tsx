import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { Task } from '../../../types/Task';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  id,
  title,
  tasks,
  onEditTask,
  onDeleteTask
}) => {
  // Get column color based on title
  const getColumnColor = () => {
    switch (id) {
      case 'unassigned':
        return '#F2F4F7';
      case 'todo':
        return '#EFF8FF';
      case 'in-progress':
        return '#FFF6ED';
      case 'done':
        return '#ECFDF3';
      default:
        return '#F2F4F7';
    }
  };

  // Sort tasks by due date (if exists)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <Box sx={{ 
      minWidth: 280, 
      maxWidth: 280, 
      mx: 1, 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 1, 
          mb: 2, 
          borderRadius: 2,
          backgroundColor: getColumnColor()
        }}
      >
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          {title}
          <Typography 
            component="span" 
            sx={{ 
              fontWeight: 500, 
              fontSize: '0.85rem',
              color: 'text.secondary', 
              ml: 1, 
              bgcolor: 'background.paper', 
              px: 1, 
              py: 0.25, 
              borderRadius: 1 
            }}
          >
            {tasks.length}
          </Typography>
        </Typography>
      </Paper>
      
      <Droppable droppableId={id}>
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ 
              flexGrow: 1,
              minHeight: 200,
              p: 1,
              backgroundColor: 'rgba(0,0,0,0.02)', 
              borderRadius: 2,
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)' 
              }
            }}
          >
            {sortedTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  fontStyle: 'italic' 
                }}
              >
                Drop tasks here
              </Typography>
            )}
          </Box>
        )}
      </Droppable>
    </Box>
  );
};

export default TaskColumn;
