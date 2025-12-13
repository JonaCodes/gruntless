import { IconLock, IconBolt, IconTool } from '@tabler/icons-react';

export interface TrustedCompany {
  name: string;
  logoUrl: string;
}

export interface Feature {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

export const trustedCompanies: TrustedCompany[] = [
  {
    name: 'FinanceCorp',
    logoUrl: '/logos/financecorp.svg',
  },
  {
    name: 'LegalShield',
    logoUrl: '/logos/legalshield.svg',
  },
  {
    name: 'HealthSafe',
    logoUrl: '/logos/healthsafe.svg',
  },
];

export const features: Feature[] = [
  {
    icon: IconLock,
    title: 'Client Data Stays Local',
    description:
      'Your sensitive files never leave your machine. We process everything locally, ensuring 100% compliance with GDPR, HIPAA, and internal protocols.',
  },
  {
    icon: IconBolt,
    title: 'Built by AI in a Flash',
    description:
      "Describe what you need in natural language, like 'merge all invoices by date', and get the AI build or update your automations whenever you need.",
  },
  {
    icon: IconTool,
    title: 'No More Broken Scripts',
    description:
      'Say goodbye to fragile macros and unreliable freelancer scripts. Gruntless builds robust, professional-grade automations that just work on demand.',
  },
];
