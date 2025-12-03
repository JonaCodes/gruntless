import { Table, Text, Stack, Flex } from '@mantine/core';
import { FileExtract } from '@shared/types/workflows';
import { IconAlertTriangle } from '@tabler/icons-react';
import { ReachOut } from 'public/src/components/shared/ReachOut';

interface CsvPreviewProps {
  extract: FileExtract;
}

const CsvPreview = ({ extract }: CsvPreviewProps) => {
  if (!extract.columns || !extract.sample_rows) {
    return (
      <Text fz='sm'>
        Hmm, we weren't able to extract anything from this file. Please press
        "Reject" and try again.
        <ReachOut text='If the issue persists, reach out to' />
      </Text>
    );
  }

  return (
    <Stack gap='xs'>
      <Table striped withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            {extract.columns.map((column, idx) => (
              <Table.Th key={idx}>
                <Text fw={'bold'} size='sm'>
                  {column}
                </Text>
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {extract.sample_rows.map((row, rowIdx) => (
            <Table.Tr key={rowIdx}>
              {row.map((cell, cellIdx) => (
                <Table.Td key={cellIdx}>
                  <Text size='xs'>{cell}</Text>
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Flex justify='center' align='center' gap={4}>
        <IconAlertTriangle
          size={16}
          color='var(--mantine-color-orange-6)'
          stroke={1.5}
        />
        <Text size='xs' c='dimmed'>
          This sanitized data extract will be sent to our AI agent to help build
          your workflow
        </Text>
      </Flex>
    </Stack>
  );
};

export default CsvPreview;
