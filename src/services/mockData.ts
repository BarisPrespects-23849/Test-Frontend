import { Task } from '../types/Task';
import { Channel } from '../types/Channel';
import { Post } from '../types/Post';
import { v4 as uuidv4 } from 'uuid';

// Mock tasks
export const mockTasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Create social media strategy',
    description: 'Develop a comprehensive social media strategy for Q2',
    status: 'unassigned',
    createdAt: new Date(),
    tags: ['strategy', 'planning']
  },
  {
    id: uuidv4(),
    title: 'Design new Instagram post templates',
    description: 'Create 5 new templates for Instagram posts',
    status: 'todo',
    assignee: 'Jane Doe',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    createdAt: new Date(),
    tags: ['design', 'instagram']
  },
  {
    id: uuidv4(),
    title: 'Write blog content for next week',
    description: "Prepare 3 blog posts for next week's schedule",
    status: 'in-progress',
    assignee: 'John Smith',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    createdAt: new Date(),
    tags: ['content', 'writing']
  },
  {
    id: uuidv4(),
    title: 'Review analytics from last campaign',
    description: 'Analyze performance metrics from the previous marketing campaign',
    status: 'done',
    assignee: 'Jane Doe',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    tags: ['analytics', 'review']
  }
];

// Mock channels
export const mockChannels: Channel[] = [
  {
    id: uuidv4(),
    name: 'Company Facebook Page',
    platform: 'facebook',
    connected: true,
    avatar: '/assets/icons/facebook.svg',
    stats: {
      followers: 5240,
      engagement: 3.2
    }
  },
  {
    id: uuidv4(),
    name: 'Company Instagram',
    platform: 'instagram',
    connected: true,
    avatar: '/assets/icons/instagram.svg',
    stats: {
      followers: 8750,
      engagement: 4.8
    }
  },
  {
    id: uuidv4(),
    name: 'Company Twitter',
    platform: 'twitter',
    connected: false,
    avatar: '/assets/icons/twitter.svg'
  }
];

// Mock posts
export const mockPosts: Post[] = [
  {
    id: uuidv4(),
    content: 'Excited to announce our new product launch! Stay tuned for more details. #newproduct #launch',
    media: ['/assets/images/post1.jpg'],
    channelIds: [mockChannels[0].id, mockChannels[1].id],
    scheduledFor: new Date(new Date().setDate(new Date().getDate() + 2)),
    status: 'scheduled',
    author: 'John Smith',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['product launch', 'announcement']
  },
  {
    id: uuidv4(),
    content: 'Check out our latest blog post on content marketing strategies for 2025!',
    channelIds: [mockChannels[0].id],
    status: 'draft',
    author: 'Jane Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['blog', 'content marketing']
  }
];
