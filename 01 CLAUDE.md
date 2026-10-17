{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 d# Forma \'97 Project Instructions\
\
## 1. Project Overview\
\
Forma is a clean, minimal, responsive habit-tracking web application designed for desktop and mobile use.\
\
The primary goals are:\
- Make daily habit tracking fast and effortless.\
- Present progress through clear visualizations and useful statistics.\
- Create a calm, polished interface inspired by Apple's design language.\
- Work well on both desktop and iPhone.\
- Keep the application reliable, maintainable, and easy to extend.\
\
Read `FORMA_SPEC.md` for the complete product requirements.\
\
Read `DEVELOPMENT_ROADMAP.md` for the implementation sequence.\
\
Read `CURRENT_TASK.md` before starting any implementation work.\
\
## 2. Core Development Rules\
\
### Work incrementally\
- Implement only the module specified in `CURRENT_TASK.md`.\
- Do not implement future modules unless explicitly instructed.\
- Do not attempt to build the entire application in one pass.\
- Finish the current module before moving to the next one.\
- Keep changes focused and easy to review.\
\
### Inspect before modifying\
- Inspect the existing project structure before making changes.\
- Read relevant existing components and configuration files.\
- Preserve working functionality.\
- Do not replace working code unnecessarily.\
- Do not assume a file or feature exists without checking.\
\
### Test your work\
After implementing a module:\
1. Run the relevant checks.\
2. Run TypeScript checks when applicable.\
3. Run ESLint when configured.\
4. Run the production build when appropriate.\
5. Fix errors introduced by your changes.\
6. Report anything you could not test.\
\
Never claim that a test passed unless you actually ran it.\
\
### Avoid unnecessary complexity\
- Prefer simple, readable solutions.\
- Avoid unnecessary dependencies.\
- Do not introduce abstractions without a clear benefit.\
- Keep components focused and reusable.\
- Avoid giant components that combine unrelated functionality.\
- Do not build custom infrastructure when a simpler solution is sufficient.\
\
## 3. Technology Rules\
\
Use the existing project stack where possible.\
\
The intended stack is:\
- Next.js with App Router.\
- React.\
- TypeScript with strict checking.\
- Tailwind CSS.\
- Supabase for authentication and cloud persistence when that module is reached.\
- Recharts for graphs when needed.\
- IndexedDB for offline persistence when needed.\
- Vercel for deployment.\
\
Do not add all these dependencies immediately. Introduce them only when the current module needs them.\
\
Do not migrate to another framework or language without explicit approval.\
\
Do not introduce a separate backend unless the product requirements genuinely require it.\
\
## 4. Design Rules\
\
Forma must feel polished, calm, and practical.\
\
The design should combine:\
- Apple's restrained visual design.\
- Linear's clean navigation and spacing.\
- GitHub's habit heatmap concept.\
\
Avoid:\
- Futuristic interfaces.\
- Excessive gradients.\
- Glassmorphism everywhere.\
- Excessive rounded cards.\
- Unnecessary animations.\
- Bright, distracting colors.\
- Excessive borders and dividers.\
- Dense dashboards with too many competing elements.\
- Generic AI-generated landing-page aesthetics.\
\
Use:\
- Consistent spacing.\
- Clear typography.\
- Restrained neutral colors.\
- Subtle borders and shadows.\
- A limited number of accent colors.\
- Smooth but understated interactions.\
- Accessible contrast and visible focus states.\
- Responsive layouts.\
\
Green should primarily communicate successful completion or positive progress.\
\
Charts should use restrained neutral colors and subtle gradients where appropriate. They must remain readable and informative.\
\
Do not sacrifice usability for visual appearance.\
\
## 5. Component Architecture\
\
- Reuse components when their behavior and appearance are genuinely shared.\
- Separate data logic from presentation when appropriate.\
- Keep page components reasonably small.\
- Use clear, descriptive file and component names.\
- Keep shared types in appropriate shared locations.\
- Avoid duplicating business logic.\
- Do not create unnecessary component abstractions for one-off elements.\
\
Follow the conventions already established in the project.\
\
## 6. Data Integrity\
\
Habit history is important and must not be silently lost.\
\
When persistence is introduced:\
- Validate user input.\
- Handle loading, empty, error, and success states.\
- Preserve historical completion data when a habit is edited.\
- Handle time zones and dates consistently.\
- Avoid accidental duplicate records.\
- Ensure streak calculations respect each habit's schedule.\
- Do not treat skipped habits as completed.\
- Do not break streaks on days when a habit was not scheduled.\
\
Never silently overwrite user data during synchronization.\
\
## 7. Accessibility and Responsiveness\
\
- Support keyboard navigation.\
- Use semantic HTML.\
- Provide accessible names for icon-only buttons.\
- Ensure sufficient color contrast.\
- Make interactive elements usable with touch.\
- Avoid relying on color alone to communicate state.\
- Support desktop, tablet, and mobile layouts.\
- Give particular attention to narrow iPhone screens.\
\
## 8. Dependency Management\
\
Before adding a dependency:\
1. Check whether the functionality already exists in the project.\
2. Consider whether native browser APIs are sufficient.\
3. Prefer established, maintained libraries when a dependency is justified.\
4. Explain significant new dependencies in the final report.\
\
Never install a large library for a trivial task.\
\
## 9. Scope Control\
\
Do not:\
- Implement unrelated features.\
- Redesign the entire application during a small feature task.\
- Rewrite existing working components without a reason.\
- Add placeholder controls that look functional but do nothing without documenting them.\
- Introduce mock data into production functionality without clearly separating it.\
- Hide errors or ignore failed checks.\
\
If a requirement is ambiguous and the decision materially affects architecture or user experience, ask before making an irreversible decision.\
\
For minor details, use the simplest design consistent with `FORMA_SPEC.md`.\
\
## 10. Completion Report\
\
After each module, report:\
\
### Completed\
What was implemented.\
\
### Files changed\
The important files created, modified, or removed.\
\
### Verification\
Which commands were run and their actual results.\
\
### Known issues\
Anything incomplete, broken, or not tested.\
\
### Next step\
The next module from `DEVELOPMENT_ROADMAP.md`.\
\
Do not automatically begin the next module.\
\
Wait for approval or an explicit instruction to continue.}