Gruntless is a privacy-first AI platform that allows users to build and run
custom file automation entirely on their local device.

How it works: users describe a task in plain English (e.g., "merge these two
CSVs by name," "extract invoice numbers from PDFs," "clean up a messy Excel
sheet", etc). AI generates the Python script and a simple, custom UI. The
automation runs 100% client-side (in the user's browser via
Pyodide/WebAssembly), ensuring data never leaves their device.

Key Benefits of Gruntless:

- Privacy-first: Data stays local, never uploaded.
- No Code: Automate complex tasks with plain English.
- Time Savings: Eliminate hours of manual drudgery.
- Customized: AI builds the exact tool you need.
- Reliable: Scripts are auto-tested before use.

`pnpm dev` to run locally - runs FE and BE concurrently with HMR and auto server
reload
