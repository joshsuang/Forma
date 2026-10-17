{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # Current Task \'97 Module 1.1: Project Foundation\
\
## Objective\
\
Establish a clean, minimal, working foundation for Forma.\
\
The goal is to prepare the project for incremental development, not to build the full application.\
\
Read these files first:\
- `CLAUDE.md`\
- `FORMA_SPEC.md`\
- `DEVELOPMENT_ROADMAP.md`\
\
Follow the requirements in all three files.\
\
## Step 1 \'97 Inspect the Existing Project\
\
Before changing anything:\
- Inspect the project directory.\
- Identify the framework and package manager.\
- Inspect `package.json` if it exists.\
- Inspect the current source structure.\
- Identify existing configuration and dependencies.\
- Determine whether the project is already a working Next.js application.\
\
Do not overwrite existing work without a reason.\
\
## Step 2 \'97 Establish the Foundation\
\
If the project is not yet initialized:\
- Set up Next.js with the App Router.\
- Use TypeScript.\
- Use Tailwind CSS.\
- Enable strict TypeScript checking.\
- Configure sensible linting.\
- Use the existing package manager if one is already established.\
\
If the project is already initialized:\
- Reuse the existing setup.\
- Fix only necessary configuration problems.\
- Avoid unnecessary package changes.\
\
Create a clean, understandable folder structure appropriate for the existing project.\
\
Keep the structure simple. Do not create directories for every future feature before they are needed.\
\
## Step 3 \'97 Create the Minimal Application Entry Point\
\
Create a minimal Forma page.\
\
It should:\
- Display the name Forma.\
- Use a clean, neutral background.\
- Have readable typography.\
- Include a small, understated visual mark or text-based identity.\
- Work on desktop and mobile.\
- Demonstrate that the application is functioning.\
\
Do not implement:\
- The full dashboard.\
- Habit management.\
- Authentication.\
- Cloud storage.\
- Graphs.\
- Heatmap calculations.\
- Offline synchronization.\
\
Those features belong to later modules.\
\
## Step 4 \'97 Establish Basic Code Quality\
\
Ensure:\
- TypeScript is configured appropriately.\
- The application has a clear entry point.\
- There are no unnecessary dependencies.\
- The code is readable.\
- No obvious runtime errors occur.\
\
Do not add a testing framework unless the existing project already has one or it is genuinely needed for this foundation module.\
\
## Step 5 \'97 Verify\
\
Run the available relevant commands.\
\
At minimum, attempt:\
- TypeScript validation.\
- Linting.\
- Production build.\
- Development server startup or an equivalent runtime check.\
\
Use the commands appropriate to the actual project and package manager.\
\
Fix errors caused by your changes.\
\
Report commands that could not be run and explain why.\
\
## Scope Restrictions\
\
- Do not implement Module 1.2 or later.\
- Do not build the dashboard.\
- Do not add mock habit data.\
- Do not install dependencies for features that are not needed yet.\
- Do not deploy the application.\
- Do not rewrite unrelated files.\
- Do not automatically continue to the next module.\
\
## Acceptance Criteria\
\
The module is complete when:\
- Forma runs locally.\
- The application has a clean foundation.\
- TypeScript validation passes.\
- Linting passes, if configured.\
- The production build succeeds.\
- The basic page is responsive.\
- The project is ready for Module 1.2.\
\
## Final Report\
\
After completing the task, report:\
\
1. What was implemented.\
2. Which files were created or modified.\
3. Which commands were run and their results.\
4. Any remaining issues.\
5. Confirmation that you stopped without starting the next module.\
\
Stop after this module.}