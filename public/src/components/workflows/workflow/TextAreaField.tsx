import { Textarea } from '@mantine/core';
import { WorkflowField } from '@shared/types/workflows';

interface TextAreaFieldProps {
  field: WorkflowField;
  value: string;
  onChange: (value: string) => void;
}

const TextAreaField = ({ field, value, onChange }: TextAreaFieldProps) => {
  return (
    <Textarea
      placeholder={field.placeholder}
      label={field.label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autosize
      minRows={3}
    />
  );
};

export default TextAreaField;
