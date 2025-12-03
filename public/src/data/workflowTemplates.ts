export interface WorkflowTemplate {
  id: string;
  label: string; // Short clickable text
  content: string; // Full detailed message
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'pdf-to-csv',
    label: 'PDF to CSV',
    content: `I have several different invoices in different PDF files, and I need to extract the following data into a CSV file:
    - Business name
    - Invoice number
    - Invoice date
    - Invoice amount

The PDFs might have different date formats, but the CSV date column should always be in YYYY-MM-DD format.`,
  },
  {
    id: 'merge-csvs',
    label: 'Merge CSVs',
    content: `My goal is to merge all my CSV files into one comprehensive dataset. Each file has a column called "customer_id" that serves as a unique identifier across all files. I want to combine them based on this ID so that all information about each customer appears in a single row.

The merged file should include all columns from all source files. If a customer appears in multiple files, merge their data into one row. If a customer only appears in some files, include them anyway with empty values for the missing columns.

The final output should be a single CSV file with no duplicate customer_id values.`,
  },
  {
    id: 'combine-columns',
    label: 'Combine columns',
    content: `I need to combine data from multiple columns in my CSV file into a single new column. Specifically, I want to create a "full_address" column by concatenating the "street", "city", "state", and "zip_code" columns, with appropriate spacing and formatting between them.

The format should be: "[Street], [City], [State] [Zip Code]"

After creating this new column, I'd like to keep all the original columns as well, so the new "full_address" column should be added to the existing dataset rather than replacing anything.`,
  },
  {
    id: 'split-csvs',
    label: 'Split CSVs',
    content: `I have a large CSV file that I need to split into multiple smaller files based on a specific column value. The file contains sales data, and I want to create separate CSV files for each sales region mentioned in the "region" column.

For example, if my regions are "North", "South", "East", and "West", I want to generate four separate CSV files - one for each region - where each file contains only the rows for that specific region.

Each output file should have the same column structure as the original file and should be named based on the region (e.g., "North_sales.csv", "South_sales.csv", etc.).`,
  },
  {
    id: 'filter-rows',
    label: 'Filter rows',
    content: `I need to filter my CSV file to include only rows that meet specific criteria. I want to keep only the rows where the "order_date" is within the last 90 days AND the "order_status" is either "completed" or "shipped".

Additionally, I want to exclude any rows where the "total_amount" is less than $50.

The output should be a new CSV file with the same columns as the original, but containing only the rows that match these conditions. Please preserve the original column headers and data types.`,
  },
];
