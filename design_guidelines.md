# HVAC E-Commerce Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from industrial B2B e-commerce leaders like Grainger, MSC Industrial Supply, and Ferguson. This approach emphasizes trust, technical precision, and professional functionality while maintaining visual appeal for product showcase.

## Core Design Principles
- **Industrial Professionalism**: Clean, technical aesthetic that builds trust with contractors and engineers
- **Product-Centric**: Visual hierarchy prioritizes product imagery and technical specifications
- **Information Density**: Efficiently display technical data without overwhelming users
- **Mobile-First**: Touch-optimized for field technicians using mobile devices

## Color Palette
**Primary Brand Colors:**
- Primary Blue: 210 85% 25% (deep industrial blue for headers, CTAs)
- Secondary Blue: 210 60% 45% (lighter blue for accents, links)

**Supporting Colors:**
- Neutral Gray: 210 10% 95% (light backgrounds)
- Text Gray: 210 15% 25% (primary text)
- Success Green: 145 70% 35% (in-stock indicators)
- Warning Orange: 25 85% 55% (low stock alerts)
- Error Red: 0 75% 45% (out of stock)

**Background Treatments:**
Subtle gradient overlays on hero sections using primary blue tones (210 85% 25% to 210 60% 45%). Clean white/light gray backgrounds for product grids to ensure maximum product photo clarity.

## Typography
- **Primary Font**: Inter (clean, technical readability)
- **Secondary Font**: Roboto Mono (for technical specifications, part numbers)
- **Hierarchy**: Large headings (2xl-4xl), readable body text (base-lg), compact technical data (sm)

## Layout System
**Spacing Units**: Consistent use of Tailwind units 2, 4, 8, 12, 16
- Tight spacing (2-4) for technical specifications
- Medium spacing (8-12) for product cards and sections
- Generous spacing (16+) for section breaks and hero areas

## Component Library

### Navigation
- Sticky header with mega menu for category hierarchy
- Breadcrumb navigation for deep product browsing
- Search bar with autocomplete and filters

### Product Display
- Grid/list toggle views with product cards showing key specs
- High-quality product imagery with zoom functionality
- Technical specification tables with collapsible sections
- Related products carousel

### Interactive Elements
- Filter sidebar with category, price, specifications
- Pagination with product count display
- Quick view modals for product comparison
- Add to quote/cart functionality

### Forms & Data
- Professional quote request forms
- Technical specification filters
- Inventory status indicators
- Bulk order capabilities

## Images
**Hero Section**: Large hero image showcasing modern HVAC installation or industrial facility (1920x800px) with subtle blue gradient overlay. Features outline buttons with blurred backgrounds.

**Product Images**: High-resolution product photos on white backgrounds (800x800px minimum) with multiple angles and detail shots.

**Category Images**: Industrial lifestyle images showing products in real-world applications (600x400px).

**Technical Diagrams**: Clean, technical illustrations for installation guides and specifications.

## Animations
Minimal, professional animations using GSAP:
- Subtle page load transitions
- Smooth product card hover effects (slight elevation)
- Filter panel slide animations
- Image gallery transitions

## Mobile Optimization
- Touch-friendly filter controls
- Swipeable product galleries
- Collapsible specification sections
- Simplified navigation for small screens

This design framework creates a professional, trustworthy e-commerce experience that serves both field technicians needing quick product lookup and procurement professionals requiring detailed technical specifications.