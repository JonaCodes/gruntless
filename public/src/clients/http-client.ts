import redaxios from 'redaxios';
import appStore from '../stores/appStore';
import { HTTP_METHODS } from './client-consts';

export const makeRequest = async (
  method: HTTP_METHODS,
  url: string,
  body?: any
): Promise<any> => {
  if (url.includes('auth') && !appStore.sessionAccessToken) {
    console.warn('No session token found, skipping request');
    return { data: {} };
  }

  try {
    const response = await redaxios({
      method: method as any,
      url,
      headers: {
        Authorization: `Bearer ${appStore.sessionAccessToken}`,
      },
      data: body,
    });

    return { ...response, data: response.data || {} };
  } catch (error: any) {
    if (error.status === 403) {
      if (error.data?.reason === 'BETA_ONLY') {
        return (window.location.href = '/oops/alpha');
      }
      return (window.location.href = '/oops/forbidden');
    }

    // TODO: alert error
    console.error('Caught error response from server', error);

    return {
      data: {},
      error: true,
      status: error.status,
      message: error.statusText,
    };
  }
};
