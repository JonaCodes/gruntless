export const LLM_TASK_NAMES = {} as const;

export const OPEN_AI_CONSTS = {
  EMPTY_DRAFT_ID: -1,
  MODELS: {
    GPT_4o_MINI: 'gpt-4o-mini',
    GPT_4o: 'gpt-4o',
    GPT_4_1: 'gpt-4.1',
    GPT_4_1_MINI: 'gpt-4.1-mini',
    GPT_4_1_NANO: 'gpt-4.1-nano',
  },
  RESPONSE_TYPES: {
    OBJECT: 'object',
    ARRAY: 'array',
  },
} as const;
