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
  WORKFLOWS: {
    LIST: '/api/workflows',
    CREATE: '/api/workflows',
    ADMIN_SEED: '/api/workflows/admin/seed',
    GET: (id: number) => `/api/workflows/${id}`,
    SEND_MESSAGE: (id: number) => `/api/workflows/${id}/messages`,
    APPROVE: (id: number) => `/api/workflows/${id}/approve`,
    EDIT: (id: number) => `/api/workflows/${id}/edit`,
  },
  SHARES: {
    CREATE: '/api/shares',
    ACCEPT: '/api/shares/accept',
  },
};
