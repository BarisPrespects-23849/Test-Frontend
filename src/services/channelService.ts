import { Channel, PlatformType } from '../types/Channel';
import { mockChannels } from './mockData';
import { v4 as uuidv4 } from 'uuid';

// Initial channels from mock data
let channels = [...mockChannels];

export const getChannels = (): Promise<Channel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...channels]);
    }, 500);
  });
};

export const getConnectedChannels = (): Promise<Channel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(channels.filter(channel => channel.connected));
    }, 500);
  });
};

export const connectChannel = (channelData: Omit<Channel, 'id'>): Promise<Channel> => {
  return new Promise((resolve) => {
    const newChannel: Channel = {
      ...channelData,
      id: uuidv4(),
      connected: true,
    };
    channels = [...channels, newChannel];
    setTimeout(() => {
      resolve(newChannel);
    }, 1000); // Longer delay to simulate OAuth flow
  });
};

export const disconnectChannel = (channelId: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const channelIndex = channels.findIndex(channel => channel.id === channelId);
    if (channelIndex === -1) {
      reject(new Error('Channel not found'));
      return;
    }
    
    const updatedChannel = { ...channels[channelIndex], connected: false };
    channels = [...channels.slice(0, channelIndex), updatedChannel, ...channels.slice(channelIndex + 1)];
    
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};
// Update channel bio link
export const updateChannelBioLink = async (channelId: string, bioLinkUrl: string): Promise<Channel> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const channelIndex = channels.findIndex(channel => channel.id === channelId);
      if (channelIndex === -1) {
        reject(new Error('Channel not found'));
        return;
      }
      
      const updatedChannel = { 
        ...channels[channelIndex], 
        bioLink: bioLinkUrl 
      };
      
      channels = [
        ...channels.slice(0, channelIndex),
        updatedChannel,
        ...channels.slice(channelIndex + 1)
      ];
      
      resolve({ ...updatedChannel });
    }, 500);
  });
};
