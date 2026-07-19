---
name: Lira Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#404848'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#707978'
  outline-variant: '#bfc8c8'
  surface-tint: '#306767'
  primary: '#003434'
  on-primary: '#ffffff'
  primary-container: '#0f4c4c'
  on-primary-container: '#85bbbb'
  inverse-primary: '#9ad0d0'
  secondary: '#176969'
  on-secondary: '#ffffff'
  secondary-container: '#a4ecec'
  on-secondary-container: '#1e6d6d'
  tertiary: '#472600'
  on-tertiary: '#ffffff'
  tertiary-container: '#663900'
  on-tertiary-container: '#f99b2f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b5edec'
  primary-fixed-dim: '#9ad0d0'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#134f4f'
  secondary-fixed: '#a7efef'
  secondary-fixed-dim: '#8bd3d2'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#004f50'
  tertiary-fixed: '#ffdcbf'
  tertiary-fixed-dim: '#ffb872'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6a3b00'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  display-num:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Sora
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  ad-slot-margin: 48px
---

## Brand & Style
The design system is engineered for the Turkish financial landscape, balancing the austerity of traditional banking with the approachability of modern fintech. The brand personality is **reliable, meticulous, and welcoming**, designed to reduce the cognitive load and anxiety often associated with financial planning.

The design style is **Modern Corporate with Tactile Softness**. It utilizes a "Surface-on-Surface" approach, where clean white layers sit atop an off-white foundation. By prioritizing whitespace and large, rounded interactive areas, the interface avoids the cluttered feel of legacy banking tools. It specifically caters to a demographic that values both professional authority and contemporary ease-of-use.

## Colors
The palette is rooted in **Dark Petrol Green**, a color that evokes stability and growth. 

- **Primary & Secondary:** Used for navigational elements, headers, and primary branding. The greens provide a sophisticated, calm backdrop for financial calculations.
- **Accent/CTA:** The **Warm Orange** is reserved strictly for high-priority actions (e.g., "Hesapla", "Başvur"). Its high contrast against the petrol green ensures clear conversion paths.
- **Foundation:** An off-white background (#FAFAF7) prevents screen glare during long sessions, while pure white (#FFFFFF) is used for cards and input areas to signify "active" workspaces.
- **Feedback:** Semantic colors for success and error follow standard financial conventions but are slightly softened to match the overall brand aesthetic.

## Typography
This design system prioritizes legibility and Turkish character support (ğ, ü, ş, i, ö, ç).

- **Headlines:** Sora provides a modern, slightly rounded geometric feel that softens the corporate tone.
- **Body & Forms:** Inter is used for its high x-height and exceptional readability in data-dense environments.
- **Numbers:** For calculated results, Inter’s **tabular figures** must be used. This ensures that decimal points and digits align vertically in tables and lists, essential for financial accuracy. 
- **Scale:** High-contrast sizing is used between labels and values to ensure the user's eye is drawn immediately to the results of their calculation.

## Layout & Spacing
The layout follows a **8px rhythmic grid**. Financial calculators can become visually overwhelming; therefore, the system utilizes generous margins and gutters to maintain "breathing room."

- **Structure:** A centered 12-column fixed grid is used for desktop (max-width 1200px). On mobile, a single-column fluid layout with 16px side margins is standard.
- **AdSense Integration:** Dedicated zones for advertising are treated as distinct visual containers. Ad slots should be placed between calculation inputs and results or in a right-hand sidebar on desktop. To maintain UX integrity, ad containers must have a subtle `background-color: #F3F4F1` and be separated by at least `48px` from primary CTA buttons.
- **Responsiveness:** On mobile, input fields and buttons stack vertically and expand to full-width to accommodate touch targets.

## Elevation & Depth
Elevation is achieved through **soft, multi-layered ambient shadows** rather than harsh borders. 

- **Level 1 (Default):** Flat background (#FAFAF7).
- **Level 2 (Cards/Inputs):** White surface with a very soft shadow (0px 4px 20px rgba(31, 41, 55, 0.04)). This is used for calculation forms.
- **Level 3 (Results/Modals):** A more pronounced shadow (0px 10px 30px rgba(15, 76, 76, 0.08)) to draw attention to the calculation output or floating action menus.
- **Interactions:** Hover states on interactive elements should see a slight increase in shadow depth and a 1-2px vertical lift to provide tactile feedback.

## Shapes
The shape language is consistently **Rounded**. Sharp corners are avoided to maintain the "warm corporate" feel.

- **Standard Elements:** Buttons and input fields use `rounded-md` (0.5rem).
- **Containers:** Primary calculation cards and result panels use `rounded-xl` (1.5rem).
- **Visual Cues:** Small decorative elements or progress bars use fully rounded (pill) ends to contrast against the structured grid.

## Components
Consistent component behavior ensures user trust throughout the calculation process.

- **Buttons:** 
    - *Primary:* Filled #F4972B with white text. Bold weight.
    - *Secondary:* Outlined #1B6B6B or ghost styles for "Reset" or "Back".
- **Input Fields:** 
    - Large touch targets (min-height 48px). 
    - Active state: 2px border in #1B6B6B.
    - Currency inputs must include a fixed "₺" suffix or prefix in #6B7280.
- **Cards:** 
    - Result cards should have a primary-colored top border (4px) to denote importance.
- **Chips:** 
    - Used for quick-select values (e.g., "12 Ay", "24 Ay"). Use a light tint of the primary color (#0F4C4C at 10% opacity) for unselected states.
- **Lists:**
    - Amortization schedules or breakdown lists use alternating row colors or subtle dividers in #E5E7EB.
- **Checkboxes/Radios:**
    - Custom styled with #1B6B6B fill when checked. Increased size (20px x 20px) for better accessibility.