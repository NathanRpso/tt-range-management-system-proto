'use client';

import React, { useState } from 'react';

type TopTab = 'support' | 'user-manual' | 'faq';
type ManualSection = 'bays' | 'events' | 'displays' | 'dashboard' | 'overbet' | 'range-settings' | 'support' | 'user-management' | 'profile';

const INTRO = 'The Toptracer Range Management System (from here on out referred to as TRMS) is a tool created to help you as the range operator run your day-to-day business. The features of TRMS and how to use them are outlined below. As long as you have a working internet connection, TRMS runs on all approved browsers (latest version of Chrome, Firefox and Safari). In handhelds, TRMS runs best on the latest version of Chrome.';

const manualSections: { key: ManualSection; label: string }[] = [
  { key: 'bays', label: 'Bays' },
  { key: 'events', label: 'Events' },
  { key: 'displays', label: 'Displays' },
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'overbet', label: 'Over Net' },
  { key: 'range-settings', label: 'Range Settings' },
  { key: 'support', label: 'Support' },
  { key: 'user-management', label: 'User-management' },
  { key: 'profile', label: 'Profile' },
];

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-bold mb-2 mt-5 first:mt-0" style={{ color: '#1e293b' }}>{children}</h2>;
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold mb-1.5 mt-4" style={{ color: '#1e293b' }}>{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm mb-3 leading-relaxed" style={{ color: '#475569' }}>{children}</p>;
}
function UL({ items }: { items: string[] }) {
  return (
    <ul className="mb-3 pl-4 space-y-1">
      {items.map((item, i) => (
        <li key={i} className="text-sm" style={{ color: '#475569', listStyleType: 'disc' }}>{item}</li>
      ))}
    </ul>
  );
}
function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg p-3 mb-3 text-sm" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
      {children}
    </div>
  );
}

