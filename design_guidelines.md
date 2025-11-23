# DashKids Landing Page - Dark Theme Design Guidelines

## Design Approach
**Reference-Based**: Modern dark NFT aesthetics inspired by Moonbirds, Azuki, and Pudgy Penguins, combined with neo-brutalist boldness. High-contrast yellow accents on dark backgrounds create electric energy while maintaining playful sophistication.

## Core Design Principles
- **Electric Contrast**: Yellow highlights pop against deep charcoal for maximum visual impact
- **Bold Brutalism**: Thick borders, heavy shadows, and unapologetic geometric shapes
- **Depth Through Darkness**: Layered slate tones create dimension without traditional gradients
- **Speed & Energy**: Maintained through sharp angles, dynamic spacing, and movement

## Color System
**Backgrounds**:
- Primary: Charcoal #1A1A1A
- Secondary cards: Slate #2D2D2D
- Elevated elements: Lighter slate #3A3A3A

**Accents**:
- Primary yellow: #FFD700 (gold)
- Hover yellow: #FFC700 (darker gold)
- Text on yellow: #1A1A1A (charcoal)

**Borders & Shadows**:
- Border: Yellow #FFD700 (4px width)
- Shadow: Yellow #FFD700 at 40% opacity (8px offset)
- Text on dark: White #FFFFFF

## Typography System
- **Display**: Bangers - 72px hero, 48px section headers, 32px subsections
- **Body**: Nunito 700-800 weight - 18px body, 17px buttons, 15px labels
- **Color**: White on dark backgrounds, charcoal on yellow buttons/highlights
- **Letter-spacing**: 3-5px on headers, normal on body
- **Mobile scale**: Reduce by 35% (72px → 47px, 48px → 31px)

## Layout & Spacing
**Units**: 8px multiples throughout
- Section padding: 64px desktop, 32px mobile
- Card padding: 40px desktop, 24px mobile
- Grid gaps: 24px desktop, 16px mobile
- Component margins: 48px between major sections

**Container**: Max-width 1200px, 24px horizontal padding

**Grid Patterns**:
- Hero: Full-width with centered content overlay
- Gallery: 3 columns desktop → 2 columns tablet → 1 column mobile
- Features: 3 columns desktop → 2 columns tablet → 1 column mobile

## Component Library

### Hero Section
- Full-width character showcase image (1920x1080 minimum)
- Centered content overlay with semi-transparent charcoal backdrop (backdrop-blur-xl)
- Logo: 280px max-width with yellow glow effect
- CTA buttons: Yellow primary with 4px yellow border, 6px shadow
- Tagline: White text, 48px, Bangers font
- Height: 85vh desktop, 70vh mobile

### About/Story Card
- Slate background #2D2D2D
- 4px yellow border, 8px yellow shadow (40% opacity, offset right-down)
- 16px border-radius
- White body text with yellow highlights on key phrases
- 40px padding desktop, 24px mobile

### NFT Gallery Grid
- Character cards: Square aspect ratio
- Image on charcoal #1A1A1A background with 4px yellow border
- Hover: -4px lift, increased shadow spread, yellow glow intensifies
- Label strip: Yellow background bar at bottom, charcoal text, Bangers font
- Card shadow: 6px offset yellow at 40% opacity

### Collection Stats Bar
- Horizontal layout, slate background #2D2D2D
- 3-4 key metrics (Total Supply, Floor Price, Holders, Volume)
- Yellow numbers (64px), white labels (16px)
- Yellow dividers between stats (2px vertical lines)
- 4px yellow top/bottom borders

### Link/Action Buttons Section
- Yellow primary buttons with charcoal text
- 4px yellow border, 6px shadow
- Icon: 24px, left-aligned with 12px gap
- Active state: Shadow offset to (0,0) for press effect
- Hover: Slight shadow blur increase
- Mobile: Full-width stack, 52px minimum height
- 3-column desktop → 2-column tablet → 1-column mobile

### Animated Background Elements
- Floating geometric shapes (circles, triangles) in yellow at 8% opacity
- Subtle parallax scroll effect on hero
- Diagonal speed lines in yellow (15% opacity) moving right-to-left
- All animations: pointer-events: none, reduced motion on mobile

## Image Strategy

**Hero Image**: 
- Large showcase featuring multiple DashKids characters in action pose
- Dimensions: 1920x1080 minimum, optimized WebP format
- Overlay: Gradient from transparent to charcoal at bottom 30%
- Buttons use backdrop-blur background, no hover backdrop changes

**Gallery (6 Images)**:
- Individual character variants: Dashing, Chillin, Portrait, Animated, Rare, Golden
- Square format 800x800px for retina displays
- Yellow border treatment on each
- Lazy loading below fold
- Error state: Slate background with yellow "Loading..." text

**Logo**:
- High-resolution PNG with transparent background
- Yellow stroke/glow effect in design
- 280px max-width desktop, 200px mobile

## Responsive Breakpoints
- **Desktop**: 1024px+ (3-column layouts)
- **Tablet**: 640-1023px (2-column layouts)
- **Mobile**: ≤639px (1-column, stacked navigation)

## Accessibility
- WCAG AA contrast: Yellow #FFD700 on charcoal passes
- White text on dark backgrounds minimum 4.5:1 ratio
- Focus rings: 3px yellow outline on all interactive elements
- Semantic heading hierarchy (h1 → h2 → h3)
- Alt text on all images describing character traits

## Performance
- Lazy load all gallery images
- Preload hero image and critical fonts (Bangers, Nunito)
- CSS transforms only for animations (GPU acceleration)
- Reduce animation complexity on mobile devices
- CDN delivery for all image assets

## Quality Standards
- Consistent 4px borders across all components
- Yellow shadows at 8px offset, 40% opacity universally
- 200ms transitions on hover states
- No layout shift during image loading (defined aspect ratios)
- Crisp rendering for pixel art characters