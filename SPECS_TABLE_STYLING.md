# Premium Specifications Table - CSS Styling

## ✨ What's Been Applied

Your specifications table has been transformed with **pure CSS styling** - no JavaScript interactivity, just stunning visual design.

## 🎨 Visual Features Implemented

### 1. **Glassmorphism Container**
```css
- Background: rgba(255, 255, 255, 0.9) with backdrop blur
- Border: Subtle white border with transparency
- Border-radius: 16px for smooth rounded corners
- Box-shadow: Deep shadow for floating effect
```

### 2. **Premium Table Header**
```css
- Background: Linear gradient (#0f3460 → #1e3a5f)
- Text: White, uppercase, bold with letter-spacing
- Animation: Subtle shimmer effect moving across header
- Text-shadow: Soft depth effect
- Rounded top corners: 12px
```

### 3. **Row Design**
```css
Alternating Colors:
- Odd rows: Pure white (#ffffff)
- Even rows: Light gray (#f8fafc)

Hover Effects:
- Background: Light blue (#e0f2fe)
- Transform: Shifts 4px to the right
- Border-left: 4px gradient accent (cyan → blue → purple)
- Box-shadow: Subtle elevation
- Smooth transition: 0.3s cubic-bezier
```

### 4. **Model Column (Badge Style)**
```css
- Font: Monospace (JetBrains Mono style)
- Color: Vibrant blue (#0ea5e9)
- Background: Blue tinted (rgba with 10% opacity)
- Padding: 6px 12px with border-radius
- Hover: Scales up 1.02x with darker background
- Sticky: Stays visible on horizontal scroll
```

### 5. **Range Column (Gradient Underline)**
```css
- Text: Dark gray color
- Underline: 3px height gradient bar
  - Green (#10b981) → Amber (#f59e0b) → Red (#ef4444)
- Opacity: 0.6 default, 1.0 on hover
- Position: Relative with absolute positioned underline
```

### 6. **Micro-Animations**
```css
Page Load:
- Each row fades in with stagger effect
- Delay: 0.05s per row (calculated by --row-index)
- Animation: fadeInRow (opacity + translateY)

Hover Transitions:
- All effects: 0.3s cubic-bezier easing
- Smooth, premium feel

Header Shimmer:
- Continuous gradient animation
- 3s cycle, infinite loop
```

## 🎨 Color Palette

```css
Primary Blue:   #0ea5e9
Dark Blue:      #0f3460
Success Green:  #10b981
Warning Amber:  #f59e0b
Danger Red:     #ef4444
Neutral Gray:   #475569, #64748b
Light BG:       #f8fafc
Hover Blue:     #e0f2fe
```

## 📱 Responsive Design

```css
Mobile (≤768px):
- Header padding reduced: 12px 8px
- Cell padding reduced: 10px 8px
- Badge padding reduced: 4px 8px
- Font sizes adjusted
- Hover transform reduced: 2px
```

## 🎯 Key CSS Classes

### Main Classes
- `.specs-table-card` - Glassmorphism container
- `.premium-specs-table` - Table base styling
- `.specs-table-header` - Header cells with gradient
- `.specs-table-row` - Body rows with hover effects
- `.specs-table-cell` - Standard cell styling

### Special Classes
- `.model-cell` - First column (sticky)
- `.model-badge` - Model number badge
- `.range-cell` - Range column container
- `.range-text` - Range text with gradient underline

## 🌙 Dark Mode Support

All styles include dark mode variants:
```css
- Container: Dark background with reduced opacity
- Text colors: Lighter shades for readability
- Borders: Subtle white borders
- Hover effects: Adapted for dark backgrounds
```

## 📐 Layout Details

```
┌─────────────────────────────────────────────────┐
│  Glassmorphism Card (16px border-radius)        │
│  ┌───────────────────────────────────────────┐  │
│  │ HEADER (Gradient, Uppercase, 16px pad)    │  │
│  ├───────────────────────────────────────────┤  │
│  │ Row 1 (White, 14px padding)               │  │
│  │ Row 2 (Light Gray)                        │  │
│  │ Row 3 (White) ← Hover: Blue + Shift 4px  │  │
│  │   └─ 4px gradient left border on hover    │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## 🚀 How to View

1. Navigate to: `http://localhost:5000/pressure-switches/waterline`
2. Scroll to "Available Models & Specifications" section
3. Observe the stunning visual design:
   - Glassmorphism card container
   - Gradient header with shimmer animation
   - Model badges with monospace font
   - Range text with gradient underlines
   - Smooth hover effects
   - Row stagger animations on load

## ✨ Visual Highlights

1. **Header Shimmer**: Watch the subtle light sweep across the header continuously
2. **Row Animations**: Rows fade in sequentially when page loads
3. **Hover Magic**: 
   - Row slides right with gradient border
   - Model badge scales up
   - Range underline brightens
   - Background turns light blue
4. **Gradient Underlines**: Each range has a green→amber→red gradient bar
5. **Sticky First Column**: Model column stays visible when scrolling horizontally
6. **Custom Scrollbar**: Gradient blue scrollbar matches the design

## 🎨 Design Philosophy

This styling follows:
- **Glassmorphism**: Frosted glass effect with blur
- **Modern Gradients**: Subtle, professional color transitions
- **Micro-interactions**: Smooth, satisfying hover effects
- **Premium Feel**: Like Stripe or Linear.app tables
- **Clean Typography**: Inter font family, antialiased
- **Accessibility**: High contrast, clear visual hierarchy

## 📝 Technical Notes

- **No JavaScript**: Pure CSS implementation
- **Performance**: GPU-accelerated transforms
- **Responsive**: Mobile-first breakpoints
- **Cross-browser**: WebKit prefixes included
- **Dark Mode**: Automatic theme support
- **Semantic**: Uses existing shadcn/ui components

Enjoy your stunning specifications table! 🎉

