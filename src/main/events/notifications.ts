import { createEntity, getRepository, patchEntity } from '../data/datasource';
import { Notification } from '../data/entities/notifications.entity';

export async function getNotifications(read: boolean | null) {
  const repository = await getRepository(Notification);
  let options: any = {
    order: {
      createdAt: 'DESC'
    }
  };
  if (read !== null) {
    options = { where: { read } };
  }

  const notifications = repository.find(options);

  return notifications;
}

export async function readNotification(id: number) {
  return await patchEntity(Notification, id, {
    read: true
  });
}

export async function createNotification(title: string, message: string) {
  const notification = await createEntity(Notification, { title, message });
  return notification;
}

export const notificationEvents = {
  'notifications.getAll': async (read: boolean | null) => {
    return await getNotifications(read);
  },
  'notifications.read': async (id: number) => {
    return await readNotification(id);
  },
  'notifications.create': async (title: string, message: string) => {
    return await createNotification(title, message);
  }
};
