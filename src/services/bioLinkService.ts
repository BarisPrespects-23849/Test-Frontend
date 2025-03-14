import { v4 as uuidv4 } from 'uuid';
import { BioLink, BioLinkPage } from '../types/BioLink';

// Local storage key
const STORAGE_KEY = 'v0-biolinks';

// Get stored pages or initialize empty array
const getStoredPages = (): BioLinkPage[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading bio link pages from storage:', error);
    return [];
  }
};

// Save pages to storage
const savePages = (pages: BioLinkPage[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  } catch (error) {
    console.error('Error saving bio link pages to storage:', error);
  }
};

// Mock data
let bioLinkPages: BioLinkPage[] = getStoredPages();

// Initialize with a default page if none exists
if (bioLinkPages.length === 0) {
  const defaultPage: BioLinkPage = {
    id: uuidv4(),
    title: 'My Links',
    description: 'Check out my social media and content',
    links: [],
    slug: 'my-links',
    theme: 'light',
    userId: 'default-user',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  bioLinkPages.push(defaultPage);
  savePages(bioLinkPages);
}

// Get all bio link pages
export const getBioLinkPages = (): Promise<BioLinkPage[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...bioLinkPages]);
    }, 300);
  });
};

// Get bio link page by ID
export const getBioLinkPageById = (id: string): Promise<BioLinkPage | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const page = bioLinkPages.find(p => p.id === id) || null;
      resolve(page ? { ...page } : null);
    }, 300);
  });
};

// Get bio link page by slug
export const getBioLinkPageBySlug = (slug: string): Promise<BioLinkPage | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const page = bioLinkPages.find(p => p.slug === slug) || null;
      resolve(page ? { ...page } : null);
    }, 300);
  });
};

// Create new bio link page
export const createBioLinkPage = (page: Omit<BioLinkPage, 'id' | 'createdAt' | 'updatedAt'>): Promise<BioLinkPage> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPage: BioLinkPage = {
        ...page,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      bioLinkPages.push(newPage);
      savePages(bioLinkPages);
      resolve({ ...newPage });
    }, 300);
  });
};

// Update bio link page
export const updateBioLinkPage = (id: string, updates: Partial<BioLinkPage>): Promise<BioLinkPage> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = bioLinkPages.findIndex(p => p.id === id);
      if (index === -1) {
        reject(new Error('Bio link page not found'));
        return;
      }
      
      const updatedPage: BioLinkPage = {
        ...bioLinkPages[index],
        ...updates,
        updatedAt: new Date()
      };
      
      bioLinkPages = [
        ...bioLinkPages.slice(0, index),
        updatedPage,
        ...bioLinkPages.slice(index + 1)
      ];
      
      savePages(bioLinkPages);
      resolve({ ...updatedPage });
    }, 300);
  });
};

// Delete bio link page
export const deleteBioLinkPage = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      bioLinkPages = bioLinkPages.filter(p => p.id !== id);
      savePages(bioLinkPages);
      resolve(true);
    }, 300);
  });
};

// Add link to page
export const addLinkToPage = (pageId: string, link: Omit<BioLink, 'id'>): Promise<BioLink> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const pageIndex = bioLinkPages.findIndex(p => p.id === pageId);
      if (pageIndex === -1) {
        reject(new Error('Bio link page not found'));
        return;
      }
      
      const newLink: BioLink = {
        ...link,
        id: uuidv4()
      };
      
      const updatedPage = {
        ...bioLinkPages[pageIndex],
        links: [...bioLinkPages[pageIndex].links, newLink],
        updatedAt: new Date()
      };
      
      bioLinkPages = [
        ...bioLinkPages.slice(0, pageIndex),
        updatedPage,
        ...bioLinkPages.slice(pageIndex + 1)
      ];
      
      savePages(bioLinkPages);
      resolve({ ...newLink });
    }, 300);
  });
};

// Update link
export const updateLink = (pageId: string, linkId: string, updates: Partial<BioLink>): Promise<BioLink> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const pageIndex = bioLinkPages.findIndex(p => p.id === pageId);
      if (pageIndex === -1) {
        reject(new Error('Bio link page not found'));
        return;
      }
      
      const linkIndex = bioLinkPages[pageIndex].links.findIndex(l => l.id === linkId);
      if (linkIndex === -1) {
        reject(new Error('Link not found'));
        return;
      }
      
      const updatedLink: BioLink = {
        ...bioLinkPages[pageIndex].links[linkIndex],
        ...updates
      };
      
      const updatedLinks = [
        ...bioLinkPages[pageIndex].links.slice(0, linkIndex),
        updatedLink,
        ...bioLinkPages[pageIndex].links.slice(linkIndex + 1)
      ];
      
      const updatedPage = {
        ...bioLinkPages[pageIndex],
        links: updatedLinks,
        updatedAt: new Date()
      };
      
      bioLinkPages = [
        ...bioLinkPages.slice(0, pageIndex),
        updatedPage,
        ...bioLinkPages.slice(pageIndex + 1)
      ];
      
      savePages(bioLinkPages);
      resolve({ ...updatedLink });
    }, 300);
  });
};

// Delete link
export const deleteLink = (pageId: string, linkId: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const pageIndex = bioLinkPages.findIndex(p => p.id === pageId);
      if (pageIndex === -1) {
        reject(new Error('Bio link page not found'));
        return;
      }
      
      const updatedPage = {
        ...bioLinkPages[pageIndex],
        links: bioLinkPages[pageIndex].links.filter(l => l.id !== linkId),
        updatedAt: new Date()
      };
      
      bioLinkPages = [
        ...bioLinkPages.slice(0, pageIndex),
        updatedPage,
        ...bioLinkPages.slice(pageIndex + 1)
      ];
      
      savePages(bioLinkPages);
      resolve(true);
    }, 300);
  });
};
