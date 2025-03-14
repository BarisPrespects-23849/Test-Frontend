import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Channel, PlatformType } from '../types/Channel';
import * as channelService from '../services/channelService';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ChannelContextProps {
  channels: Channel[];
  connectedChannels: Channel[];
  loading: boolean;
  error: string | null;
  fetchChannels: () => Promise<void>;
  connectChannel: (channel: Omit<Channel, 'id'>) => Promise<Channel>;
  disconnectChannel: (channelId: string) => Promise<boolean>;
  getChannelById: (channelId: string) => Channel | undefined;
}

const ChannelContext = createContext<ChannelContextProps | undefined>(undefined);

export const ChannelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [channels, setChannels] = useLocalStorage<Channel[]>('v0-channels', []);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const data = await channelService.getChannels();
      setChannels(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch channels');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const connectChannel = async (channelData: Omit<Channel, 'id'>) => {
    try {
      const newChannel = await channelService.connectChannel(channelData);
      setChannels([...channels, newChannel]);
      return newChannel;
    } catch (err) {
      setError('Failed to connect channel');
      console.error(err);
      throw err;
    }
  };

  const disconnectChannel = async (channelId: string) => {
    try {
      const success = await channelService.disconnectChannel(channelId);
      if (success) {
        setChannels(
          channels.map(channel => 
            channel.id === channelId 
              ? { ...channel, connected: false } 
              : channel
          )
        );
      }
      return success;
    } catch (err) {
      setError('Failed to disconnect channel');
      console.error(err);
      throw err;
    }
  };

  const getChannelById = (channelId: string) => {
    return channels.find(channel => channel.id === channelId);
  };

  // Derived state for connected channels
  const connectedChannels = channels.filter(channel => channel.connected);

  useEffect(() => {
    fetchChannels();
  }, []);

  return (
    <ChannelContext.Provider
      value={{
        channels,
        connectedChannels,
        loading,
        error,
        fetchChannels,
        connectChannel,
        disconnectChannel,
        getChannelById
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

export const useChannelContext = () => {
  const context = useContext(ChannelContext);
  if (context === undefined) {
    throw new Error('useChannelContext must be used within a ChannelProvider');
  }
  return context;
};
