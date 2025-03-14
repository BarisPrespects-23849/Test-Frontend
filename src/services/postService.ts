import { Post, PostStatus } from '../types/Post';
import { mockPosts } from './mockData';
import { v4 as uuidv4 } from 'uuid';

// Initial posts from mock data
let posts = [...mockPosts];

export const getPosts = (): Promise<Post[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...posts]);
    }, 500);
  });
};

export const getPostsByStatus = (status: PostStatus): Promise<Post[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(posts.filter(post => post.status === status));
    }, 500);
  });
};

export const createPost = (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> => {
  return new Promise((resolve) => {
    const now = new Date();
    const newPost: Post = {
      ...post,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    posts = [...posts, newPost];
    setTimeout(() => {
      resolve(newPost);
    }, 500);
  });
};

export const updatePost = (postId: string, updates: Partial<Post>): Promise<Post> => {
  return new Promise((resolve, reject) => {
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex === -1) {
      reject(new Error('Post not found'));
      return;
    }
    
    const updatedPost = { ...posts[postIndex], ...updates, updatedAt: new Date() };
    posts = [...posts.slice(0, postIndex), updatedPost, ...posts.slice(postIndex + 1)];
    
    setTimeout(() => {
      resolve(updatedPost);
    }, 500);
  });
};

export const deletePost = (postId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    posts = posts.filter(post => post.id !== postId);
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

export const schedulePost = (postId: string, scheduledFor: Date): Promise<Post> => {
  return updatePost(postId, { status: 'scheduled', scheduledFor });
};
