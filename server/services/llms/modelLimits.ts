import { RateLimiterConfig } from './llmRateLimiter';

const envOr = (key: string, fallback: number) =>
  Number(process.env[key] ?? fallback);

export const modelLimitConfig: Record<string, RateLimiterConfig> = {
  'gpt-4.1': {
    requestsPerMinute: envOr('OPENAI_GPT_4_1_RPM', 500),
    tokensPerMinute: envOr('OPENAI_GPT_4_1_TPM', 30_000),
  },
  'gpt-4.1-mini': {
    requestsPerMinute: envOr('OPENAI_GPT_4_1_MINI_RPM', 500),
    tokensPerMinute: envOr('OPENAI_GPT_4_1_MINI_TPM', 200_000),
  },
  'gpt-4.1-nano': {
    requestsPerMinute: envOr('OPENAI_GPT_4_1_NANO_RPM', 500),
    tokensPerMinute: envOr('OPENAI_GPT_4_1_NANO_TPM', 200_000),
  },
  'gpt-4o': {
    requestsPerMinute: envOr('OPENAI_GPT_4O_RPM', 500),
    tokensPerMinute: envOr('OPENAI_GPT_4O_TPM', 30_000),
  },
  'gpt-4o-mini': {
    requestsPerMinute: envOr('OPENAI_GPT_4O_RPM', 500),
    tokensPerMinute: envOr('OPENAI_GPT_4O_TPM', 200_000),
  },
};

export const defaultLimitConfig: RateLimiterConfig = {
  requestsPerMinute: envOr('OPENAI_DEFAULT_RPM', 500),
  tokensPerMinute: envOr('OPENAI_DEFAULT_TPM', 30_000),
};
