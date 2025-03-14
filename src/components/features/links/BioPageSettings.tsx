import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import { useBioLinkContext } from '../../../context/BioLinkContext';
import { Settings as SettingsIcon } from '@mui/icons-material';

const BioPageSettings: React.FC = () => {
  const { activePage, updatePage } = useBioLinkContext();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formValues, setFormValues] = useState({
    title: activePage?.title || '',
    description: activePage?.description || '',
    slug: activePage?.slug || '',
    theme: activePage?.theme || 'light'
  });

  if (!activePage) {
    return null;
  }

  // Separate handlers for text inputs and select inputs
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name as string]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formValues.title || !formValues.slug) {
      setError('Title and URL slug are required');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      await updatePage(activePage.id, {
        title: formValues.title,
        description: formValues.description,
        slug: formValues.slug,
        theme: formValues.theme as 'light' | 'dark' | 'custom'
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update page settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pageUrl = `${window.location.origin}/bio/${formValues.slug}`;

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">Bio Page Settings</Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Customize your bio link page appearance and settings.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Page settings updated successfully!
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Page Title"
          name="title"
          value={formValues.title}
          onChange={handleTextChange}
          margin="normal"
          required
        />
        
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formValues.description}
          onChange={handleTextChange}
          margin="normal"
          multiline
          rows={2}
        />
        
        <TextField
          fullWidth
          label="URL Slug"
          name="slug"
          value={formValues.slug}
          onChange={handleTextChange}
          margin="normal"
          required
          helperText={`Your page will be available at: ${pageUrl}`}
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Theme</InputLabel>
          <Select
            name="theme"
            value={formValues.theme}
            label="Theme"
            onChange={handleSelectChange}
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </Select>
        </FormControl>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2">
            Share your bio link: <strong>{pageUrl}</strong>
          </Typography>
          
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Settings'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default BioPageSettings;
