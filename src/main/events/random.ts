import { EventHandler } from '../event';

export const randomEvents: Record<string, EventHandler> = {
  random: async () => {
    return Math.random();
  }
};
