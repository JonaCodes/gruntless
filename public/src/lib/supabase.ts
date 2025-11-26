import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client;

if (!supabaseUrl || !supabaseKey) {
  if (import.meta.env.DEV) {
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
