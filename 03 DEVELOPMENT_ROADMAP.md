{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # Forma \'97 Development Roadmap\
\
## Development Strategy\
\
Build Forma in small, independently testable modules.\
\
The development process has four principles:\
\
1. Build the visual interface before complex functionality.\
2. Establish the data model before cloud synchronization.\
3. Complete and test each module before proceeding.\
4. Avoid implementing future features prematurely.\
\
Follow the order below.\
\
---\
\
## Phase 1 \'97 Foundation and Visual Interface\
\
### Module 1.1 \'97 Project Foundation\
\
**Goal:** Establish a clean, working Next.js application.\
\
Tasks:\
- Inspect the existing project.\
- Confirm the framework and installed dependencies.\
- Establish the App Router structure.\
- Configure TypeScript and linting.\
- Establish a basic global stylesheet.\
- Create a minimal application entry point.\
- Ensure the application starts and builds successfully.\
\
Do not implement the full dashboard.\
\
**Acceptance criteria:**\
- Development server starts.\
- Application loads without runtime errors.\
- TypeScript checks pass.\
- Production build succeeds.\
- Project structure is understandable.\
\
### Module 1.2 \'97 Design System\
\
**Goal:** Establish the visual foundation.\
\
Tasks:\
- Define neutral light and dark color tokens.\
- Define typography and spacing.\
- Define borders, shadows, and corner radii.\
- Create reusable buttons, cards, inputs, and basic controls.\
- Implement light, dark, and system themes.\
- Verify basic responsiveness.\
\
**Acceptance criteria:**\
- Shared components use consistent design tokens.\
- Both themes are readable.\
- Components work on desktop and mobile.\
- No unnecessary dependencies are introduced.\
\
### Module 1.3 \'97 Application Shell\
\
**Goal:** Implement navigation and the main layout.\
\
Tasks:\
- Create the desktop sidebar.\
- Implement sidebar collapse and expansion.\
- Create mobile bottom navigation.\
- Establish the main content area.\
- Add page-title and section-header patterns.\
- Add theme controls.\
\
**Acceptance criteria:**\
- Navigation works between placeholder sections.\
- The layout responds correctly to screen size.\
- Mobile navigation is easy to use.\
- The interface follows the product specification.\
\
### Module 1.4 \'97 Dashboard UI\
\
**Goal:** Build the complete dashboard appearance using demo data.\
\
Tasks:\
- Create the minimal dashboard layout.\
- Create the statistics-focused dashboard layout.\
- Implement a layout switcher.\
- Create habit cards.\
- Create today's progress summary.\
- Create heatmap presentation using demo data.\
- Create placeholder graph components.\
- Create empty states.\
\
**Important:** This module is primarily visual. Do not build the final persistence or statistics engine yet.\
\
**Acceptance criteria:**\
- Dashboard looks polished with realistic demo data.\
- Both layouts work.\
- Cards and sections are responsive.\
- Controls have coherent visual states.\
- No obvious broken interactions remain.\
\
---\
\
## Phase 2 \'97 Habit Management and Local Data\
\
### Module 2.1 \'97 Habit Data Model\
\
**Goal:** Define the core types and data structures.\
\
Tasks:\
- Define habit types.\
- Define schedules.\
- Define categories.\
- Define daily progress records.\
- Define completion states.\
- Define IDs and timestamps.\
- Document important date and scheduling decisions.\
\
**Acceptance criteria:**\
- Data structures support all required habit types.\
- Historical records are separate from current habit configuration where appropriate.\
- Types are explicit and validated.\
\
### Module 2.2 \'97 Habit Creation and Editing UI\
\
**Goal:** Allow users to create and edit habits.\
\
Tasks:\
- Build the creation form.\
- Build the editing form.\
- Support all four habit types.\
- Support categories.\
- Support schedules.\
- Support targets and units.\
- Validate user input.\
\
**Acceptance criteria:**\
- Users can create and edit habits in the interface.\
- Type-specific fields are shown appropriately.\
- Invalid input is handled clearly.\
- Existing habit data is preserved during editing.\
\
### Module 2.3 \'97 Local Persistence\
\
**Goal:** Preserve data across reloads.\
\
Tasks:\
- Select an appropriate local persistence mechanism.\
- Implement repository functions.\
- Save and load habits.\
- Save and load progress records.\
- Handle loading and error states.\
- Keep persistence separate from presentation components.\
\
**Acceptance criteria:**\
- Created habits remain after reload.\
- Progress records remain after reload.\
- Errors are handled without silently discarding changes.\
- Data access logic is reusable.\
\
### Module 2.4 \'97 Habit Tracking\
\
**Goal:** Make habit cards functional.\
\
Tasks:\
- Implement completion actions.\
- Implement undo.\
- Implement partial progress.\
- Implement numerical tracking.\
- Implement duration tracking.\
- Implement counter tracking.\
- Support skipped entries.\
- Update the dashboard immediately after changes.\
\
**Acceptance criteria:**\
- Each habit type behaves correctly.\
- Progress persists.\
- Completion states are visually clear.\
- Duplicate or contradictory records are avoided.\
\
---\
\
## Phase 3 \'97 History and Calculations\
\
### Module 3.1 \'97 Historical Tracking\
\
**Goal:** Allow users to inspect and correct previous dates.\
\
Tasks:\
- Implement date selection.\
- Display habits scheduled for a selected date.\
- Load historical progress.\
- Edit previous entries.\
- Preserve historical context when habits change.\
\
**Acceptance criteria:**\
- Past records can be inspected and edited.\
- Historical edits persist.\
- The current dashboard remains consistent.\
\
### Module 3.2 \'97 Scheduling Engine\
\
**Goal:** Calculate which habits are expected on each date.\
\
Tasks:\
- Implement daily schedules.\
- Implement selected weekdays.\
- Implement weekly targets.\
- Implement monthly targets.\
- Implement custom intervals where supported.\
- Define local-date behavior.\
- Add tests for schedule boundaries.\
\
**Acceptance criteria:**\
- Unscheduled days are excluded from daily completion rates.\
- Weekly targets use the correct period.\
- Scheduling works across month and year boundaries.\
- Date calculations are tested.\
\
### Module 3.3 \'97 Streak Engine\
\
**Goal:** Calculate streaks correctly.\
\
Tasks:\
- Implement current streaks.\
- Implement longest streaks.\
- Respect each habit's schedule.\
- Handle skipped and partial states consistently.\
- Recalculate affected streaks after historical edits.\
\
**Acceptance criteria:**\
- Unscheduled days do not break streaks.\
- Scheduled incomplete days follow the documented rules.\
- Weekly-target habits use weekly logic.\
- Unit tests cover edge cases.\
\
### Module 3.4 \'97 Heatmap\
\
**Goal:** Make the contribution heatmap functional.\
\
Tasks:\
- Calculate daily completion intensity.\
- Render historical squares.\
- Implement tooltips.\
- Implement date selection.\
- Display selected-day details.\
- Support mobile scrolling.\
- Support both themes.\
\
**Acceptance criteria:**\
- Heatmap reflects actual history.\
- Selected dates are distinguishable.\
- Empty history is handled.\
- Intensity calculations are documented and tested.\
\
### Module 3.5 \'97 Statistics and Graphs\
\
**Goal:** Replace placeholder statistics with real calculations.\
\
Tasks:\
- Implement daily completion percentage.\
- Implement weekly and monthly completion rates.\
- Implement per-habit consistency.\
- Implement best and lowest-performing habits.\
- Implement total completions.\
- Implement milestones and records.\
- Implement progress graphs.\
\
**Acceptance criteria:**\
- Statistics use actual data.\
- Empty data is handled correctly.\
- Graphs have useful labels.\
- Calculations are tested.\
\
---\
\
## Phase 4 \'97 Cloud and Multi-Device Support\
\
### Module 4.1 \'97 Cloud Data Architecture\
\
**Goal:** Prepare the data model for secure cloud persistence.\
\
Tasks:\
- Review the local data model.\
- Define database tables and relationships.\
- Define user ownership.\
- Define database access policies.\
- Plan migration from local-only data.\
- Document synchronization behavior.\
\
**Acceptance criteria:**\
- Users' data is isolated.\
- Database access is secured.\
- Data migration has a defined strategy.\
\
### Module 4.2 \'97 Authentication\
\
**Goal:** Support user accounts.\
\
Tasks:\
- Integrate Supabase authentication.\
- Implement sign-in and sign-out.\
- Implement required account flows.\
- Protect private data.\
- Handle authentication errors.\
\
**Acceptance criteria:**\
- Authentication works.\
- Private data cannot be accessed by other users.\
- Authentication states are handled clearly.\
\
### Module 4.3 \'97 Cloud Persistence\
\
**Goal:** Save and load data through Supabase.\
\
Tasks:\
- Implement cloud repositories.\
- Save habits and progress.\
- Load user data.\
- Handle network errors.\
- Define local-to-cloud migration.\
\
**Acceptance criteria:**\
- Data persists in the cloud.\
- Errors do not silently destroy local data.\
- User ownership is enforced.\
\
### Module 4.4 \'97 Multi-Device Synchronization\
\
**Goal:** Keep data consistent across devices.\
\
Tasks:\
- Synchronize changes.\
- Handle concurrent edits.\
- Prevent duplicate records.\
- Handle authentication changes.\
- Communicate sync status.\
\
**Acceptance criteria:**\
- Changes become available on other devices.\
- Conflicts are handled explicitly.\
- Duplicate operations are safe.\
\
### Module 4.5 \'97 Offline Support\
\
**Goal:** Support useful offline operation.\
\
Tasks:\
- Introduce IndexedDB where appropriate.\
- Cache relevant application data.\
- Queue offline changes.\
- Synchronize when connectivity returns.\
- Handle conflicts.\
- Display offline and sync states.\
\
**Acceptance criteria:**\
- Cached data remains available offline.\
- Offline edits survive reloads.\
- Changes synchronize after reconnection.\
- Failed synchronization does not silently lose data.\
\
---\
\
## Phase 5 \'97 Supporting Features\
\
### Module 5.1 \'97 Dashboard Customization\
\
Tasks:\
- Show and hide dashboard sections.\
- Reorder supported sections.\
- Persist preferences.\
- Keep defaults useful.\
\
### Module 5.2 \'97 Categories and Organization\
\
Tasks:\
- Manage custom categories.\
- Filter habits.\
- Group habits.\
- Support manual ordering.\
\
### Module 5.3 \'97 Export and Backup\
\
Tasks:\
- Export habits and history to CSV.\
- Use consistent dates and column names.\
- Add backup functionality where appropriate.\
- Document restoration limitations.\
\
### Module 5.4 \'97 Notifications\
\
Tasks:\
- Add optional reminders.\
- Request permissions appropriately.\
- Support reminder settings.\
- Respect browser and iOS limitations.\
\
### Module 5.5 \'97 Progressive Web App\
\
Tasks:\
- Add a web app manifest.\
- Configure suitable icons.\
- Implement appropriate service-worker behavior.\
- Test installation on supported platforms.\
- Ensure cached assets do not break deployments.\
\
---\
\
## Phase 6 \'97 Quality and Release\
\
### Module 6.1 \'97 Testing\
\
Tasks:\
- Add unit tests for calculations.\
- Test habit creation and editing.\
- Test historical edits.\
- Test local persistence.\
- Test synchronization.\
- Test offline behavior.\
- Fix regressions.\
\
### Module 6.2 \'97 Responsive and Accessibility Review\
\
Tasks:\
- Test desktop, tablet, and iPhone layouts.\
- Test keyboard navigation.\
- Review color contrast.\
- Review touch targets.\
- Test loading, empty, and error states.\
\
### Module 6.3 \'97 Deployment\
\
Tasks:\
- Prepare environment variables.\
- Verify production configuration.\
- Build for production.\
- Deploy to Vercel.\
- Verify production behavior.\
- Document setup and deployment.\
\
---\
\
## Module Execution Rules\
\
For each module:\
\
1. Read `CLAUDE.md`.\
2. Read `FORMA_SPEC.md`.\
3. Read this roadmap.\
4. Read `CURRENT_TASK.md`.\
5. Inspect the existing implementation.\
6. Implement only the current module.\
7. Run relevant checks.\
8. Report results.\
9. Stop and wait before continuing.\
\
Do not skip ahead.\
\
Do not consider a module complete simply because the application compiles. Check its acceptance criteria.}