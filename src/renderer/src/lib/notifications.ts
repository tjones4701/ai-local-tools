import { hashCheck } from '@renderer/lib/quickhash';
import { rpcGeneric } from '@renderer/lib/server';
import { useEffect, useState } from 'react';
import { useInterval } from 'react-use';

type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
};
export const notifications = {
  read: async (id: string | any) => {
    if (typeof id === 'object' && id !== null) {
      id = id.id;
    }
    return await rpcGeneric('notifications.read', id);
  },
  getAll: async (read: boolean | null = null) => {
    return await rpcGeneric<Notification[]>('notifications.getAll', read);
  },
  create: async (title: string, message: string) => {
    return await rpcGeneric('notifications.create', title, message);
  }
};

export const useNotifications = () => {
  const [data, setData] = useState<{
    loading: boolean;
    error: any;
    value: Notification[];
  }>({
    loading: true,
    error: null,
    value: []
  });

  const loadNotifications = async () => {
    try {
      const items = await notifications.getAll();
      if (hashCheck(items, data.value)) {
        setData({ loading: false, error: null, value: items });
      }
    } catch (e) {
      console.error(e);
      setData({ loading: false, error: e as any, value: [] });
    }
  };

  const wrapper = (func) => {
    return async (...args) => {
      await func(...args);
      await loadNotifications();
    };
  };

  useInterval(() => {
    loadNotifications();
  }, 500);

  useEffect(() => {
    loadNotifications();
  }, []);

  return {
    loading: data.loading,
    error: data.error,
    value: data.value,
    read: wrapper(notifications.read),
    getAll: notifications.getAll,
    create: wrapper(notifications.create)
  };
};
