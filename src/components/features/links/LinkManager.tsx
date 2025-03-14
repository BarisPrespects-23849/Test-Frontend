import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  Divider,
  Switch,
  FormControlLabel,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { BioLink } from '../../../types/BioLink';
import { useBioLinkContext } from '../../../context/BioLinkContext';

const LinkManager: React.FC = () => {
  const { activePage, addLink, updateLink, deleteLink, updatePage } = useBioLinkContext();
  const [newLink, setNewLink] = useState({ title: '', url: '', order: 0, enabled: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  if (!activePage) {
    return (
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h6">No active bio link page</Typography>
      </Box>
    );
  }

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) {
      setError('Both title and URL are required');
      return;
    }

    let url = newLink.url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    setIsSaving(true);
    setError('');

    try {
      await addLink(activePage.id, {
        ...newLink,
        url,
        order: activePage.links.length,
      });
      setNewLink({ title: '', url: '', order: 0, enabled: true });
    } catch (err) {
      setError('Failed to add link');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await deleteLink(activePage.id, linkId);
    } catch (err) {
      setError('Failed to delete link');
      console.error(err);
    }
  };

  const handleToggleLink = async (linkId: string, enabled: boolean) => {
    try {
      await updateLink(activePage.id, linkId, { enabled });
    } catch (err) {
      setError('Failed to update link');
      console.error(err);
    }
  };

  const handleEditLink = (linkId: string) => {
    setEditingId(linkId);
  };

  const handleUpdateLink = async (link: BioLink) => {
    try {
      await updateLink(activePage.id, link.id, link);
      setEditingId(null);
    } catch (err) {
      setError('Failed to update link');
      console.error(err);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(activePage.links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order numbers
    const reorderedLinks = items.map((item, index) => ({
      ...item,
      order: index
    }));
    
    try {
      await updatePage(activePage.id, { links: reorderedLinks });
    } catch (err) {
      setError('Failed to reorder links');
      console.error(err);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LinkIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">Manage Links</Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Add and organize links for your bio. Drag to reorder links.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Link Title"
          value={newLink.title}
          onChange={(e) => setNewLink({...newLink, title: e.target.value})}
          sx={{ mr: 1, mb: 1 }}
          size="small"
          fullWidth
        />
        <TextField
          label="URL"
          value={newLink.url}
          onChange={(e) => setNewLink({...newLink, url: e.target.value})}
          sx={{ mr: 1, my: 1 }}
          size="small"
          fullWidth
          placeholder="https://example.com"
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddLink}
          disabled={isSaving || !newLink.title || !newLink.url}
          sx={{ mt: 1 }}
        >
          {isSaving ? <CircularProgress size={24} /> : 'Add Link'}
        </Button>
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Box>
      
      <Typography variant="subtitle1" gutterBottom>
        Your Links
      </Typography>
      
      {activePage.links.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
          No links added yet. Add your first link above.
        </Typography>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links">
            {(provided) => (
              <List
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{ bgcolor: 'background.paper' }}
              >
                {activePage.links.map((link, index) => (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(provided) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Box {...provided.dragHandleProps} sx={{ mr: 1 }}>
                          <DragIndicatorIcon color="action" />
                        </Box>
                        
                        {editingId === link.id ? (
                          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                            <TextField
                              value={link.title}
                              onChange={(e) => handleUpdateLink({...link, title: e.target.value})}
                              size="small"
                              sx={{ mr: 1, flexGrow: 1 }}
                              label="Title"
                            />
                            <TextField
                              value={link.url}
                              onChange={(e) => handleUpdateLink({...link, url: e.target.value})}
                              size="small"
                              sx={{ mr: 1, flexGrow: 2 }}
                              label="URL"
                            />
                            <IconButton onClick={() => setEditingId(null)} color="primary">
                              <SaveIcon />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1">{link.title}</Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {link.url}
                            </Typography>
                          </Box>
                        )}
                        
                        <FormControlLabel
                          control={
                            <Switch
                              checked={link.enabled}
                              onChange={(e) => handleToggleLink(link.id, e.target.checked)}
                              size="small"
                            />
                          }
                          label=""
                        />
                        
                        <IconButton onClick={() => handleEditLink(link.id)}>
                          <EditIcon />
                        </IconButton>
                        
                        <IconButton onClick={() => handleDeleteLink(link.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Paper>
  );
};

export default LinkManager;
