import { WorkflowCategory } from '@shared/types/workflows';

export const getBadgeColor = (category: WorkflowCategory): string => {
  switch (category) {
    case 'Sales':
      return 'blue';
    case 'Finance':
      return 'green';
    case 'Internal':
      return 'yellow';
    case 'Legal':
      return 'orange';
    case 'Marketing':
      return 'pink';
    default:
      return 'gray';
  }
};