function BaysContent() {
  const [openSub, setOpenSub] = useState<string | null>('bay-cards');
  const toggle = (k: string) => setOpenSub(o => o === k ? null : k);
  const subs = [
    {
      key: 'bay-cards', label: 'Bay cards', content: (
        <>
          <P>The bay cards give you an overview of all bays at your range. Each bay card shows the current status of the bay and any active assignment information.</P>
          <P>Bay cards can have three different statuses:</P>
          <div className="space-y-2 mb-3">
            {[
              { label: 'Golfer', color: '#22c55e', desc: 'A bay is in Golfer status when there is an active Toptracer session running in the bay. The timer shown indicates how long the current session has been active.' },
              { label: 'Occupied', color: '#f59e0b', desc: 'A bay is in Occupied status when there is an active assignment but no Toptracer session is currently running. This typically means the golfer has paused or is between shots.' },
              { label: 'Available', color: '#64748b', desc: 'A bay is in Available status when there is no active assignment. The bay is ready to be assigned to a new golfer or group.' },
            ].map(s => (
              <div key={s.label} className="flex gap-3 items-start">
                <span className="text-xs font-bold px-2 py-0.5 rounded mt-0.5 flex-shrink-0" style={{ backgroundColor: s.color + '22', color: s.color }}>{s.label}</span>
                <p className="text-sm" style={{ color: '#475569' }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <P>You can switch between a large grid view and a small grid view using the toggle in the top right of the Bays page. The large grid view shows more detail per bay card, while the small grid view allows you to see more bays at once.</P>
        </>
      )
    },
    {
      key: 'assignment', label: 'Assignments', content: (
        <>
          <H3>Start an assignment</H3>
          <P>You can start an assignment by clicking the "Assign" button on an available bay card. A dialog will appear where you can fill in the following information:</P>
          <UL items={[
            'Party Name – The name of the golfer or group being assigned to the bay.',
            'Time Requested – The duration the golfer expects to use the bay. A suggested end time will be shown.',
            'Notes – Any additional notes about the assignment (optional).',
          ]} />
          <P>Once you click "Complete", the bay status will change to Occupied and the assignment will begin.</P>
          <H3>Edit an assignment</H3>
          <P>To edit an active assignment, click on the bay card to open the assignment details and select "Edit". You can modify the party name, time requested, and notes. Click "Save" to apply the changes.</P>
          <H3>End an assignment</H3>
          <P>To end an assignment, click the red "End" button on the bay card. A confirmation dialog will appear showing the current assignment details including party name, time in bay, and shots hit. Click "End assignment" to confirm.</P>
          <InfoBox>Note: Ending an assignment will also end any active Toptracer session in that bay. The session data will still be saved and visible in the Dashboard.</InfoBox>
          <H3>Sessions</H3>
          <P>A session is automatically created when a golfer starts using Toptracer in a bay. Sessions are linked to assignments and their data — including shots hit, game modes used, and duration — is captured in the Dashboard.</P>
        </>
      )
    },
    {
      key: 'screen-power', label: 'Screen Power', content: (
        <>
          <P>The Screen Power tab allows you to remotely control the power state of all bay screens across your range from a single page.</P>
          <InfoBox>⚠ Turning screens on or off affects all bays simultaneously. You will be asked to confirm this action before it is applied.</InfoBox>
          <H3>Power ON</H3>
          <P>Click the "Power ON" button to turn on all screens at your range. This is useful at the start of the day or when opening the range. The screens will boot up and be ready for golfer sessions.</P>
          <H3>Power OFF</H3>
          <P>Click the "Power OFF" button to turn off all screens. This is intended for end-of-day use or when the range is closing. Any active sessions will be ended before the screens power off.</P>
          <H3>Screen Status</H3>
          <P>The Screen Status panel shows a real-time count of screens in each state:</P>
          <UL items={['ON – Screens that are fully powered and operational.', 'IN PROGRESS – Screens that are in the process of powering on or off.', 'OFF – Screens that are powered off.']} />
          <H3>Troubleshooting</H3>
          <P>If a screen is stuck in IN PROGRESS or is unresponsive, try the following steps:</P>
          <UL items={[
            'Wait a few minutes — screen transitions can take time depending on network conditions.',
            'Check the physical connection to the bay unit.',
            'Use the individual bay card to attempt a screen restart.',
            'Contact Toptracer support if the issue persists.',
          ]} />
        </>
      )
    },
  ];

  return (
    <div>
      {subs.map(sub => (
        <div key={sub.key} className="mb-2 border rounded-lg overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold"
            style={{ backgroundColor: openSub === sub.key ? '#f8fafc' : '#fff', color: '#1e293b' }}
            onClick={() => toggle(sub.key)}
          >
            {sub.label}
            <span style={{ color: '#94a3b8', transform: openSub === sub.key ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
          </button>
          {openSub === sub.key && (
            <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: '#f1f5f9' }}>
              {sub.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function EventsContent() {
  const [openSub, setOpenSub] = useState<string | null>('overview');
  const toggle = (k: string) => setOpenSub(o => o === k ? null : k);
  const subs = [
    {
      key: 'overview', label: 'Overview', content: (
        <>
          <P>The Events page gives you a complete overview of all events at your range. Events are displayed in a calendar view, making it easy to see what is scheduled and when.</P>
          <P>You can navigate between months using the arrow buttons, or jump to today using the "Today" button. The month and year are shown prominently at the top of the calendar.</P>
          <P>Events appear on the calendar on their scheduled start date. Clicking an event opens its details.</P>
        </>
      )
    },
    {
      key: 'create', label: 'Create an event', content: (
        <>
          <P>To create a new event, click the "+ Create event" button in the top right of the Events page. This opens the event creation form.</P>
          <H3>Event details</H3>
          <UL items={[
            'Event name – Required. Maximum 40 characters.',
            'Start date and time – When the event begins.',
            'End date and time – When the event ends.',
            'Host – Pre-filled with your range name (cannot be changed).',
            'Co-host – Optional co-host name, maximum 60 characters.',
            'Website – Optional URL for the event.',
            'Terms & Conditions URL – Optional link to T&C page.',
            'Prizes – Optional prize description, maximum 200 characters.',
            'Description – Optional event description, maximum 400 characters.',
          ]} />
          <H3>Game settings</H3>
          <UL items={[
            'Game mode – Select the Toptracer game mode for the event (e.g. Target, Top Drive, Around the World).',
            'Course – Select the virtual course if applicable.',
            'Unit – Yards or metres.',
            'Game rules – Set specific rules for the competition.',
          ]} />
          <H3>Leaderboard categories</H3>
          <P>You can add one or more leaderboard categories to your event. Each category can be configured with:</P>
          <UL items={['Category name', 'Gender filter', 'Age group filter', 'Skill level filter']} />
          <P>Click "+ Add category" to add additional categories. Each category will appear as a separate leaderboard tab in the event.</P>
          <H3>Sponsors</H3>
          <P>You can upload sponsor logos to display on the event leaderboard. Supported formats: JPG, PNG.</P>
        </>
      )
    },
    {
      key: 'publishing', label: 'Publishing an event', content: (
        <>
          <P>After creating an event it will be in draft state. To make it visible to players and display it on leaderboard screens, you need to publish it.</P>
          <P>To publish an event, open the event details and click "Publish event". Once published:</P>
          <UL items={[
            'The event leaderboard becomes visible to players.',
            'Players can register and begin submitting scores.',
            'The event appears in the Displays content library.',
            'You can no longer change the game mode or course.',
          ]} />
          <InfoBox>Note: You can still edit the event name, description, prizes, and categories after publishing. You cannot change the game settings once the event is published.</InfoBox>
        </>
      )
    },
    {
      key: 'players', label: 'Registered players & Results', content: (
        <>
          <H3>Registered players</H3>
          <P>The Registered players tab shows all players who have signed up for the event. You can see their name, email, registration date, and leaderboard category. Players can be removed from the event from this tab if needed.</P>
          <H3>Results</H3>
          <P>The Results tab shows the live leaderboard for the event. Results are updated in real-time as players complete their rounds. You can view scores by category and export the results as a CSV or XLSX file.</P>
        </>
      )
    },
  ];
  return (
    <div>
      {subs.map(sub => (
        <div key={sub.key} className="mb-2 border rounded-lg overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold"
            style={{ backgroundColor: openSub === sub.key ? '#f8fafc' : '#fff', color: '#1e293b' }}
            onClick={() => toggle(sub.key)}
          >
            {sub.label}
            <span style={{ color: '#94a3b8', transform: openSub === sub.key ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
          </button>
          {openSub === sub.key && (
            <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: '#f1f5f9' }}>
              {sub.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function DisplaysContent() {
  const [openSub, setOpenSub] = useState<string | null>('overview');
  const toggle = (k: string) => setOpenSub(o => o === k ? null : k);
  const subs = [
    {
      key: 'overview', label: 'Overview', content: (
        <>
          <P>The Displays page allows you to manage the screens connected to your range. You can add, configure, and monitor all display screens from this page.</P>
          <P>To add a new display, click "+ Add display" in the top right corner. The setup process has two steps:</P>
          <UL items={[
            'Step 1 – On the TV or screen you want to add, open a browser and navigate to the URL shown in the setup dialog. This loads the display pairing page.',
            'Step 2 – Enter the 6-character code shown on the TV screen into the code field in TRMS. Give the display a name and click "Add display".',
          ]} />
        </>
      )
    },
    {
      key: 'compatibility', label: 'Display compatibility', content: (
        <>
          <P>TRMS supports two types of display configurations:</P>
          <H3>Kiosk displays</H3>
          <P>Kiosk displays are standalone screens (e.g. TVs or monitors) that show leaderboards, event information, or media content. They are connected to TRMS via a browser session and display content continuously.</P>
          <H3>Monitor displays</H3>
          <P>Monitor displays are managed through the Screen Power feature on the Bays page. These are the individual bay screens used by golfers during play.</P>
          <InfoBox>TRMS display features are best supported on the latest version of Chrome. For kiosk screens, we recommend setting Chrome as the default browser and enabling kiosk mode for a full-screen experience.</InfoBox>
        </>
      )
    },
    {
      key: 'content', label: 'Content', content: (
        <>
          <P>The Content tab shows all available content that can be shown on your display screens. Content is organized by type:</P>
          <H3>Events</H3>
          <P>Event leaderboards from published events at your range. Once an event is published, its leaderboard content is automatically available here. You can assign event leaderboards to any connected display.</P>
          <H3>Cards</H3>
          <P>Branded marketing cards with Toptracer Range imagery and messaging. These are provided by Toptracer and can be displayed between other content.</P>
          <H3>Media</H3>
          <P>Custom images or slideshows that you have uploaded. Supported formats are JPG and PNG. You can create slideshows by grouping multiple images together.</P>
          <H3>Leaderboard options</H3>
          <P>Each leaderboard display supports two visual themes — Light and Dark. You can also choose whether to show all categories or a specific category on a given screen.</P>
          <H3>Slideshow</H3>
          <P>You can configure a display to cycle through multiple content items automatically. Set the duration for each item and the display will rotate through the playlist on a loop.</P>
          <H3>Range display</H3>
          <P>The Range Display shows general range information including bay availability. This is useful for lobby or entrance screens where golfers can see which bays are open.</P>
        </>
      )
    },
  ];
  return (
    <div>
      {subs.map(sub => (
        <div key={sub.key} className="mb-2 border rounded-lg overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold"
            style={{ backgroundColor: openSub === sub.key ? '#f8fafc' : '#fff', color: '#1e293b' }}
            onClick={() => toggle(sub.key)}
          >
            {sub.label}
            <span style={{ color: '#94a3b8', transform: openSub === sub.key ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
          </button>
          {openSub === sub.key && (
            <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: '#f1f5f9' }}>
              {sub.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function DashboardContent() {
  const [openSub, setOpenSub] = useState<string | null>('overview');
  const toggle = (k: string) => setOpenSub(o => o === k ? null : k);
  const subs = [
    {
      key: 'overview', label: 'Overview', content: (
        <>
          <P>The Dashboard gives you a high-level view of range performance over a selected time period. It is divided into several widgets, each showing a different aspect of range activity.</P>
          <P>At the top of the Dashboard you can set the date range for all widgets using the Start date and End date pickers, or use the preset period dropdown (e.g. Last 30 days, Last 7 days).</P>
        </>
      )
    },
    {
      key: 'information', label: 'Information & Download', content: (
        <>
          <H3>Information</H3>
          <P>Each widget has more information connected to it and the icon looks like this: ⓘ. This information can be accessed by clicking the information icon that is located at the top left of each widget. In the information, you get more information about what data is used in each widget and how it is defined.</P>
          <H3>Download</H3>
          <P>Both data and graphs can be downloaded by clicking the download icon at the top left of each widget — a download menu will appear with the following options:</P>
          <UL items={[
            'Image → PNG – Downloads a snapshot of the graph as a PNG image.',
            'Image → JPG – Downloads a snapshot of the graph as a JPG image.',
            'Image → PDF – Downloads a snapshot of the graph as a PDF.',
            'Data → CSV – Downloads the raw data from the selected time period as a CSV file.',
            'Data → XLSX – Downloads the raw data from the selected time period as an Excel file.',
          ]} />
          <InfoBox>Exception: The quick indicators do not have a download option. All of the data from the quick indicators can be downloaded from the Detailed View widget instead.</InfoBox>
          <P>If the data is downloaded from a widget with tabs (e.g. Total shots / Pace / Time spent), all of the tabs' data will be included in the download.</P>
        </>
      )
    },
    {
      key: 'quick-indicators', label: 'Quick indicators', content: (
        <>
          <P>The quick indicators at the top of the Dashboard show the most important performance metrics for the selected period at a glance:</P>
          <UL items={[
            'Total shots – The total number of shots hit across all bays during the period.',
            'Sessions – The total number of individual play sessions.',
            'Avg. session length – The average duration of a session in minutes.',
            'Usage rate – The percentage of time bays were in active use compared to total available time.',
          ]} />
          <P>Below each indicator you will see a comparison to the previous equivalent period (e.g. if you are viewing the last 30 days, it compares to the 30 days before that). A green arrow indicates improvement; a red arrow indicates a decline.</P>
        </>
      )
    },
    {
      key: 'peak-activity', label: 'Peak activity', content: (
        <>
          <P>The Peak activity widget shows a heat map of range usage by day of week and hour of day. Each cell represents one hour on one day of the week.</P>
          <P>Darker blue cells indicate higher activity (more shots hit). Lighter cells indicate lower activity. This helps you identify which days and times are most popular so you can plan staffing and promotions accordingly.</P>
          <UL items={[
            'Rows represent days of the week (Monday through Sunday).',
            'Columns represent hours of the day (0:00 through 23:00).',
            'The colour scale at the bottom shows the range from minimum to maximum shots in the period.',
          ]} />
          <P>You can adjust the contrast of the heat map using the contrast toggle, and change the time interval grouping using the intervals slider.</P>
        </>
      )
    },
    {
      key: 'game-modes', label: 'Game modes', content: (
        <>
          <P>The Game modes widget shows the breakdown of shots across the different Toptracer game modes available at your range. Each game mode is shown as a bar with its total contribution.</P>
          <P>You can switch between three views using the tabs:</P>
          <UL items={[
            'Total shots – The number of shots hit in each game mode.',
            'Pace – The average pace of play (shots per minute) in each game mode.',
            'Time spent – The total time golfers spent playing each game mode.',
          ]} />
        </>
      )
    },
    {
      key: 'bay-activity', label: 'Bay activity', content: (
        <>
          <P>The Bay activity widget shows how many shots were hit in each individual bay during the selected period. Bays are displayed on the horizontal axis and shot counts on the vertical axis.</P>
          <P>This widget helps you identify underperforming bays or equipment issues. If a bay shows significantly fewer shots than others, it may indicate a technical problem or that the bay was frequently unavailable.</P>
          <P>Use the left and right scroll controls to navigate across all bays if your range has more bays than fit in the visible area.</P>
        </>
      )
    },
    {
      key: 'detailed-view', label: 'Detailed view', content: (
        <>
          <P>The Detailed view widget shows a line chart of the selected metric over time. You can switch between six metrics using the tabs:</P>
          <UL items={[
            'Total shots – Total shots hit per day.',
            'Sessions – Number of sessions per day.',
            'Pace – Average shots per minute per day.',
            'Players / session – Average number of players per session per day.',
            'Avg. session length – Average session duration in minutes per day.',
            'Usage rate – Bay utilisation percentage per day.',
          ]} />
          <P>Hovering over any point on the chart shows the exact value for that date. The Detailed view is also the download source for all quick indicator data.</P>
        </>
      )
    },
  ];
  return (
    <div>
      {subs.map(sub => (
        <div key={sub.key} className="mb-2 border rounded-lg overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold"
            style={{ backgroundColor: openSub === sub.key ? '#f8fafc' : '#fff', color: '#1e293b' }}
            onClick={() => toggle(sub.key)}
          >
            {sub.label}
            <span style={{ color: '#94a3b8', transform: openSub === sub.key ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
          </button>
          {openSub === sub.key && (
            <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: '#f1f5f9' }}>
              {sub.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function OverBetContent() {
  return (
    <>
      <H2>Over Net</H2>
      <P>The Over Net page shows a log of all shots that have passed over the boundary net of your range. This data helps you monitor safety and identify bays or players who are consistently hitting beyond the range boundary.</P>
      <H3>Filter</H3>
      <P>You can filter the Over Net data by:</P>
      <UL items={[
        'Period – Choose a preset time range (e.g. This month, Last 7 days) or set a custom Start date and End date.',
        'Bays – Filter to show only over-net shots from specific bays.',
        'Over net height – Filter by the height (in yards) at which the shot crossed the boundary.',
      ]} />
      <H3>Shot table</H3>
      <P>The table on the left lists every recorded over-net shot with the following columns:</P>
      <UL items={[
        'Bay ID – The bay number from which the shot was hit.',
        'Time – The exact date and time the shot was recorded.',
        'Over net height [yard] – The height above the net boundary at which the shot crossed, measured in yards.',
      ]} />
      <P>Each column can be sorted ascending or descending by clicking the column header.</P>
      <H3>Net visualization</H3>
      <P>The visualization on the right shows a bird's-eye view of the range boundary. The curved line represents the net boundary. Coloured markers in the field represent target flags at various distances.</P>
      <P>You can toggle between two views:</P>
      <UL items={[
        'Heat map – Shows clusters of over-net shots along the boundary. Larger circles with higher numbers indicate more shots at that location.',
        'Single shots – Shows each individual shot as a red dot along the boundary at the point where it crossed.',
      ]} />
      <P>Use the zoom controls (+ and −) to zoom in on a specific area of the visualization.</P>
    </>
  );
}

function RangeSettingsContent() {
  const [openSub, setOpenSub] = useState<string | null>('general');
  const toggle = (k: string) => setOpenSub(o => o === k ? null : k);
  const subs = [
    {
      key: 'general', label: 'General', content: (
        <>
          <P>The General settings tab allows you to configure core information about your range:</P>
          <UL items={[
            'Range name – The display name for your range shown throughout TRMS.',
            'Language – The default language for your range portal.',
            'Currency – The currency used for any pricing displayed in the system.',
            'Units – Choose between yards and metres for distance measurements.',
            'Time zone – Set the correct time zone to ensure accurate session timestamps.',
          ]} />
          <P>Click "Save changes" after making any edits to apply them.</P>
        </>
      )
    },
    {
      key: 'operating-hours', label: 'Operating hours', content: (
        <>
          <P>Set the operating hours for your range for each day of the week. Operating hours are used by the Dashboard to calculate accurate utilisation rates — only time within your operating hours is counted as available bay time.</P>
          <P>For each day you can:</P>
          <UL items={[
            'Toggle the day on or off (e.g. mark Mondays as closed).',
            'Set the opening time.',
            'Set the closing time.',
          ]} />
          <InfoBox>Tip: Accurate operating hours are essential for meaningful usage rate data in the Dashboard. Make sure to update these whenever your range schedule changes seasonally.</InfoBox>
        </>
      )
    },
    {
      key: 'features', label: 'Features', content: (
        <>
          <P>The Features tab lets you enable or disable optional TRMS features for your range:</P>
          <UL items={[
            'Coaching – Enable or disable the Toptracer coaching integration. When enabled, coaching sessions can be managed through the bay system.',
            'Events – Enable or disable the Events module. When disabled, the Events section will not appear in the navigation.',
            'Over Net monitoring – Enable or disable over-net shot tracking for your range.',
            'Player registration – Allow or prevent players from self-registering accounts linked to your range.',
          ]} />
          <P>Feature changes take effect immediately after saving. Disabling a feature hides it from the navigation but does not delete any existing data.</P>
        </>
      )
    },
    {
      key: 'bays-config', label: 'Bay types', content: (
        <>
          <P>Your range may have different types of bays depending on your physical layout and Toptracer configuration:</P>
          <H3>Extended bays</H3>
          <P>Extended bays have the full suite of Toptracer features available, including all game modes, shot tracking, and leaderboard participation.</P>
          <H3>Limited bays</H3>
          <P>Limited bays have a reduced feature set. They support basic shot tracking but may not support all game modes or events. Limited bays typically correspond to bays with older hardware or restricted Toptracer licences.</P>
          <H3>Shoulder bays</H3>
          <P>Shoulder bays are bays at the edges of the range that have restricted shot angle tracking due to their position relative to the camera system. Data from shoulder bays may be slightly less accurate for shots hit at extreme angles.</P>
        </>
      )
    },
  ];
  return (
    <div>
      {subs.map(sub => (
        <div key={sub.key} className="mb-2 border rounded-lg overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold"
            style={{ backgroundColor: openSub === sub.key ? '#f8fafc' : '#fff', color: '#1e293b' }}
            onClick={() => toggle(sub.key)}
          >
            {sub.label}
            <span style={{ color: '#94a3b8', transform: openSub === sub.key ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
          </button>
          {openSub === sub.key && (
            <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: '#f1f5f9' }}>
              {sub.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SupportSectionContent() {
  return (
    <>
      <H2>Support</H2>
      <P>If you encounter any issues with TRMS that are not covered in this User Manual, Toptracer Range support is available to help.</P>
      <H3>Contact support</H3>
      <P>You can reach Toptracer Range support through the following channels:</P>
      <UL items={[
        'Email – Send a detailed description of your issue to the Toptracer support team.',
        'Phone – Call the support line during business hours for urgent issues.',
        'In-portal chat – Use the live chat widget (available in some regions) for real-time help.',
      ]} />
      <H3>Before contacting support</H3>
      <P>To help the support team resolve your issue as quickly as possible, please have the following information ready:</P>
      <UL items={[
        'Your range name and location.',
        'A description of the issue including what you were trying to do and what happened instead.',
        'The approximate time the issue occurred.',
        'Screenshots or screen recordings if possible.',
        'Which browser and version you are using.',
      ]} />
      <InfoBox>TRMS is supported on the latest versions of Chrome, Firefox, and Safari. If you are experiencing display issues, try switching to the latest version of Chrome first.</InfoBox>
    </>
  );
}

function UserManagementContent() {
  const [openSub, setOpenSub] = useState<string | null>('overview');
  const toggle = (k: string) => setOpenSub(o => o === k ? null : k);
  const subs = [
    {
      key: 'overview', label: 'Overview', content: (
        <>
          <P>The User Management page shows all players who have created a Toptracer Range account linked to your range. You can search, sort, and view details for each registered user.</P>
          <P>The table displays each player's name, email address, registration date, and play statistics including total shots hit and sessions played at your range.</P>
        </>
      )
    },
    {
      key: 'create', label: 'Create an account', content: (
        <>
          <P>Players can create a Toptracer Range account in two ways:</P>
          <UL items={[
            'Self-registration – Players can register themselves through the Toptracer Range app or website using their email address.',
            'Google login – Players can sign in using their existing Google account, which will be linked to a Toptracer Range account.',
          ]} />
          <P>Once registered, players can track their personal shot history, participate in events, and view their performance data across visits.</P>
        </>
      )
    },
    {
      key: 'edit', label: 'Edit a user', content: (
        <>
          <P>To edit a user's information, find them in the User Management table and click their name or the edit icon. You can update the following:</P>
          <UL items={[
            'Display name',
            'Email address',
            'Role / permission level (if applicable to your range setup)',
          ]} />
          <P>Click "Save" to apply any changes. The user will see the updated information on their next login.</P>
        </>
      )
    },
    {
      key: 'remove', label: 'Remove a user', content: (
        <>
          <P>To remove a user from your range, locate them in the User Management table and click the remove icon or select "Remove user" from the options menu.</P>
          <P>You will be asked to confirm the action. Once removed:</P>
          <UL items={[
            'The player will no longer appear in your User Management list.',
            'Their historical session data will still be included in your Dashboard statistics.',
            'They will not be able to participate in future events at your range until re-registered.',
          ]} />
          <InfoBox>Note: Removing a user from your range does not delete their Toptracer account. They can still use Toptracer at other ranges.</InfoBox>
        </>
      )
    },
    {
      key: 'export', label: 'Export', content: (
        <>
          <P>You can export the full user list from the User Management page as a CSV or XLSX file. The export includes all visible columns: name, email, registration date, total shots, and total sessions.</P>
          <P>To export, click the "Export" button in the top right of the User Management page and select your preferred format.</P>
        </>
      )
    },
  ];
  return (
    <div>
      {subs.map(sub => (
        <div key={sub.key} className="mb-2 border rounded-lg overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold"
            style={{ backgroundColor: openSub === sub.key ? '#f8fafc' : '#fff', color: '#1e293b' }}
            onClick={() => toggle(sub.key)}
          >
            {sub.label}
            <span style={{ color: '#94a3b8', transform: openSub === sub.key ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
          </button>
          {openSub === sub.key && (
            <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: '#f1f5f9' }}>
              {sub.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProfileContent() {
  return (
    <>
      <H2>Profile</H2>
      <P>You can find your profile page by clicking on your name in the bottom left corner of the sidebar. On this page you can:</P>
      <UL items={[
        'View your e-mail address linked to your TRMS account.',
        'Sign out of TRMS.',
        'Change your language preferences.',
      ]} />
      <InfoBox>Changing the language will only affect your account, so you do not have to use the same language as your colleagues. Please also note that the language in TRMS does not affect the language shown on the bay screens.</InfoBox>
      <H3>Switching from Google login to Toptracer login</H3>
      <P>If you previously used Google to sign in and now choose Toptracer login, the setup will vary depending on whether your email is already linked to another Toptracer product.</P>
      <P><strong>If your Google email is linked to a Toptracer product:</strong></P>
      <UL items={[
        'Select "Continue with Toptracer".',
        'Enter your Google-associated email on the login page.',
        'Click "Continue".',
        'Use the same password you use for other Toptracer products.',
      ]} />
      <P><strong>If your Google email is not linked to a Toptracer account:</strong></P>
      <UL items={[
        'Select "Continue with Toptracer".',
        'Enter your Google-associated email on the login page.',
        'Create a password.',
        'Enter your name to complete setup.',
        'You may be asked to verify your email before accessing the system.',
        'Your Google email is now linked to a new Toptracer account.',
      ]} />
    </>
  );
}

const faqItems = [
  {
    q: 'How do I assign a bay to a golfer?',
    a: 'Click the "Assign" button on an available bay card on the Bays page. Fill in the Party Name, select the time requested, add any notes, then click "Complete".',
  },
  {
    q: 'How do I turn screen power on or off?',
    a: 'Navigate to Bays → Screen Power tab. Click "Power ON" to turn on all screens or "Power OFF" to turn them all off. You will be asked to confirm before the action is applied.',
  },
  {
    q: 'What is the difference between Golfer, Occupied, and Available status?',
    a: 'Available = no active assignment. Occupied = active assignment but no Toptracer session running. Golfer = active assignment with a live Toptracer session in progress.',
  },
  {
    q: 'How do I create an event?',
    a: 'Go to the Events page and click "+ Create event". Fill in the event details, game settings, and leaderboard categories, then click "Create event". You will need to publish the event separately to make it visible to players.',
  },
  {
    q: 'Can I edit an event after publishing?',
    a: 'Yes, but with restrictions. After publishing you can still edit the name, description, prizes, and categories. You cannot change the game mode, course, or other game settings once the event is published.',
  },
  {
    q: 'How do I add a display screen?',
    a: 'Go to Displays and click "+ Add display". On the TV or screen, open a browser and navigate to the URL shown in Step 1. Then enter the 6-character code displayed on the TV into TRMS to complete the pairing.',
  },
  {
    q: 'Why does the quick indicators widget not have a download button?',
    a: 'The quick indicators data can be downloaded from the Detailed View widget instead. Open the Detailed View, select the relevant metric tab, and use the download icon to export as CSV or XLSX.',
  },
  {
    q: 'How is the Usage Rate calculated?',
    a: 'Usage Rate is the percentage of time bays were actively in use compared to the total available bay time within your configured operating hours. Make sure your operating hours in Range Settings are accurate for correct results.',
  },
  {
    q: 'How do I change the language in TRMS?',
    a: 'Click your name in the bottom left of the sidebar to open your Profile. Select your preferred language from the language dropdown. This setting only affects your account and does not change the language on bay screens.',
  },
  {
    q: 'What browsers does TRMS support?',
    a: 'TRMS runs on all approved browsers — the latest versions of Chrome, Firefox, and Safari. On handheld devices, TRMS runs best on the latest version of Chrome.',
  },
  {
    q: 'How do I remove a player from my range?',
    a: 'Go to User Management, find the player in the table, and click the remove icon or select "Remove user". Confirm the action. Note that this does not delete their Toptracer account — it only removes them from your range.',
  },
  {
    q: 'What does the Over Net page show?',
    a: "The Over Net page logs all shots that have passed over your range boundary net. You can filter by date range, bay, and height. The visualization shows a bird's-eye view of where shots crossed the boundary — useful for safety monitoring.",
  },
];

function SectionContent({ section }: { section: ManualSection }) {
  switch (section) {
    case 'bays': return <BaysContent />;
    case 'events': return <EventsContent />;
    case 'displays': return <DisplaysContent />;
    case 'dashboard': return <DashboardContent />;
    case 'overbet': return <OverBetContent />;
    case 'range-settings': return <RangeSettingsContent />;
    case 'support': return <SupportSectionContent />;
    case 'user-management': return <UserManagementContent />;
    case 'profile': return <ProfileContent />;
  }
}

export default function SupportPage() {
  const [topTab, setTopTab] = useState<TopTab>('user-manual');
  const [activeSection, setActiveSection] = useState<ManualSection>('bays');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Top tab bar */}
      <div className="border-b bg-white" style={{ borderColor: '#e2e8f0' }}>
        <div className="flex items-center gap-0 px-6">
          {([
            { key: 'support', label: 'Support' },
            { key: 'user-manual', label: 'User Manual' },
            { key: 'faq', label: 'Frequently Asked Questions' },
          ] as { key: TopTab; label: string }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setTopTab(tab.key)}
              className="px-5 py-4 text-sm font-medium border-b-2 transition-colors"
              style={{
                borderBottomColor: topTab === tab.key ? '#0077cc' : 'transparent',
                color: topTab === tab.key ? '#0077cc' : '#64748b',
                backgroundColor: 'transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Support tab */}
      {topTab === 'support' && (
        <div className="p-6 max-w-2xl">
          <h1 className="text-lg font-bold mb-2" style={{ color: '#1e293b' }}>Contact Support</h1>
          <P>If you need help with TRMS that isn't covered in the User Manual, our support team is here to help.</P>
          <div className="space-y-3 mt-4">
            {[
              { icon: '✉', title: 'Email support', desc: 'Send us a detailed description of your issue and we\'ll get back to you as soon as possible.', action: 'Send email' },
              { icon: '📞', title: 'Phone support', desc: 'Call our support line during business hours for urgent issues.', action: 'View number' },
              { icon: '💬', title: 'Live chat', desc: 'Chat with a support agent in real time (available during business hours).', action: 'Start chat' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-xl border p-4 flex items-start gap-4" style={{ borderColor: '#e2e8f0' }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm mb-0.5" style={{ color: '#1e293b' }}>{item.title}</div>
                  <div className="text-sm mb-2" style={{ color: '#64748b' }}>{item.desc}</div>
                  <button className="text-sm font-medium" style={{ color: '#0077cc' }}>{item.action} →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Manual tab */}
      {topTab === 'user-manual' && (
        <div className="flex" style={{ minHeight: 'calc(100vh - 57px)' }}>
          {/* Left sidebar nav */}
          <div className="flex-shrink-0 border-r bg-white" style={{ width: 220, borderColor: '#e2e8f0' }}>
            <div className="py-3">
              {manualSections.map(s => (
                <button
                  key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  className="w-full text-left px-5 py-2.5 text-sm transition-colors"
                  style={{
                    backgroundColor: activeSection === s.key ? '#eff6ff' : 'transparent',
                    color: activeSection === s.key ? '#0077cc' : '#475569',
                    fontWeight: activeSection === s.key ? 600 : 400,
                    borderRight: activeSection === s.key ? '2px solid #0077cc' : '2px solid transparent',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-auto p-8" style={{ maxWidth: 760 }}>
            {/* Intro — only on first section */}
            {activeSection === 'bays' && (
              <div className="mb-6 p-4 rounded-xl border" style={{ borderColor: '#e2e8f0', backgroundColor: '#fff' }}>
                <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{INTRO}</p>
              </div>
            )}
            <h2 className="text-base font-bold mb-4" style={{ color: '#1e293b' }}>
              {manualSections.find(s => s.key === activeSection)?.label}
            </h2>
            <SectionContent section={activeSection} />
          </div>
        </div>
      )}

      {/* FAQ tab */}
      {topTab === 'faq' && (
        <div className="p-6" style={{ maxWidth: 760 }}>
          <h1 className="text-lg font-bold mb-1" style={{ color: '#1e293b' }}>Frequently Asked Questions</h1>
          <p className="text-sm mb-5" style={{ color: '#64748b' }}>Quick answers to the most common questions about TRMS.</p>
          <div className="space-y-2">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
                <button
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left text-sm font-semibold"
                  style={{ color: '#1e293b' }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {item.q}
                  <span style={{ color: '#94a3b8', transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: 12 }}>▾</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm border-t" style={{ color: '#475569', borderColor: '#f1f5f9' }}>
                    <div className="pt-3">{item.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
