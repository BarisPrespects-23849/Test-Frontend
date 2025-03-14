import React, { useState } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Add as AddIcon } from '@mui/icons-material';
import TaskColumn from './TaskColumn';
import { useTaskContext } from '../../../context/TaskContext';
import Modal from '../../common/Modal';
import TaskForm from './TaskForm';
import { Task, TaskStatus } from '../../../types/Task';

const TaskBoard: React.FC = () => {
  const { tasks, moveTask, updateTask, deleteTask } = useTaskContext();
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setOpenTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setOpenTaskModal(true);
  };

  const handleCloseModal = () => {
    setOpenTaskModal(false);
    setEditingTask(null);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Move the task to the new status
    // Cast the string to TaskStatus type
    moveTask(draggableId, destination.droppableId as TaskStatus);
  };

  // Group tasks by status
  const tasksByStatus = {
    unassigned: tasks.filter(task => task.status === 'unassigned'),
    todo: tasks.filter(task => task.status === 'todo'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    done: tasks.filter(task => task.status === 'done')
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" component="h1">
          Task Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
        >
          Add Task
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Box 
          sx={{ 
            display: 'flex', 
            overflowX: 'auto', 
            pb: 2,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#a8a8a8',
            }
          }}
        >
          <TaskColumn
            id="unassigned"
            title="Unassigned"
            tasks={tasksByStatus.unassigned}
            onEditTask={handleEditTask}
            onDeleteTask={deleteTask}
          />
          <TaskColumn
            id="todo"
            title="To Do"
            tasks={tasksByStatus.todo}
            onEditTask={handleEditTask}
            onDeleteTask={deleteTask}
          />
          <TaskColumn
            id="in-progress"
            title="In Progress"
            tasks={tasksByStatus['in-progress']}
            onEditTask={handleEditTask}
            onDeleteTask={deleteTask}
          />
          <TaskColumn
            id="done"
            title="Done"
            tasks={tasksByStatus.done}
            onEditTask={handleEditTask}
            onDeleteTask={deleteTask}
          />
        </Box>
      </DragDropContext>

      <Modal
        open={openTaskModal}
        onClose={handleCloseModal}
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        <TaskForm 
          onClose={handleCloseModal} 
          editTask={editingTask}
        />
      </Modal>
    </Box>
  );
};

export default TaskBoard;
