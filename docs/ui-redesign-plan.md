# AdoptDontShop — Complete UI/UX Redesign Plan

## Vision

Transform AdoptDontShop from an **adoption portal with community features** into a **pet social media platform with adoption built in**. Think **Reddit's community model** + **WhatsApp's group chat** + **Petfinder's adoption tools**.

---

## Current State vs Target State

| Aspect | Current 😐 | Target 🎯 |
|--------|-----------|-----------|
| **Identity** | Adoption portal with blog | Pet social platform |
| **Homepage** | Feed with no search, loose UX | Reddit-style feed with search, communities |
| **Groups** | Separate tab, disconnected | "Communities" integrated everywhere |
| **Chat** | Single group chat per group | WhatsApp-style: community → multiple chat rooms |
| **Navigation** | Traditional navbar | Left sidebar (desktop) + drawer (mobile) |
| **Mobile** | Web-responsive | PWA-first + native shell |

---

## Part 1: Information Architecture

### Rename: "Groups" → "Communities"

The word "Community" better conveys the Reddit/subreddit concept:

```
Communities (formerly "Groups")
├── Delhi Pet Lovers          ← a community (like r/DelhiPets)
│   ├── Posts                 ← community feed
│   ├── Chat Rooms            ← WhatsApp-style multiple rooms
│   │   ├── General Chat
│   │   ├── Adoption Queries
│   │   └── Lost & Found Alerts
│   ├── Members
│   └── About / Rules
├── Golden Retriever Club
├── Cat Rescue India
└── ...
```

### Route Map

| Route | Purpose |
|-------|---------|
| `/` | Home feed (all posts across communities) |
| `/explore` | Discover communities + trending |
| `/c/[slug]` | Community page (posts, chat rooms, members) |
| `/c/[slug]/chat/[room]` | Specific chat room |
| `/browse` | Pet adoption listings |
| `/messages` | Direct messages (1:1) |
| `/welcome` | Landing page (preserved) |
| `/create` | Create a post (select community) |

---

## Part 2: Desktop Layout — Left Sidebar Navigation

Replace the traditional top navbar with a **persistent left sidebar** (like Reddit/Discord):

### Wireframe

![Desktop wireframe showing left sidebar navigation, center feed, and right widgets](C:/Users/mouhu/.gemini/antigravity/brain/2d77792f-d379-46a2-b6a6-25cfef5e0973/desktop_wireframe_1776075120264.png)

### Left Sidebar (240px fixed)

```
┌─────────────────────┐
│ 🐾 AdoptDontShop    │  ← Logo
├─────────────────────┤
│ 🔍 Search...        │  ← Global search bar
├─────────────────────┤
│ 🏠 Home             │  ← Feed from all communities
│ 🧭 Explore          │  ← Discover communities
│ 🐕 Browse Pets      │  ← Adoption listings
│ 💬 Messages (3)     │  ← DMs with unread badge
│ 🔔 Notifications    │  ← Activity feed
├─────────────────────┤
│ MY COMMUNITIES      │  ← Section header
│ 🟢 Delhi Pet Lovers │
│ 🟢 Cat Rescue India │
│ 🟢 Training Tips    │
│ + Create Community  │
├─────────────────────┤
│ 👤 Profile / Login  │  ← Bottom of sidebar
│ ⚙️ Settings         │
└─────────────────────┘
```

### Center Content Area

- Full-width feed with **search bar at top**
- **Create Post bar** (Reddit-style input: "What's on your mind?")
- **Horizontal community pills** for quick filtering
- Post cards in **list view** (default) or grid view toggle

### Right Sidebar (320px, hidden on tablet)

- **Trending Communities** widget
- **Pets Needing Homes** mini cards
- **Popular Topics** tag pills
- **Quick Links** (List a Pet, About, Welcome page)

---

## Part 3: Mobile Layout

### Wireframe

![Mobile wireframe showing top bar, community pills, feed, and bottom nav](C:/Users/mouhu/.gemini/antigravity/brain/2d77792f-d379-46a2-b6a6-25cfef5e0973/mobile_wireframe_1776075151603.png)

### Top Bar (compact)

```
┌──────────────────────────────┐
│ ☰  AdoptDontShop  🔍 🔔     │
└──────────────────────────────┘
```

