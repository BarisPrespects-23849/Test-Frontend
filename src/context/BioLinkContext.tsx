import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BioLink, BioLinkPage } from '../types/BioLink';
import * as bioLinkService from '../services/bioLinkService';

interface BioLinkContextProps {
  pages: BioLinkPage[];
  activePage: BioLinkPage | null;
  loading: boolean;
  error: string | null;
  fetchPages: () => Promise<void>;
  fetchPageById: (id: string) => Promise<BioLinkPage | null>;
  createPage: (page: Omit<BioLinkPage, 'id' | 'createdAt' | 'updatedAt'>) => Promise<BioLinkPage>;
  updatePage: (id: string, updates: Partial<BioLinkPage>) => Promise<BioLinkPage>;
  deletePage: (id: string) => Promise<boolean>;
  addLink: (pageId: string, link: Omit<BioLink, 'id'>) => Promise<BioLink>;
  updateLink: (pageId: string, linkId: string, updates: Partial<BioLink>) => Promise<BioLink>;
  deleteLink: (pageId: string, linkId: string) => Promise<boolean>;
  setActivePage: (page: BioLinkPage | null) => void;
}

const BioLinkContext = createContext<BioLinkContextProps | undefined>(undefined);

export const BioLinkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<BioLinkPage[]>([]);
  const [activePage, setActivePage] = useState<BioLinkPage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const data = await bioLinkService.getBioLinkPages();
      setPages(data);
      
      // Set first page as active if no active page
      if (!activePage && data.length > 0) {
        setActivePage(data[0]);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch bio link pages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageById = async (id: string) => {
    try {
      setLoading(true);
      const page = await bioLinkService.getBioLinkPageById(id);
      if (page) {
        setActivePage(page);
      }
      setError(null);
      return page;
    } catch (err) {
      setError('Failed to fetch bio link page');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createPage = async (page: Omit<BioLinkPage, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newPage = await bioLinkService.createBioLinkPage(page);
      setPages([...pages, newPage]);
      setActivePage(newPage);
      return newPage;
    } catch (err) {
      setError('Failed to create bio link page');
      console.error(err);
      throw err;
    }
  };

  const updatePage = async (id: string, updates: Partial<BioLinkPage>) => {
    try {
      const updatedPage = await bioLinkService.updateBioLinkPage(id, updates);
      setPages(pages.map(page => page.id === id ? updatedPage : page));
      
      if (activePage && activePage.id === id) {
        setActivePage(updatedPage);
      }
      
      return updatedPage;
    } catch (err) {
      setError('Failed to update bio link page');
      console.error(err);
      throw err;
    }
  };

  const deletePage = async (id: string) => {
    try {
      const success = await bioLinkService.deleteBioLinkPage(id);
      if (success) {
        setPages(pages.filter(page => page.id !== id));
        
        if (activePage && activePage.id === id) {
          setActivePage(pages.length > 0 ? pages[0] : null);
        }
      }
      return success;
    } catch (err) {
      setError('Failed to delete bio link page');
      console.error(err);
      throw err;
    }
  };

  const addLink = async (pageId: string, link: Omit<BioLink, 'id'>) => {
    try {
      const newLink = await bioLinkService.addLinkToPage(pageId, link);
      
      // Refresh the page to get updated links
      const updatedPage = await bioLinkService.getBioLinkPageById(pageId);
      if (updatedPage) {
        setPages(pages.map(page => page.id === pageId ? updatedPage : page));
        
        if (activePage && activePage.id === pageId) {
          setActivePage(updatedPage);
        }
      }
      
      return newLink;
    } catch (err) {
      setError('Failed to add link');
      console.error(err);
      throw err;
    }
  };

  const updateLinkFn = async (pageId: string, linkId: string, updates: Partial<BioLink>) => {
    try {
      const updatedLink = await bioLinkService.updateLink(pageId, linkId, updates);
      
      // Refresh the page to get updated links
      const updatedPage = await bioLinkService.getBioLinkPageById(pageId);
      if (updatedPage) {
        setPages(pages.map(page => page.id === pageId ? updatedPage : page));
        
        if (activePage && activePage.id === pageId) {
          setActivePage(updatedPage);
        }
      }
      
      return updatedLink;
    } catch (err) {
      setError('Failed to update link');
      console.error(err);
      throw err;
    }
  };

  const deleteLink = async (pageId: string, linkId: string) => {
    try {
      const success = await bioLinkService.deleteLink(pageId, linkId);
      
      if (success) {
        // Refresh the page to get updated links
        const updatedPage = await bioLinkService.getBioLinkPageById(pageId);
        if (updatedPage) {
          setPages(pages.map(page => page.id === pageId ? updatedPage : page));
          
          if (activePage && activePage.id === pageId) {
            setActivePage(updatedPage);
          }
        }
      }
      
      return success;
    } catch (err) {
      setError('Failed to delete link');
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <BioLinkContext.Provider
      value={{
        pages,
        activePage,
        loading,
        error,
        fetchPages,
        fetchPageById,
        createPage,
        updatePage,
        deletePage,
        addLink,
        updateLink: updateLinkFn,
        deleteLink,
        setActivePage
      }}
    >
      {children}
    </BioLinkContext.Provider>
  );
};

export const useBioLinkContext = () => {
  const context = useContext(BioLinkContext);
  if (context === undefined) {
    throw new Error('useBioLinkContext must be used within a BioLinkProvider');
  }
  return context;
};
