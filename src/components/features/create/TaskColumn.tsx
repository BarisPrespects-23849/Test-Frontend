import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Droppable, Draggable } from 'react-beautiful-dnd';
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
  return (
    <Box sx={{ minWidth: 280, maxWidth: 350, mx: 1 }}>
      <Paper
        sx={{
          p: 2,
          height: '100%',
          bgcolor: 'background.default',
          borderRadius: 2
        }}
        elevation={0}
        variant="outlined"
      >
        <Typography
          variant="subtitle1"
          component="h3"
          fontWeight="bold"
          sx={{ mb: 2, px: 1 }}
        >
          {title} ({tasks.length})
        </Typography>
        
        <Droppable droppableId={id}>
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ minHeight: 500 }}
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard
                        task={task}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                      />
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </Paper>
    </Box>
  );
};

export default TaskColumn;
