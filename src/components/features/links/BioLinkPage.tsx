import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
  List,
  ListItem,
  Avatar,
  Divider
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import * as bioLinkService from '../../../services/bioLinkService';
import { BioLinkPage as BioLinkPageType } from '../../../types/BioLink';

const BioLinkPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<BioLinkPageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        if (!slug) {
          setError('Page not found');
          setLoading(false);
          return;
        }

        const pageData = await bioLinkService.getBioLinkPageBySlug(slug);
        if (pageData) {
          setPage(pageData);
        } else {
          setError('Page not found');
        }
      } catch (err) {
        setError('Failed to load page');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !page) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: 'background.default'
      }}>
        <Typography variant="h5" gutterBottom>
          {error || 'Page not found'}
        </Typography>
        <Button component={Link} to="/" variant="contained">
          Go Home
        </Button>
      </Box>
    );
  }

  // Sort links by order
  const sortedLinks = [...page.links]
    .filter(link => link.enabled)
    .sort((a, b) => a.order - b.order);

  const bgColor = page.theme === 'dark' ? '#121212' : page.theme === 'custom' ? page.backgroundColor || '#ffffff' : '#ffffff';
  const textColor = page.theme === 'dark' ? '#ffffff' : '#000000';

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: bgColor,
      color: textColor,
      py: 6
    }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{ 
              width: 100, 
              height: 100, 
              margin: '0 auto', 
              mb: 2,
              bgcolor: 'primary.main'
            }}
          >
            {page.title.charAt(0)}
          </Avatar>
          
          <Typography variant="h4" gutterBottom>
            {page.title}
          </Typography>
          
          {page.description && (
            <Typography variant="body1" color="text.secondary" paragraph>
              {page.description}
            </Typography>
          )}
        </Box>
        
        <List sx={{ width: '100%' }}>
          {sortedLinks.map((link) => (
            <ListItem key={link.id} sx={{ px: 0, py: 1 }}>
              <Button
                component="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                fullWidth
                variant="outlined"
                sx={{
                  py: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  borderColor: page.theme === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                  color: textColor,
                  '&:hover': {
                    borderColor: page.theme === 'dark' ? '#ffffff' : '#000000',
                    bgcolor: page.theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                {link.title}
              </Button>
            </ListItem>
          ))}
        </List>
        
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Created with Inflow Chat
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default BioLinkPage;
