export const EVENT_NAMES = {
  ABOUT_PAGE_VIEW: 'about_page_view',
  CTA_IMPRESSION: 'cta_impression',
  CTA_BUTTON_CLICK: 'cta_button_click',
} as const;

export type EventName = (typeof EVENT_NAMES)[keyof typeof EVENT_NAMES];
