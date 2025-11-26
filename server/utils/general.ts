import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let client;

if (!supabaseUrl || !supabaseKey) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'Supabase credentials missing. Using mock client for development.'
    );
    // Create a proxy that returns promises resolving to null/success for any property access
    const mockHandler = {
      get: (target: any, prop: any): any => {
        if (prop === 'then') return undefined; // Not a promise itself
        return new Proxy(
          () => Promise.resolve({ data: {}, error: null }),
          mockHandler
        );
      },
      apply: () => Promise.resolve({ data: {}, error: null }),
    };
    client = new Proxy({}, mockHandler);
  } else {
    throw new Error('Supabase credentials required in production');
  }
} else {
  client = createClient(supabaseUrl, supabaseKey);
}

export const supabase = client as ReturnType<typeof createClient>;
