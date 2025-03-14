import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post, PostStatus } from '../types/Post';
import * as postService from '../services/postService';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface PostContextProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  getPostsByStatus: (status: PostStatus) => Post[];
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Post>;
  updatePost: (postId: string, updates: Partial<Post>) => Promise<Post>;
  deletePost: (postId: string) => Promise<boolean>;
  schedulePost: (postId: string, scheduledFor: Date) => Promise<Post>;
  getPostById: (postId: string) => Post | undefined;
}

const PostContext = createContext<PostContextProps | undefined>(undefined);

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useLocalStorage<Post[]>('v0-posts', []);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPostsByStatus = (status: PostStatus): Post[] => {
    return posts.filter(post => post.status === status);
  };

  const getPostById = (postId: string): Post | undefined => {
    return posts.find(post => post.id === postId);
  };

  const createPost = async (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newPost = await postService.createPost(post);
      setPosts([...posts, newPost]);
      return newPost;
    } catch (err) {
      setError('Failed to create post');
      console.error(err);
      throw err;
    }
  };

  const updatePost = async (postId: string, updates: Partial<Post>) => {
    try {
      const updatedPost = await postService.updatePost(postId, updates);
      setPosts(posts.map(post => post.id === postId ? updatedPost : post));
      return updatedPost;
    } catch (err) {
      setError('Failed to update post');
      console.error(err);
      throw err;
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const success = await postService.deletePost(postId);
      if (success) {
        setPosts(posts.filter(post => post.id !== postId));
      }
      return success;
    } catch (err) {
      setError('Failed to delete post');
      console.error(err);
      throw err;
    }
  };

  const schedulePost = async (postId: string, scheduledFor: Date) => {
    try {
      const scheduledPost = await postService.schedulePost(postId, scheduledFor);
      setPosts(posts.map(post => post.id === postId ? scheduledPost : post));
      return scheduledPost;
    } catch (err) {
      setError('Failed to schedule post');
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        error,
        fetchPosts,
        getPostsByStatus,
        createPost,
        updatePost,
        deletePost,
        schedulePost,
        getPostById
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
};
