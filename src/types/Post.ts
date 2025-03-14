export type PostStatus = 'draft' | 'scheduled' | 'pending-approval' | 'sent' | 'failed';

export interface Post {
  id: string;
  content: string;
  media?: string[];
  channelIds: string[];
  scheduledFor?: Date;
  status: PostStatus;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}
