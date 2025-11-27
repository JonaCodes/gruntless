import models from '../../models';
import { Request } from 'express';
import { EventName } from '@shared/consts/event-names';

interface EventData {
  name: string;
  userId?: number | null;
  ip?: string | null;
  data?: any;
}

const IGNORED_USER_IDS = [1];

class EventService {
  private static async createEvent(eventData: EventData) {
    if (IGNORED_USER_IDS.includes(eventData.userId || -1)) return;

    try {
      await models.Event.create({
        name: eventData.name,
        user_id: eventData.userId || null,
        ip: eventData.ip || null,
        data: eventData.data || null,
      });
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  }

  static send(name: EventName, data?: any, req?: Request) {
    const eventData: EventData = { name, data };

    if (req) {
      if (req.user?.id) eventData.userId = req.user.id;

      eventData.ip =
        req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
        req.socket.remoteAddress ||
        'unknown';
    }

    this.createEvent(eventData).catch((error) => {
      console.error('Failed to fire event:', error);
    });
  }
}

export default EventService;
