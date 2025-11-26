export enum ABTestNames {
  CTA_MESSAGE = 'ab_test_cta',
}

interface ABTestValue<T> {
  values: T[];
  expirationHours?: number;
}

type ABTestConfig = {
  [K in ABTestNames]: ABTestValue<any>;
};

export const AB_TEST_VALUES: ABTestConfig = {
  [ABTestNames.CTA_MESSAGE]: {
    values: [],
    expirationHours: 24,
  },
};
