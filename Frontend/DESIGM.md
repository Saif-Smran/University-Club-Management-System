---
name: Academic Nexus
colors:
  surface: "#faf9fc"
  surface-dim: "#dbd9dd"
  surface-bright: "#faf9fc"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f4f3f7"
  surface-container: "#efedf1"
  surface-container-high: "#e9e7eb"
  surface-container-highest: "#e3e2e6"
  on-surface: "#1a1b1e"
  on-surface-variant: "#44474e"
  inverse-surface: "#2f3033"
  inverse-on-surface: "#f1f0f4"
  outline: "#74777f"
  outline-variant: "#c4c6cf"
  surface-tint: "#005cba"
  primary: "#00081c"
  on-primary: "#ffffff"
  primary-container: "#001f47"
  on-primary-container: "#4387ec"
  inverse-primary: "#aac7ff"
  secondary: "#00696b"
  on-secondary: "#ffffff"
  secondary-container: "#7ef2f4"
  on-secondary-container: "#006e70"
  tertiary: "#656100"
  on-tertiary: "#ffffff"
  tertiary-container: "#b6af00"
  on-tertiary-container: "#444100"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#d7e3ff"
  primary-fixed-dim: "#aac7ff"
  on-primary-fixed: "#001b3e"
  on-primary-fixed-variant: "#00458e"
  secondary-fixed: "#81f4f7"
  secondary-fixed-dim: "#62d8db"
  on-secondary-fixed: "#002021"
  on-secondary-fixed-variant: "#004f51"
  tertiary-fixed: "#f0e836"
  tertiary-fixed-dim: "#d3cb0f"
  on-tertiary-fixed: "#1e1c00"
  on-tertiary-fixed-variant: "#4c4900"
  background: "#faf9fc"
  on-background: "#1a1b1e"
  surface-variant: "#e3e2e6"
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: "700"
    lineHeight: "1.2"
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: "600"
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "500"
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-padding: 2rem
  gutter: 1.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The design system is anchored in a **Corporate Modern** aesthetic tailored for the higher education sector. It prioritizes clarity, organization, and institutional trust while maintaining a fresh, student-focused energy through vibrant accents.

The visual language utilizes a "Studio" approach: high-quality whitespace, crisp alignment, and a structured hierarchy that mirrors the organized nature of university administration. The interface feels like a premium productivity tool—reliable enough for faculty, yet intuitive enough for student leaders. Subtle nods to Minimalism ensure that data-heavy dashboards remain legible and focused.

## Colors

The palette is built on **Bright Scholastic Blue**, providing a foundation of authority and professional energy. The **Aqua secondary** serves as the primary action color for buttons and active states to ensure a modern SaaS feel that is more vibrant than traditional institutional palettes.

The **Citrine tertiary** serves as a bold, high-visibility highlight. This energetic yellow-gold accent is used for notifications, critical alerts, and sophisticated data visualization, injecting a sense of urgency and modernity into the academic framework.

- **Light Mode:** Uses a "Soft Paper" background with surfaces tiered via container tokens to maintain structure without visual noise.
- **Accessibility:** All "on-\*" tokens are mathematically derived to ensure a minimum 4.5:1 contrast ratio (WCAG AA) against their respective backgrounds.
- **Functional Colors:** Follow industry standards for status, ensuring club approvals or budget alerts are immediately recognizable.

## Typography

This design system utilizes **Inter** across all levels to leverage its exceptional legibility in data-dense environments.

- **Hierarchy:** Use tight letter-spacing on display and large headlines to create a customized, "premium" feel.
- **Data Density:** `body-sm` is the workhorse for data tables and secondary metadata.
- **Labels:** Small labels use an increased font weight (600) and slight tracking to ensure they remain legible even when used in all-caps for sidebar headers or table column titles.

## Layout & Spacing

The layout follows a **Fluid Grid** model with fixed max-widths for content containers on ultra-wide screens to prevent line lengths from becoming unreadable.

- **Grid:** A 12-column system is used for desktop dashboards. Sidebar navigation is fixed at `280px` on desktop, collapsing to an icon-only rail on smaller viewports.
- **Rhythm:** An 8pt grid system (based on the 4px unit) governs all spatial relationships. `stack-md` (16px) is the default gap for most component groupings.
- **Responsive Behavior:** On mobile, container padding reduces to `1rem`. Data tables implement horizontal scrolling with the first column pinned for context.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** combined with **Ambient Shadows**.

- **Surfaces:** The background is the lowest level. Cards and the sidebar sit on elevated surface-container tiers.
- **Shadows:** Use highly diffused, low-opacity shadows. Shadows should feel like they are lifting the element off the page rather than casting a dark stain.
- **Interactive States:** Floating elements like Modals or Popovers use a higher elevation shadow with an additional `1px` border (outline-variant) to ensure separation from the content beneath.

## Shapes

The system uses a **Rounded** language to soften the institutional feel of the palette.

- **Large Containers:** Use `rounded-xl` (1.5rem) for primary dashboard widgets and cards.
- **Functional Elements:** Use the base `rounded` (0.5rem) for buttons and inputs to maintain a professional, crisp appearance.
- **Circular elements:** Avatars and status indicators use a full pill-shape to provide a distinct contrast against the geometric grid.

## Components

- **Sidebar:** Clean, vertical navigation with 20px icons. The active state is indicated by a subtle background tint and a 2px vertical indicator on the leading edge.
- **Data Tables:** Row heights should be generous (`56px`). Headers are sticky and use `label-sm` with increased letter spacing.
- **Buttons:**
  - _Primary:_ Solid Aqua (`secondary`) with white text.
  - _Secondary:_ Ghost style with Scholastic Blue (`primary`) text and borders.
  - _Accent:_ Solid Citrine (`tertiary`) for specialized alerts or "Attention Needed" features.
- **Input Fields:** Use a 2px focus ring using the Primary color. Labels remain visible above the field at all times.
- **Status Badges:** Pill-shaped indicators using the container tokens (e.g., `tertiary-container` with `on-tertiary-container` text) for high-legibility status communication.
