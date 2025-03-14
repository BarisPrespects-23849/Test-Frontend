import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Launch as LaunchIcon,
  ArrowForward as ArrowForwardIcon,
  Link as LinkIcon,
  Person as PersonIcon,
  Share as ShareIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

const StartPage: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Start Page
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Create a customizable landing page to house all your important links in one place.
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Start Page
              </Typography>
              <Typography variant="body2" paragraph>
                Share all your content with a single link. Your Start Page updates automatically when you post new content.
              </Typography>
              
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mr: 1 }}>
                      your-brand.v0.page
                    </Typography>
                    <Chip label="Not Published" size="small" />
                  </Box>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Profile details"
                        secondary="Name, bio, profile picture"
                      />
                      <Button size="small">Edit</Button>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LinkIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Links"
                        secondary="0 custom links added"
                      />
                      <Button size="small">Add</Button>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DescriptionIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Content"
                        secondary="Automatically display your latest posts"
                      />
                      <Button size="small">Configure</Button>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ShareIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Appearance"
                        secondary="Colors, fonts, and layout"
                      />
                      <Button size="small">Customize</Button>
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button startIcon={<LaunchIcon />} size="small">
                    Preview
                  </Button>
                  <Button variant="contained" color="primary" endIcon={<ArrowForwardIcon />}>
                    Publish Page
                  </Button>
                </CardActions>
              </Card>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Why use a Start Page?
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="One link for all your content"
                    secondary="Share a single link across all social platforms"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Automatic updates"
                    secondary="Your page updates with new content as you post"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Custom branding"
                    secondary="Match the look and feel of your brand"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Analytics & insights"
                    secondary="Track visitors and engagement on your page"
                  />
                </ListItem>
              </List>
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Pro Tip
                </Typography>
                <Typography variant="body2">
                  Use your Start Page link in your Instagram bio, Twitter profile, and other places where you're limited to a single link.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default StartPage;
