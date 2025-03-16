import { useState, useEffect } from "react";
import axios from "axios";
import { ScheduleResponse } from "../../types/Api";

const BASE_URL = `inflow-schedulers.onrender.com/fb`

export const useAuthorizationUrl = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await axios.get<{ data: string }>("/fb/auth/url");
        setUrl(response.data.data);
      } catch (err) {
        setError("Failed to fetch authorization URL");
      } finally {
        setLoading(false);
      }
    };

    fetchUrl();
  }, []);

  return { url, loading, error };
};


export const useAccessToken=async(exchange_code:string)=>{
    const [token, setToken] = useState<object | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    try {
        setLoading(true)
        const response = await axios.post("/fb/auth/access-token", { exchange_code });
        setToken(response.data);
      } catch (err) {
        throw new Error("Failed to generate long-lived token");
      }finally{
        setLoading(false)
      }

      return {token, loading}
}



  export const useFacebookScheduler = () => {
    const [post, setPost] = useState<ScheduleResponse>({ data: null, error: null, loading: false });
    const [reel, setReel] = useState<ScheduleResponse>({ data: null, error: null, loading: false });
    const [story, setStory] = useState<ScheduleResponse>({ data: null, error: null, loading: false });
    
    const schedulePost = async (
      page_access_token: string,
      page_id: string,
      message: string,
      scheduled_time?: string,
      media?: File
    ) => {
      setPost({ ...post, loading: true, error: null });
      try {
        const formData = new FormData();
        formData.append("page_access_token", page_access_token);
        formData.append("page_id", page_id);
        formData.append("message", message);
        if (scheduled_time) formData.append("scheduled_time", scheduled_time);
        if (media) formData.append("file", media);
  
        const response = await axios.post(`${BASE_URL}/schedule-post`, formData);
        setPost({ data: response.data.post_id, error: null, loading: false });
      } catch (err: any) {
        setPost({ data: null, error: err.response?.data?.error || "Failed to schedule post", loading: false });
      }
    };
  
    const scheduleReel = async (
      page_access_token: string,
      page_id: string,
      description: string,
      video: File
    ) => {
      setReel({ ...reel, loading: true, error: null });
      try {
        const formData = new FormData();
        formData.append("page_access_token", page_access_token);
        formData.append("page_id", page_id);
        formData.append("description", description);
        formData.append("file", video);
  
        const response = await axios.post(`${BASE_URL}/schedule-reel`, formData);
        setReel({ data: response.data.reel_id, error: null, loading: false });
      } catch (err: any) {
        setReel({ data: null, error: err.response?.data?.error || "Failed to schedule reel", loading: false });
      }
    };
  
    const postStory = async (
      page_access_token: string,
      page_id: string,
      media: File
    ) => {
      setStory({ ...story, loading: true, error: null });
      try {
        const formData = new FormData();
        formData.append("page_access_token", page_access_token);
        formData.append("page_id", page_id);
        formData.append("file", media);
  
        const response = await axios.post(`${BASE_URL}/post-story`, formData);
        setStory({ data: response.data.story_id, error: null, loading: false });
      } catch (err: any) {
        setStory({ data: null, error: err.response?.data?.error || "Failed to post story", loading: false });
      }
    };
  
    return { schedulePost, scheduleReel, postStory, post, reel, story };
  };
  
  export const useFacebookPages = () => {
    const getFacebookPages = async (accessToken: string) => {
      if (!accessToken) {
        throw new Error("Access token is required.");
      }
      try {
        const response = await axios.get(`${BASE_URL}/pages`, {
          params: { access_token: accessToken },
        });
        return { data: response.data.data };
      } catch (error: any) {
        throw error.response?.data || "Internal Server Error";
      }
    };
  
    const getPagePosts = async (pageId: string, pageAccessToken: string) => {
      if (!pageId || !pageAccessToken) {
        throw new Error("Page ID and Access Token are required.");
      }
      try {
        const response = await axios.get(`${BASE_URL}/posts`, {
          params: {
            fields: "id,message,created_time,permalink_url,full_picture,attachments,status",
            access_token: pageAccessToken,
          },
        });
        return { data: response.data };
      } catch (error: any) {
        throw error.response?.data || "Failed to fetch page posts";
      }
    };
  
    const getReels = async (pageId: string, pageAccessToken: string) => {
      if (!pageId || !pageAccessToken) {
        throw new Error("Page ID and Access Token are required.");
      }
      try {
        const response = await axios.get(`${BASE_URL}/reels`, {
          params: {
            access_token: pageAccessToken,
            fields: "id,media_type,thumbnail_url,permalink,status",
          },
        });
        return { data: response.data };
      } catch (error: any) {
        throw error.response?.data || "Internal Server Error";
      }
    };
  
    const getPageEvents = async (pageId: string, pageAccessToken: string) => {
      try {
        const response = await axios.get(`${BASE_URL}/events`, {
          params: {
            access_token: pageAccessToken,
            fields: "id,name,description,start_time,end_time,place,cover",
          },
        });
        return { data: response.data.data };
      } catch (error: any) {
        throw error.response?.data || "Failed to fetch events";
      }
    };
  
    const getPostInsights = async (postId: string, pageAccessToken: string) => {
      if (!postId) {
        throw new Error("Post ID is required.");
      }
      try {
        const response = await axios.get(`${BASE_URL}/post-insights`, {
          params: {
            access_token: pageAccessToken,
            metric: [
              "post_impressions",
              "post_clicks",
              "post_engagements",
              "post_video_avg_time_watched",
            ].join(","),
          },
        });
        return { data: response.data };
      } catch (error: any) {
        throw error.response?.data || "Internal Server Error";
      }
    };
  
    const deletePost = async (postId: string, pageAccessToken: string) => {
      if (!postId || !pageAccessToken) {
        throw new Error("Post ID and Access Token are required.");
      }
      try {
        const response = await axios.post(`${BASE_URL}/delete-post`, {
          params: { access_token: pageAccessToken },
        });
        return { data: response.data };
      } catch (error: any) {
        throw error.response?.data || "Internal Server Error";
      }
    };

    const getPageInsights = async (pageId:string, pageAccessToken:string, datePreset?:string)=>{
        if (!pageId || !pageAccessToken) {
            throw new Error("Post ID and Access Token are required.");
          }
          try {
            const response = await axios.get(`${BASE_URL}/insights`, {
              params: { access_token: pageAccessToken },
            });
            return { data: response.data };
          } catch (error: any) {
            throw error.response?.data || "Internal Server Error";
          } 
    }
  
    return {
      getFacebookPages,
      getPagePosts,
      getReels,
      getPageEvents,
      getPostInsights,
      deletePost,
      getPageInsights
    };
  };

  