- **☰** opens a drawer with full navigation (same as desktop sidebar)
- **🔍** opens search overlay
- **🔔** notifications

### Content Area

- **Horizontal community pills** (scrollable: All, Delhi Pets, Cat Rescue...)
- **Feed** in list view (compact cards)
- Pull-to-refresh

### Bottom Navigation (5 tabs)

```
┌──────────────────────────────────────┐
│  🏠    🧭    ✏️    💬    👤         │
│ Home  Explore Create Chat   Me      │
└──────────────────────────────────────┘
```

> [!IMPORTANT]
> The center **Create** button should be a raised FAB-style button (stands out visually). "Chat" consolidates both DMs and community chats. "Explore" combines community discovery + pet browsing.

---

## Part 4: Community Pages (Subreddit-style)

### Wireframe

![Community page wireframe with banner, tabs, and chat preview](C:/Users/mouhu/.gemini/antigravity/brain/2d77792f-d379-46a2-b6a6-25cfef5e0973/community_wireframe_1776075187910.png)

### Community Detail Page (`/c/[slug]`)

```
┌─────────────────────────────────────┐
│ [Banner Image]                      │
│ 🟢 Delhi Pet Lovers    [Join]       │
│ 2.4K members · Created Jan 2025    │
│ A community for pet lovers in Delhi │
├─────────────────────────────────────┤
│ Posts | Chat Rooms | Members | About│
├─────────────────────────────────────┤
│                                     │
│ [Feed / Chat Rooms / Members list]  │
│                                     │
└─────────────────────────────────────┘
```

### Chat Rooms (WhatsApp Communities Model)

Each community can have **multiple chat rooms** instead of a single group chat:

```
Chat Rooms tab:
┌───────────────────────────────────┐
│ 💬 General Chat        12 online │
│ 🐕 Adoption Queries     5 online │
│ 🔍 Lost & Found Alerts  3 online │
│ + Create Chat Room (admin only)  │
└───────────────────────────────────┘
```

Clicking a room opens a **full-screen chat** (WhatsApp-style):
- Messages with sender names + avatars
- Typing indicators
- Image/media sharing
- Reply-to-message threading

### Database Changes Required

```sql
-- New table: chat_rooms (replacing single conversation per group)
CREATE TABLE chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    name TEXT NOT NULL,              -- "General Chat", "Adoption Queries"
    description TEXT,
    icon TEXT DEFAULT '💬',
    is_default BOOLEAN DEFAULT false, -- auto-created with community
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Part 5: Redesigned Navbar → Sidebar Component

### Desktop: Persistent Left Sidebar

- **Collapsible** (icon-only mode like Discord)
- Shows user's joined communities with online indicators
- Real-time unread badges on Messages and Notifications
- Dark/charcoal background with white text (or match theme)

### Mobile: Hamburger Drawer

- Slides in from left
- Same content as desktop sidebar
- Overlay backdrop
- Smooth spring animation

### Both: Dynamic Top Bar

On mobile/tablet, a **slim top bar** replaces the traditional navbar:
- Left: Hamburger icon
- Center: Current page/community name
- Right: Search + Notifications icons

---

## Part 6: Component Architecture

### New Components Needed

| Component | Purpose |
|-----------|---------|
| `AppShell.tsx` | Layout wrapper with sidebar + content area |
| `AppSidebar.tsx` | Left sidebar (desktop persistent, mobile drawer) |
| `TopBar.tsx` | Mobile/tablet top bar (replaces Navbar on small screens) |
| `FeedPost.tsx` | Redesigned post card for feed (Reddit-style) |
| `CommunityPills.tsx` | Horizontal scrollable community filter |
| `SearchOverlay.tsx` | Full-screen search with results |
| `ChatRoom.tsx` | Individual chat room component |
| `ChatRoomList.tsx` | List of chat rooms in a community |
| `CreatePostBar.tsx` | Reddit-style "Create Post" input |
| `NotificationBell.tsx` | Notification dropdown |

### Components to Modify

| Component | Change |
|-----------|--------|
| `Navbar.tsx` | Replace with `TopBar.tsx` (mobile) + `AppSidebar.tsx` (desktop) |
| `BottomNav.tsx` | Redesign with 5 tabs: Home, Explore, Create, Chat, Profile |
| `PostCard.tsx` | Redesign for feed view (show community source) |
| `GroupDetail.tsx` → `CommunityDetail.tsx` | Rename + add chat rooms |
| `GroupCard.tsx` → `CommunityCard.tsx` | Rename + update styling |

---

## Part 7: Design System Updates

### Color Palette (keep existing + refine)

| Token | Current | Proposed |
|-------|---------|----------|
| `--bg-primary` | `#FFF8F0` (cream) | Keep — warm, inviting |
| `--coral` | `#FF6B6B` | Keep — primary action |
| `--teal` | `#2DD4BF` | Keep — secondary action |
| `--sidebar-bg` | *(none)* | `#1A1D23` (dark charcoal) or `#FFFFFF` (light) |
| `--accent-blue` | *(none)* | `#3B82F6` — for links/interactive |

