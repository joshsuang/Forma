{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # Forma \'97 Product Specification\
\
## 1. Product Vision\
\
Forma is a minimal, efficient habit tracker that helps users build consistency and understand their progress.\
\
The application should make three things easy:\
1. See today's habits.\
2. Record progress quickly.\
3. Understand long-term consistency.\
\
The application should feel like a polished productivity tool, not a gamified mobile game or a complicated analytics platform.\
\
## 2. Target Platforms\
\
Forma is a responsive web application.\
\
Primary platforms:\
- Desktop browsers, particularly macOS.\
- Mobile browsers, particularly iPhone Safari.\
- Tablet browsers.\
\
The application should be installable as a Progressive Web App when supported.\
\
Do not assume that all native iOS capabilities are available to a web application.\
\
## 3. Visual Direction\
\
### Design references\
\
Use the following as inspiration, not as interfaces to copy:\
- Apple: restrained, polished, intuitive design.\
- Linear: clear navigation and information hierarchy.\
- GitHub: contribution-style heatmaps.\
\
### Overall appearance\
\
The interface should be:\
- Minimal.\
- Calm.\
- Precise.\
- Consistent.\
- Modern without looking futuristic.\
- Dense enough to be useful without feeling crowded.\
\
### Colors\
\
Use a restrained neutral palette.\
\
Light mode:\
- Off-white or very light gray page background.\
- White or near-white cards.\
- Dark gray primary text.\
- Muted gray secondary text.\
- Subtle neutral borders.\
- Restrained green for successful completion.\
\
Dark mode:\
- Deep charcoal background rather than pure black everywhere.\
- Slightly lighter cards.\
- Readable light text.\
- Subtle borders.\
- Consistent green completion indicators.\
\
Avoid unnecessary colors.\
\
Graphs should primarily use gray tones, with green used selectively to highlight meaningful progress.\
\
### Typography\
\
Use a clean, readable sans-serif typeface.\
\
Establish a consistent hierarchy for:\
- Page titles.\
- Section headings.\
- Card titles.\
- Main statistics.\
- Secondary labels.\
- Supporting descriptions.\
\
Avoid oversized headings that waste space.\
\
### Surfaces and spacing\
\
Use:\
- Consistent spacing.\
- Subtle borders.\
- Restrained shadows.\
- Consistent corner radii.\
- Clear separation between major sections.\
\
Avoid excessive nested cards.\
\
## 4. Theme System\
\
Support:\
- Light mode.\
- Dark mode.\
- System preference.\
\
System preference should be the initial default.\
\
Users must be able to override the system preference.\
\
Persist the user's explicit theme selection.\
\
Avoid a visible flash of the wrong theme during initial loading where practical.\
\
## 5. Navigation\
\
### Desktop\
\
Use a collapsible sidebar inspired by Linear.\
\
The sidebar should support:\
- Primary navigation.\
- Access to the dashboard.\
- Access to habit management.\
- Access to statistics.\
- Access to settings.\
\
The expanded sidebar should show labels and icons.\
\
The collapsed sidebar should retain recognizable icons with accessible labels or tooltips.\
\
### Mobile\
\
Use a bottom navigation bar on narrow screens.\
\
Keep the primary actions easy to reach with one hand.\
\
Avoid forcing users to open a desktop-style sidebar on mobile.\
\
### Navigation principle\
\
Keep navigation small and predictable.\
\
Do not introduce unnecessary pages or nested menus.\
\
## 6. Dashboard\
\
The dashboard is the main screen.\
\
It should prioritize today's habits while still providing a useful overview of progress.\
\
### Dashboard layouts\
\
Provide two switchable dashboard layouts:\
\
1. Minimal\
   - Prioritize today's habits.\
   - Show essential progress.\
   - Minimize secondary statistics.\
   - Keep the interface compact.\
\
2. Statistics-focused\
   - Show more progress indicators.\
   - Include additional statistics and graphs.\
   - Maintain a clear visual hierarchy.\
\
Persist the selected layout.\
\
### Dashboard sections\
\
Support:\
- Today's progress.\
- Habit list.\
- Habit completion summary.\
- Contribution-style heatmap.\
- Selected statistics.\
- Optional progress graph.\
- Recent milestones or records when implemented.\
\
Users should eventually be able to:\
- Show or hide supported sections.\
- Reorder supported sections.\
\
Do not implement customization before the basic dashboard works.\
\
### Today's progress\
\
Display the number of habits completed and the number of habits scheduled for today.\
\
Show a completion percentage where meaningful.\
\
Do not include unscheduled habits in today's completion denominator.\
\
If a habit is partially completed, apply a clearly defined and consistent rule rather than silently counting it as fully completed.\
\
## 7. Habit Cards\
\
Habit cards are central to the application.\
\
They should be compact, easy to scan, and quick to interact with.\
\
Each card may display:\
- Habit name.\
- Category.\
- Completion state.\
- Target or measurement.\
- Optional streak information.\
- A quick completion action.\
\
Do not show every possible statistic on every card.\
\
### Interactions\
\
Users should be able to:\
- Mark a habit complete.\
- Undo a completion.\
- Record partial progress where applicable.\
- Open habit details.\
- Edit a habit.\
\
The primary completion action should be easy to use on both desktop and mobile.\
\
Provide clear hover, focus, pressed, and completed states where appropriate.\
\
Do not make the entire card behave unpredictably when it contains multiple controls.\
\
## 8. Habit Types\
\
Support four habit types.\
\
### Boolean\
\
A simple yes-or-no habit.\
\
Examples:\
- Read.\
- Meditate.\
- Take vitamins.\
\
### Numerical\
\
Track a measurable quantity.\
\
Examples:\
- Drink 2 liters of water.\
- Read 20 pages.\
- Complete 30 push-ups.\
\
Users can configure:\
- Unit.\
- Target.\
- Progress amount.\
\
### Duration\
\
Track time spent on an activity.\
\
Examples:\
- Study for 60 minutes.\
- Stretch for 10 minutes.\
\
Users can configure:\
- Time unit.\
- Target duration.\
- Recorded duration.\
\
A timer is optional and should not be required for the initial version.\
\
### Counter\
\
Track the number of occurrences.\
\
Examples:\
- Practice a language three times.\
- Complete five practice questions.\
\
Users can configure:\
- Unit or label.\
- Target count.\
- Current count.\
\
### Habit completion states\
\
Support:\
- Incomplete.\
- Partial.\
- Completed.\
- Skipped.\
\
Define the behavior of each state consistently.\
\
Skipped is a distinct state and must not count as successful completion.\
\
Partial progress should be preserved.\
\
## 9. Habit Creation and Editing\
\
Users should be able to create, edit, archive, and delete habits.\
\
Habit fields should include:\
- Name.\
- Description, optionally.\
- Type.\
- Category.\
- Schedule.\
- Target and unit where applicable.\
- Display order.\
- Optional icon or simple visual identifier.\
\
Avoid making habit creation unnecessarily complicated.\
\
Use sensible defaults and reveal advanced fields only when relevant.\
\
Before deleting a habit, explain the effect on its historical data.\
\
Prefer archiving when users want to stop tracking a habit without losing its history.\
\
Editing a habit must not silently destroy previous records.\
\
## 10. Categories\
\
Provide these default categories:\
- Health.\
- Fitness.\
- School.\
- Productivity.\
- Personal.\
\
Users may create custom categories.\
\
Users should be able to:\
- Assign a habit to a category.\
- Filter or group habits by category.\
- Reorder habits manually.\
\
Category colors should be restrained and optional.\
\
Do not rely on category color alone to communicate meaning.\
\
## 11. Scheduling\
\
Support:\
- Every day.\
- Selected weekdays.\
- A weekly target.\
- A monthly target or schedule.\
- Custom intervals where practical.\
\
The scheduling interface should remain simple.\
\
A habit scheduled for Monday, Wednesday, and Friday should not be treated as missed on Tuesday.\
\
For weekly targets, calculate progress against the configured target.\
\
Clearly define how weekly and monthly periods are determined.\
\
Use the user's local calendar for displaying dates.\
\
Handle date boundaries consistently.\
\
## 12. Streaks\
\
Support:\
- Current streak.\
- Longest streak.\
\
Streak calculations must respect the habit's schedule.\
\
Rules:\
- Unscheduled days do not break a streak.\
- A scheduled day that is not completed breaks the streak according to the defined streak rules.\
- Skipped is not completed.\
- Historical edits must recalculate affected streaks.\
- Weekly-target habits must use their weekly target rather than daily completion logic.\
\
Document the precise rules in the implementation.\
\
Do not use a single simplistic streak algorithm for every habit type.\
\
## 13. Contribution Heatmap\
\
Use a GitHub-inspired contribution heatmap.\
\
Requirements:\
- Show a useful historical range, preferably approximately one year.\
- Use small, consistently sized squares.\
- Represent completion intensity with restrained shades.\
- Work in light and dark themes.\
- Display an appropriate empty state when no history exists.\
- Allow users to select a day.\
- Show a tooltip or detail panel for the selected day.\
- Allow users to inspect historical completion information.\
\
The heatmap should reflect scheduled habits and recorded progress.\
\
Do not use misleading intensity calculations.\
\
The selected day should be visually distinguishable.\
\
On mobile, prioritize legibility and allow horizontal scrolling if necessary.\
\
## 14. Statistics\
\
The product should eventually support all eight of these statistic groups.\
\
1. Daily completion percentage.\
2. Weekly and monthly completion rates.\
3. Current and longest streaks.\
4. Consistency per habit.\
5. Best-performing and lowest-performing habits.\
6. Progress graphs over time.\
7. Total completed habits and historical completions.\
8. Records, milestones, and personal bests.\
\
Statistics must use documented calculation rules.\
\
Do not display fabricated values.\
\
Distinguish between:\
- No data.\
- Zero progress.\
- Missing information.\
\
Graphs should have:\
- Clear labels.\
- Useful date ranges.\
- Readable axes where needed.\
- Responsive layouts.\
- Accessible descriptions or equivalent information.\
\
Use subtle gray gradients where they improve the design.\
\
Avoid unnecessary chart decoration.\
\
## 15. Habit History\
\
Users must be able to inspect past dates and edit historical entries.\
\
They should be able to:\
- Select a date.\
- See the habits scheduled for that date.\
- Inspect their recorded progress.\
- Change completion states.\
- Correct numerical or duration values.\
\
Historical edits must update relevant statistics and streaks.\
\
Preserve original habit information where necessary to interpret older records correctly.\
\
Avoid silently changing past history when a habit's current schedule is edited.\
\
## 16. Data and Persistence\
\
### Initial development\
\
Use demo data during the visual prototype stage.\
\
Demo data must be clearly separated from production persistence.\
\
### Local functionality\
\
Introduce persistent local storage when the relevant module is reached.\
\
Choose storage appropriate to the data and functionality.\
\
Do not store important historical data only in temporary component state.\
\
### Cloud functionality\
\
Eventually support:\
- User accounts.\
- Secure authentication.\
- Cloud persistence.\
- Synchronization between devices.\
- Backups.\
- Data export.\
\
Supabase is the intended cloud backend.\
\
Users must only be able to access their own private data.\
\
Apply appropriate database access controls.\
\
Never expose server secrets in client-side code.\
\
## 17. Offline Support\
\
Offline functionality is an important requirement.\
\
When implemented, users should be able to:\
- View previously cached habits.\
- View available historical records and statistics.\
- Create or edit habits.\
- Record today's progress.\
- Edit historical entries.\
\
Changes should synchronize when connectivity returns.\
\
Requirements:\
- Do not silently discard offline changes.\
- Handle duplicate operations safely.\
- Provide understandable sync status.\
- Handle conflicts explicitly.\
- Preserve data during authentication or synchronization failures.\
\
Use IndexedDB when appropriate.\
\
Do not attempt to build offline synchronization before the local data model and persistence layer are stable.\
\
## 18. Data Export and Backup\
\
Support CSV export of relevant habit and history data.\
\
The export should be useful outside Forma.\
\
Use clear column names and consistent date formats.\
\
Consider a backup and restore mechanism after the primary data model is stable.\
\
Never claim a backup exists unless it has actually been created successfully.\
\
## 19. Notifications\
\
Notifications are optional and should be disabled by default.\
\
If implemented:\
- Let users configure reminders.\
- Explain browser notification permissions.\
- Respect the user's choices.\
- Avoid repeated or intrusive prompts.\
\
Account for the limitations of notifications in iOS web applications.\
\
Do not promise reliable background reminders where the platform cannot guarantee them.\
\
## 20. Privacy and Settings\
\
Settings should eventually support:\
- Theme preference.\
- Dashboard layout.\
- Relevant display preferences.\
- Account management.\
- Data export.\
- Notification preferences.\
- Basic privacy and synchronization information.\
\
Collect as little personal information as practical.\
\
## 21. Empty, Loading, and Error States\
\
Every data-driven screen should handle:\
- Loading.\
- Empty data.\
- Successful operation.\
- Failed operation.\
- Offline operation where relevant.\
\
Empty states should explain the next useful action.\
\
Errors should be understandable and should not silently discard user input.\
\
## 22. Performance\
\
Keep the application responsive.\
\
Avoid:\
- Unnecessary re-renders.\
- Loading large libraries without need.\
- Recalculating extensive historical statistics on every interaction when avoidable.\
- Excessive animation.\
- Overly complex state management.\
\
Optimize only when there is a clear need, but avoid obvious architectural performance problems.\
\
## 23. Initial Release Priorities\
\
Prioritize in this order:\
\
1. Project foundation.\
2. Design system and application shell.\
3. Dashboard UI with demo data.\
4. Habit creation and editing.\
5. Local persistence.\
6. Habit tracking and history.\
7. Scheduling and streak calculations.\
8. Heatmap.\
9. Statistics and graphs.\
10. Cloud authentication and synchronization.\
11. Offline support.\
12. Export, customization, and optional reminders.\
13. Testing, accessibility, and deployment polish.\
\
Do not implement everything at once.\
\
## 24. Definition of Done\
\
A module is complete when:\
- It meets the current task's requirements.\
- It follows this specification.\
- It fits the existing architecture.\
- It works at the required screen sizes.\
- It handles relevant error and empty states.\
- Relevant checks have been run.\
- No unrelated functionality has been broken.\
- Any remaining limitations are documented.d}