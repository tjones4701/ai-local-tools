import { dataEvents } from './events/data';
import { notificationEvents } from './events/notifications';
import { openaiEvents } from './events/openai';
import { randomEvents } from './events/random';

export type EventHandler = (...args: any) => Promise<any>;

export type EventPayload = {
  event: string;
  args: any[];
  id: string;
};

export type EventResponse = EventPayload & {
  response: any | null;
  error: Error | null;
};

const events = {
  ...dataEvents,
  ...randomEvents,
  ...openaiEvents,
  ...notificationEvents
};

export async function handleEvent(eventPayload: EventPayload) {
  const eventResponse: EventResponse = {
    id: eventPayload.id,
    event: eventPayload.event,
    args: eventPayload.args,
    response: null,
    error: null
  };

  try {
    const event = events[eventResponse.event];
    if (!event) {
      throw new Error(`Event ${eventPayload.event} not found`);
    }
    eventResponse.response = await event(...eventPayload.args);
  } catch (e) {
    if (e instanceof Error) {
      eventResponse.error = e;
    } else {
      eventResponse.error = new Error('An unknown error occurred');
    }
  }
  return eventResponse;
}
