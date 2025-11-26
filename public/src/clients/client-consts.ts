export enum HTTP_METHODS {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export const ENDPOINTS = {
  APP: {
    CURRENT_USER: '/auth/me',
    EVENT: '/public/api/event',
  },
};
