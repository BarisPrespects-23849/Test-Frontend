import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useBioLinkContext } from '../context/BioLinkContext';
import LinkManager from '../components/features/links/LinkManager';
import BioPageSettings from '../components/features/links/BioPageSettings';
import ChannelBioLink from '../components/features/links/ChannelBioLink';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const BioLinksPage: React.FC = () => {
  const { pages, activePage, createPage, setActivePage } = useBioLinkContext();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreatePage = async () => {
    try {
      await createPage({
        title: 'My Links',
        description: 'Check out my social media and content',
        links: [],
        slug: `my-links-${Date.now()}`,
        theme: 'light',
        userId: 'default-user'
      });
    } catch (err) {
      console.error('Failed to create page:', err);
    }
  };

  const handlePageChange = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (page) {
      setActivePage(page);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5">Bio Links</Typography>
          
          {pages.length > 0 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreatePage}
            >
              Create New Page
            </Button>
          )}
        </Box>
        
        {pages.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No Bio Link Pages Found
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Create your first bio link page to share all your important links in one place.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreatePage}
            >
              Create Bio Link Page
            </Button>
          </Paper>
        ) : (
          <Box>
            {pages.length > 1 && (
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Select Page
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {pages.map(page => (
                    <Button
                      key={page.id}
                      variant={page.id === activePage?.id ? 'contained' : 'outlined'}
                      onClick={() => handlePageChange(page.id)}
                      size="small"
                    >
                      {page.title}
                    </Button>
                  ))}
                </Box>
              </Paper>
            )}
            
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="bio link tabs">
                  <Tab label="Links" {...a11yProps(0)} />
                  <Tab label="Settings" {...a11yProps(1)} />
                  <Tab label="Connect" {...a11yProps(2)} />
                </Tabs>
              </Box>
              
              <TabPanel value={tabValue} index={0}>
                <LinkManager />
                
                <Paper sx={{ p: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Preview
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      component="a"
                      href={`/bio/${activePage?.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Your Bio Link Page
                    </Button>
                  </Box>
                </Paper>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <BioPageSettings />
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <ChannelBioLink />
              </TabPanel>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default BioLinksPage;
