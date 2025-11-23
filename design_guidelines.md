# DashKids Landing Page - Design Guidelines

## Design Approach
**Reference-Based**: Drawing from vibrant NFT collection sites (Cool Cats, Doodles) and retro gaming aesthetics, maintaining the existing playful, energetic comic book style with neo-brutalist elements.

## Core Design Principles
- **High Energy**: Bold, punchy visual language that conveys speed and excitement
- **Playful Professionalism**: Kid-friendly aesthetic that doesn't compromise on quality
- **Clear Hierarchy**: Important CTAs and collection info immediately visible
- **Confidence**: Unapologetic use of bold borders, shadows, and vibrant contrasts

## Typography System
- **Display/Headers**: Bangers (existing) - sizes: 64px (logo), 36px (section headers), 28px (tagline), 18px (labels)
- **Body/UI**: Nunito 600-800 weight - sizes: 17px (body), 16px (buttons), 14-15px (mobile body)
- **Hierarchy**: Heavy letter-spacing (2-4px) on headers, tight on body text
- **Scale**: Reduce header sizes by ~30% on mobile (64px → 44px, 36px → 26px)

## Layout & Spacing System
**Spacing Units**: Consistent use of multiples of 8px
- Section padding: 40-60px desktop, 25-35px mobile
- Card padding: 35-40px desktop, 20-25px mobile
- Grid gaps: 20px desktop, 15px mobile
- Button padding: 16px vertical, 24px horizontal

**Container**: Max-width 1100px, 20px side padding, centered

**Grid Patterns**:
- Gallery: 4 columns desktop → 2 columns tablet → 2 columns mobile (maintain 2-up for visual impact)
- Links: 3 columns desktop → 2 columns tablet → 1 column mobile
- Consistent aspect ratios on gallery items (1:1 square images)

## Component Library

### Header Section
- Logo image with text fallback (existing DASHKIDS text styling)
- Tagline with lightning bolt emojis
- Centered alignment throughout

### About Section (Story Card)
- Cream background (#FFF8E7), 4px black border, 8px offset shadow
- 20px border-radius for friendly feel
- Generous padding for readability
- Italic emphasis for closing statement

### Gallery Grid
- Square cards with 4px borders, 6px shadows
- Hover: Lift effect (-3px transform, increased shadow)
- Image: Cover fill, 1:1 aspect ratio, crisp rendering
- Labels: Bangers font, centered, cream background strip at bottom

### Link Buttons
- Six distinct color variants (maintain existing palette)
- Icons 22px, left-aligned with 10px gap
- Active state: Translate shadow to (0,0) for "press" effect
- Hover: Slight shadow reduction for depth
- Mobile: Full-width stack for easy touch targets (min 44px height)

### Speed Lines Background
- Fixed positioning, animated horizontal streaks
- 25% opacity, red gradient (#E84A35)
- Staggered animation delays for dynamic feel
- Non-interactive overlay (pointer-events: none)

## Image Strategy

**Logo**: 
- Primary: High-resolution PNG/SVG logo (320px max-width desktop, 240px mobile)
- Fallback: Styled text "DASHKIDS" with outline shadow effect (already implemented)

**Gallery (4 Images Required)**:
- Dashing, Chillin, Portrait, Animated versions of characters
- CloudFront CDN delivery for performance
- Lazy loading below fold
- Placeholder: Solid cream background with character name during load
- Error handling: Show label with "Image Loading..." message
- Dimensions: Serve at 600x600px for retina displays

**No Hero Image**: This page leads with bold text branding instead

## Responsive Breakpoints
- **Desktop**: 901px+ (4-column gallery, 3-column links)
- **Tablet**: 601-900px (2-column gallery, 2-column links)
- **Mobile**: ≤600px (2-column gallery, 1-column links, stacked header)

## Mobile Optimization
- Increase touch targets: Minimum 44x44px for all interactive elements
- Reduce decorative animations on mobile (fewer speed lines)
- Larger tap areas on buttons with comfortable spacing
- Maintain 2-column gallery for visual richness
- Scale down typography proportionally (not linearly)

## Accessibility
- Semantic HTML with proper heading hierarchy (h1 → h2)
- Alt text on all images describing character versions
- Sufficient color contrast (black on yellow, white on colored buttons)
- Focus states visible on keyboard navigation
- ARIA labels on external link icons

## Performance Enhancements
- Lazy load gallery images (loading="lazy" attribute)
- Optimize animation performance (CSS transforms only)
- Preload critical fonts (Bangers, Nunito)
- Async load non-critical external resources
- Image error handling with graceful fallbacks

## Quality Standards
- Pixel-perfect borders (consistent 4px throughout)
- Crisp image rendering (image-rendering: crisp-edges for pixel art if applicable)
- Smooth hover transitions (200ms ease)
- No layout shift during image loading (defined aspect ratios)
- Professional polish on all interactive states