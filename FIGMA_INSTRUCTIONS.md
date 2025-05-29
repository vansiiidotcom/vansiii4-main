# VANSIII Website - Figma Design Guide

## Design System

### Colors
- Primary Background: `#F8F5F1`
- Text Color: `#000000`
- Accent Color: `#6B46C1` (Purple 600)
- White: `#FFFFFF`
- Gray Scale:
  - Gray 400: `#9CA3AF`
  - Gray 500: `#6B7280`
  - Gray 600: `#4B5563`

### Typography
- Font Family: Inter
  - Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold)
- Text Sizes:
  - Hero Title: 80px/96px
  - Section Titles: 48px/56px
  - Body Text: 16px/24px
  - Button Text: 18px/24px

### Components

#### Navigation
1. Menu Button
   - Size: 64px × 64px
   - States: Default, Hover (70% opacity)
   - Custom menu icon on home page
   - Standard hamburger menu on other pages

2. Contact Button
   - Height: 48px
   - Padding: 24px horizontal
   - Border Radius: 9999px (Full)
   - Background: Black
   - Hover: Purple 600

#### Slide Menu
- Width: 400px
- Background: #F8F5F1
- Menu Items:
  - Font Size: 30px
  - Font Weight: 300
  - Spacing: 32px vertical

#### Custom Cursor
- Size: 32px × 32px
- Color: Black
- Mix Blend Mode: Exclusion
- Border Radius: 50%

### Layout Specifications

#### Home Page
1. Hero Section
   - Full height (100vh)
   - Padding: 
     - Top/Bottom: 80px
     - Left/Right: 64px
   - Title Position: Left-aligned, 40% from top
   - Mascot Position: Bottom right, 80px from bottom

2. Content Grid
   - Max Width: 1280px
   - Margin: Auto
   - Padding: 32px

#### Portfolio Grid
- 4 columns on desktop
- Gap: 32px
- Image Aspect Ratios: Varied (1:1, 4:5, 16:9)
- Hover Effects:
  - Scale: 1.1
  - Overlay: Black 70%
  - Icon: Eye (32px)

### Animations

1. Page Transitions
   - Duration: 0.3s
   - Easing: Cubic-bezier(0.4, 0, 0.2, 1)

2. Hover Effects
   - Duration: 0.3s
   - Scale: 1.05
   - Color transitions: 0.2s

3. Menu Animations
   - Slide duration: 0.3s
   - Fade duration: 0.2s

### Responsive Breakpoints
- Mobile: 640px
- Tablet: 768px
- Laptop: 1024px
- Desktop: 1280px

## Implementation Notes

1. Create separate pages for:
   - Home
   - Portfolio
   - Art Gallery
   - Blog
   - Contact

2. Use Auto-layout for consistent spacing

3. Create component libraries for:
   - Buttons
   - Cards
   - Navigation elements
   - Typography styles

4. Use Figma variables for:
   - Colors
   - Typography
   - Spacing
   - Border radius

5. Create interactive prototypes for:
   - Menu interactions
   - Portfolio item views
   - Page transitions