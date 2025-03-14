export type PlatformType = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'pinterest';

export interface Channel {
  id: string;
  name: string;
  platform: PlatformType;
  connected: boolean;
  avatar?: string;
  bioLink?: string; // Add this line for bio link URL
  stats?: {
    followers: number;
    engagement: number;
  };
}
