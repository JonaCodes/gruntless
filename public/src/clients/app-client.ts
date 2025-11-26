import { EventName } from 'shared-consts/event-names';
import { ENDPOINTS, HTTP_METHODS } from './client-consts';
import { makeRequest } from './http-client';

export const getUserData = async () => {
  const { data: userData } = await makeRequest(
    HTTP_METHODS.GET,
    ENDPOINTS.APP.CURRENT_USER
  );

  return userData;
};

export const sendEvent = async (name: EventName, data: any) => {
  await makeRequest(HTTP_METHODS.POST, ENDPOINTS.APP.EVENT, { name, data });
};
