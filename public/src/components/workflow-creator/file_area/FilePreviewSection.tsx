import { Box, Text, Stack, Button, Badge, Flex } from '@mantine/core';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Carousel } from '@mantine/carousel';
import workflowFilesStore from 'public/src/stores/workflow-creator/workflowFilesStore';
import classes from './file_area.module.css';
import { STYLES } from 'public/src/consts/styling';
import DataPreview from './DataPreview';
import { EXTRACTION_STATUS } from '@shared/types/workflows';

const FilePreviewSection = observer(() => {
  const [embla, setEmbla] = useState<any>(null);

  if (!workflowFilesStore.hasFiles) {
    return null;
  }

  const handleApprove = (fileName: string) => {
    workflowFilesStore.approveFile(fileName);

    if (workflowFilesStore.hasMultipleFiles) {
      embla?.scrollNext();
    }
  };

  const handleApproveAll = () => {
    workflowFilesStore.approveAllFiles();
  };

  return (
    <Box>
      <Carousel
        getEmblaApi={setEmbla}
        withIndicators={workflowFilesStore.hasMultipleFiles}
        withControls={workflowFilesStore.hasMultipleFiles}
        controlsOffset={8}
        slideGap={'xl'}
        emblaOptions={{
          loop: true,
        }}
        classNames={{
          root: classes.previewSection,
        }}
      >
        {workflowFilesStore.uploadedFiles.map((file) => {
          const isApproved = workflowFilesStore.approvedFiles.has(file.name);
          const isExtracting =
            workflowFilesStore.getExtractionStatus(file.name) ===
            EXTRACTION_STATUS.EXTRACTING;
          const isError =
            workflowFilesStore.getExtractionStatus(file.name) ===
            EXTRACTION_STATUS.ERROR;

          const shouldDisable = isExtracting || isError;

          const extract = workflowFilesStore.extractedFiles[file.name];
          const pageCount = extract?.page_count;
          const pageCountString = `${pageCount} page${pageCount !== 1 ? 's' : ''}`;

          const pageCountJSX = pageCount ? (
            <span
              style={{
                fontSize: '0.8rem',
                color: 'var(--mantine-color-dark-2)',
              }}
            >
              ({pageCountString})
            </span>
          ) : (
            ''
          );

          return (
            <Carousel.Slide key={file.name}>
              <Stack gap='xs'>
                <Flex align='center' justify='space-between'>
                  <Text c={'var(--mantine-color-gray-1)'} fw={600}>
                    {file.name} {pageCountJSX}
                  </Text>
                  {isApproved && (
                    <Badge color='green' variant='light'>
                      ✔ Approved
                    </Badge>
                  )}
                </Flex>

                <DataPreview fileName={file.name} />

                <Flex
                  justify='end'
                  mb={workflowFilesStore.hasMultipleFiles ? 'md' : 0}
                >
                  <Button
                    onClick={() => handleApprove(file.name)}
                    disabled={isApproved || shouldDisable}
                    variant='subtle'
                    bg={isApproved || shouldDisable ? 'transparent' : ''}
                    color={isApproved || shouldDisable ? 'gray' : 'green.5'}
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => workflowFilesStore.removeFile(file.name)}
                    disabled={shouldDisable}
                    variant='subtle'
                    bg={shouldDisable ? 'transparent' : ''}
                    color={shouldDisable ? 'gray' : 'red.5'}
                  >
                    Reject
                  </Button>
                </Flex>
              </Stack>
            </Carousel.Slide>
          );
        })}
      </Carousel>

      {workflowFilesStore.hasMultipleFiles && (
        <Flex justify='end' mt={4}>
          <Button
            onClick={handleApproveAll}
            disabled={workflowFilesStore.allFilesApproved}
            bg={workflowFilesStore.allFilesApproved ? 'transparent' : ''}
            variant={'subtle'}
            color={
              workflowFilesStore.allFilesApproved
                ? 'gray'
                : STYLES.COLORS.APP_THEME.SHADE_6
            }
          >
            {workflowFilesStore.allFilesApproved
              ? '✔ All files approved'
              : 'Approve all files'}
          </Button>
        </Flex>
      )}
    </Box>
  );
});

export default FilePreviewSection;
