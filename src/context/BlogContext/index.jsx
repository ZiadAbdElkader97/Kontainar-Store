import { createContext, useState, useEffect } from 'react';

import React from 'react';
import useSWR, { mutate as swrMutate } from 'swr';
import { getFetcher } from 'src/api/globalFetcher';

// Create context with default values
export const BlogContext = createContext({
  posts: [],
  sortBy: 'newest',
  selectedPost: null,
  isLoading: true,
  error: null,
  // Actions
  setPosts: () => {},
  setSortBy: () => {},
  setSelectedPost: () => {},
  setLoading: () => {},
  addComment: () => {},
  refresh: () => Promise.resolve(),
});

// BlogProvider component
export const BlogProvider = ({ children, includeDeleted = false }) => {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // مفتاح SWR يتغير حسب includeDeleted
  const key = includeDeleted
    ? '/api/data/blog/BlogPosts?includeDeleted=true'
    : '/api/data/blog/BlogPosts';

  // Fetch Post data from the API
  const { data: postsData, isLoading: isPostsLoading, error: postsError } = useSWR(key, getFetcher);

  useEffect(() => {
    setLoading(isPostsLoading);
    if (postsData?.data) {
      setPosts(postsData.data);
      setError(null);
    } else if (postsError) {
      setError(postsError);
    }
  }, [postsData, postsError, isPostsLoading]);

  // إضافة تعليق محليًا
  const addComment = (postId, newComment) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, comments: [newComment, ...(post.comments || [])] } : post,
      ),
    );
  };

  // إعادة تحميل من الـ API (SWR revalidate)
  const refresh = async () => {
    await swrMutate(key);
  };

  const value = {
    posts,
    sortBy,
    selectedPost,
    isLoading,
    error,
    setPosts,
    setSortBy,
    setSelectedPost,
    setLoading,
    addComment,
    refresh,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};