### Typography

- Keep `font-heading` (playful feel)
- Body text: Use `Inter` or existing sans for readability
- Feed posts: Slightly tighter line-height for density

### Spacing & Radius

- Maintain playful rounded corners (`rounded-2xl`, `rounded-[1.5rem]`)
- Tighten card padding for denser feed

---

## Part 8: Phased Implementation Roadmap

### Phase A: Core Layout Restructure (Priority 🔴)
1. Build `AppShell` + `AppSidebar` + `TopBar`
2. Replace `Navbar.tsx` and `BottomNav.tsx`
3. Add global search to sidebar
4. Rename Groups → Communities in UI (keep DB table name)

### Phase B: Community Integration (Priority 🔴)
1. Move communities into sidebar "My Communities" section
2. Community pills on homepage feed
3. Redesign `CommunityDetail` page with new tabs
4. Posts show source community badge

### Phase C: Chat Rooms (Priority 🟡)
1. Create `chat_rooms` table
2. Multi-room UI in community detail
3. Chat room list + individual room view
4. Admin: create/manage rooms

### Phase D: Feed & Post Redesign (Priority 🟡)
1. New `FeedPost` component (Reddit-style)
2. Upvote/downvote system
3. Create Post flow (select community)
4. Infinite scroll / pagination

### Phase E: Mobile Polish (Priority 🟡)
1. PWA manifest + service worker
2. Touch gestures (swipe to navigate)
3. Push notifications
4. Bottom sheet modals

### Phase F: Native App Shell (Priority 🟢)
1. Capacitor/WebView wrapper
2. Native navigation bridge
3. Push notification integration
4. App store deployment

---

## Open Questions

> [!IMPORTANT]
> **Sidebar Theme**: Do you prefer a **dark sidebar** (Discord/Slack style) or a **light sidebar** (Reddit new UI style)? This significantly affects the visual identity.

> [!IMPORTANT]
> **Communities naming**: Should we rename the "Groups" concept to "Communities" everywhere (including the URL from `/groups/` to `/c/`)? This is a breaking change for any existing links to `/groups/[slug]`.

> [!IMPORTANT]
> **Bottom nav "Explore"**: Should "Explore" combine both community discovery AND pet browsing? Or keep "Browse Pets" as a separate tab? Reddit combines everything under Explore, but since adoption is a core feature, it may deserve its own tab.

> [!WARNING]
> **Scope consideration**: This is a major redesign. I suggest we start with **Phase A** (layout restructure) first, get it polished, then layer on phases B-F incrementally. Trying to do everything at once risks breaking the existing app. What's your priority order?

---

## Wireframes for Gemini Design

You mentioned handing wireframes to Gemini for visual design. The three wireframes above cover:

1. **Desktop layout** — Left sidebar + center feed + right widgets
2. **Mobile layout** — Top bar + community pills + feed + 5-tab bottom nav
3. **Community page** — Banner + tabs + chat rooms concept

You can use these as reference images when prompting Gemini for high-fidelity mockups. Suggested prompt for Gemini:

> "Design a high-fidelity UI mockup for a pet social media platform called AdoptDontShop. Use this wireframe as a reference [attach wireframe]. Color palette: warm cream (#FFF8F0) background, coral (#FF6B6B) primary, teal (#2DD4BF) secondary. Playful but modern aesthetic with rounded corners, soft shadows, and micro-animations. The platform combines Reddit-style communities with WhatsApp-style group chats and Petfinder-style pet adoption."
