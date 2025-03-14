import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
// import CreatePage from './pages/CreatePage';
// import PublishPage from './pages/PublishPage';
// import AnalyzePage from './pages/AnalyzePage';
// import EngagePage from './pages/EngagePage';
// import StartPage from './pages/StartPage';
import CreatePage from './Pages/CreatePage';
import PublishPage from './Pages/PublishPage';
import AnalyzePage from './Pages/AnalyzePage';
import EngagePage from './Pages/EngagePage';
import StartPage from './Pages/StartPage';
import BioLinkPage from './components/features/links/BioLinkPage';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/publish" replace />} />
        <Route path="create" element={<CreatePage />} />
        <Route path="publish" element={<PublishPage />} />
        <Route path="channels/all" element={<PublishPage />} />
        <Route path="channels/facebook" element={<PublishPage />} />
        <Route path="channels/instagram" element={<PublishPage />} />
        <Route path="channels/twitter" element={<PublishPage />} />
        <Route path="analyze" element={<AnalyzePage />} />
        <Route path="engage" element={<EngagePage />} />
        <Route path="start-page" element={<StartPage />} />
        <Route path="manage-tags" element={<div>Manage Tags (Coming Soon)</div>} />
        <Route path="manage-channels" element={<div>Manage Channels (Coming Soon)</div>} />
        <Route path="*" element={<Navigate to="/publish" replace />} />
        <Route index element={<Navigate to="/publish" replace />} />
        <Route path="publish" element={<PublishPage />} />
        <Route path="analyze" element={<AnalyzePage />} />
        <Route path="links" element={<BioLinkPage />} />
        <Route path="*" element={<Navigate to="/publish" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
