import { TextInput } from '@mantine/core';
import { WorkflowField } from '@shared/types/workflows';

interface TextInputFieldProps {
  field: WorkflowField;
  value: string;
  onChange: (value: string) => void;
}

const TextInputField = ({ field, value, onChange }: TextInputFieldProps) => {
  return (
    <TextInput
      placeholder={field.placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default TextInputField;
