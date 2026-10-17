Read these six Markdown files in the project root completely:

- `CLAUDE.md`
- `FORMA_SPEC.md`
- `DEVELOPMENT_ROADMAP.md`
- `CURRENT_TASK.md`
- `PROMPT_TEMPLATE.md`
- `README.md`

These files define the project instructions, product requirements, development roadmap, and current task. The development modules are defined inside `DEVELOPMENT_ROADMAP.md`; they are not separate files.

## Your task

Start with the task specified in `CURRENT_TASK.md`: Module 1.1 — Project Foundation.

### 1. Inspect
- Inspect the project directory before making changes.
- Determine whether application code already exists.
- Check which development tools and dependencies are available.
- Preserve any existing work.

### 2. Implement
- If the project contains only Markdown files, initialize the application using the technology stack specified in `CLAUDE.md` and `FORMA_SPEC.md`.
- Follow the requirements and acceptance criteria in `CURRENT_TASK.md`.
- Implement only the current module.
- Keep the implementation simple, clean, and maintainable.
- Do not implement future modules or unrelated features.
- Do not overwrite or modify the six Markdown specification files unless explicitly necessary and approved.

### 3. Verify
- Run the relevant TypeScript checks, linting, and production build.
- Start the application and verify that it loads if practical.
- Fix errors introduced by your changes.
- Clearly report any checks you could not run.

### 4. Report and stop
Report:
- What you implemented.
- Which files you created or modified.
- Which checks you ran and their results.
- Any remaining issues.
- Whether the acceptance criteria have been met.

Do not continue to the next module automatically.

If a significant obstacle requires a major architectural decision, explain the issue before proceeding.

**Important:** Build only the foundation in this task. Do not build the dashboard, habit tracking, authentication, cloud synchronization, or other future functionality yet.