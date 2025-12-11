import { Text, Stack, Flex, ScrollArea, Box } from '@mantine/core';
import { FileExtract } from '@shared/types/workflows';
import { IconAlertTriangle } from '@tabler/icons-react';
import { ReachOut } from 'public/src/components/shared/ReachOut';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import classes from './previews.module.css';

interface PdfPreviewProps {
  extract: FileExtract;
}

const PdfPreview = ({ extract }: PdfPreviewProps) => {
  if (!extract.markdown_content) {
    return (
      <Text fz='sm'>
        Hmm, we weren't able to extract anything from this PDF. Please press
        "Reject" and try again.
        <ReachOut text='If the issue persists, reach out to' />
      </Text>
    );
  }

  return (
    <Stack gap='xs'>
      <ScrollArea h={300} px={'lg'} type='auto'>
        <Box
          p='md'
          className={classes.pdfPreview}
          style={{
            border: '4px solid var(--mantine-color-red-5)',
            borderRadius: '8px',
            color: 'black',
            backgroundColor: '#CDC5B4',
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkBreaks]}
            components={{
              h1: ({ children }) => (
                <Text fw={700} fz='lg' mt={2} mb='xs'>
                  {children}
                </Text>
              ),
              h2: ({ children }) => (
                <Text fw={600} fz='md' mt='sm' mb='xs'>
                  {children}
                </Text>
              ),
              p: ({ children }) => (
                <Text fz='sm' mb='xs'>
                  {children}
                </Text>
              ),
              ul: ({ children }) => (
                <Box component='ul' pl='md' mb='xs'>
                  {children}
                </Box>
              ),
              ol: ({ children }) => (
                <Box component='ol' pl='md' mb='xs'>
                  {children}
                </Box>
              ),
              li: ({ children }) => (
                <Text fz='sm' component='li' mb={4}>
                  {children}
                </Text>
              ),
              table: ({ children }) => (
                <Box
                  component='table'
                  mb='md'
                  style={{
                    border: '1px solid var(--mantine-color-gray-4)',
                    borderCollapse: 'collapse',
                    width: '100%',
                  }}
                >
                  {children}
                </Box>
              ),
              thead: ({ children }) => <Box component='thead'>{children}</Box>,
              tbody: ({ children }) => <Box component='tbody'>{children}</Box>,
              tr: ({ children }) => <Box component='tr'>{children}</Box>,
              th: ({ children }) => (
                <Box
                  component='th'
                  px='xs'
                  py={8}
                  style={{
                    border: '1px solid var(--mantine-color-gray-4)',
                    backgroundColor: 'var(--mantine-color-gray-1)',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {children}
                </Box>
              ),
              td: ({ children }) => (
                <Box
                  component='td'
                  px='xs'
                  py={8}
                  style={{
                    border: '1px solid var(--mantine-color-gray-4)',
                    fontSize: '0.875rem',
                  }}
                >
                  {children}
                </Box>
              ),
              hr: () => (
                <Box
                  component='hr'
                  my='md'
                  style={{
                    border: 'none',
                    borderTop: '2px dashed var(--mantine-color-gray-4)',
                  }}
                />
              ),
            }}
          >
            {extract.markdown_content}
          </ReactMarkdown>
        </Box>
      </ScrollArea>

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

export default PdfPreview;
