import { Request, Response } from 'express';
import EventService from '../services/events/events-service';
import { EVENT_NAMES, EventName } from '@shared/consts/event-names';

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, data } = req.body;

    if (!Object.values(EVENT_NAMES).includes(name)) {
      return res.status(400).json({ error: 'Invalid event name' });
    }

    EventService.send(name as EventName, data, req);
    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};
