# Clay Components Guide

Complete reference for using RXRESOLVE's premium clay component library.

## Quick Import

```tsx
import {
  ClayButton,
  ClayCard, ClayCardHeader, ClayCardBody,
  ClayBadge,
  ClayInput,
  ClaySection, ClayContainer,
  ClayTable, ClayTableHeader, ClayTableBody, ClayTableRow, ClayTableCell,
  ClayModal, ClayModalBody, ClayModalFooter,
  ClaySidebar, ClaySidebarItem, ClaySidebarSection,
  ClayChatBubble, ClayTypingIndicator,
  ClayGradientText, ClayGradientBackground
} from '@/components/clay';
```

## Components

### ClayButton

Tactile, elevated buttons with multiple variants.

```tsx
// Primary (default)
<ClayButton onClick={() => console.log('clicked')}>
  Click Me
</ClayButton>

// Variants
<ClayButton variant="secondary">Secondary</ClayButton>
<ClayButton variant="success">Success</ClayButton>
<ClayButton variant="danger">Danger</ClayButton>
<ClayButton variant="outline">Outline</ClayButton>

// Sizes
<ClayButton size="sm">Small</ClayButton>
<ClayButton size="md">Medium</ClayButton>
<ClayButton size="lg">Large</ClayButton>

// Disabled
<ClayButton disabled>Disabled</ClayButton>
```

### ClayCard

Elevated card surfaces with inset shadows for 3D depth.

```tsx
<ClayCard>
  <ClayCardBody className="p-6">
    Card content here
  </ClayCardBody>
</ClayCard>

// With header and body
<ClayCard>
  <ClayCardHeader>
    <h3>Card Title</h3>
  </ClayCardHeader>
  <ClayCardBody>
    Card content
  </ClayCardBody>
</ClayCard>

// Elevated (lifts on hover)
<ClayCard elevated>
  Content
</ClayCard>
```

### ClayBadge

Soft, rounded status indicators.

```tsx
<ClayBadge variant="blue">Blue Badge</ClayBadge>
<ClayBadge variant="teal">Teal Badge</ClayBadge>
<ClayBadge variant="purple">Purple Badge</ClayBadge>
<ClayBadge variant="green">Green Badge</ClayBadge>
<ClayBadge variant="amber">Amber Badge</ClayBadge>
<ClayBadge variant="red">Red Badge</ClayBadge>
```

### ClayInput

Inset shadow inputs with tactile focus states.

```tsx
<ClayInput
  placeholder="Enter text..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// Types
<ClayInput type="email" placeholder="Email" />
<ClayInput type="password" placeholder="Password" />
<ClayInput type="number" placeholder="Amount" />

// Disabled
<ClayInput disabled placeholder="Disabled input" />
```

### ClaySection

Reusable section layout with title and subtitle.

```tsx
<ClaySection
  title="Section Title"
  subtitle="Optional subtitle for context"
>
  <div>Section content</div>
</ClaySection>
```

### ClayContainer

Responsive container with size variants.

```tsx
<ClayContainer size="lg">
  <div>Content inside 6xl max-width container</div>
</ClayContainer>

// Sizes: sm (2xl), md (4xl), lg (6xl), xl (7xl), full
```

### ClayTable

Premium table with clay styling and hover effects.

```tsx
<ClayTable>
  <ClayTableHeader>
    <ClayTableRow>
      <ClayTableCell header>Column 1</ClayTableCell>
      <ClayTableCell header>Column 2</ClayTableCell>
    </ClayTableRow>
  </ClayTableHeader>
  <ClayTableBody>
    <ClayTableRow onClick={() => handleRowClick()}>
      <ClayTableCell>Data 1</ClayTableCell>
      <ClayTableCell>Data 2</ClayTableCell>
    </ClayTableRow>
  </ClayTableBody>
</ClayTable>
```

### ClayModal

Premium modal with backdrop, title, and footer.

```tsx
const [isOpen, setIsOpen] = useState(false);

<ClayModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
>
  <ClayModalBody>
    Modal content here
  </ClayModalBody>
  <ClayModalFooter>
    <ClayButton variant="secondary" onClick={() => setIsOpen(false)}>
      Cancel
    </ClayButton>
    <ClayButton>Confirm</ClayButton>
  </ClayModalFooter>
</ClayModal>
```

### ClaySidebar

Floating navigation sidebar with items and sections.

```tsx
<ClaySidebar>
  <ClaySidebarSection title="Main Navigation">
    <ClaySidebarItem
      icon={<HomeIcon />}
      active={currentView === 'dashboard'}
      onClick={() => setCurrentView('dashboard')}
    >
      Dashboard
    </ClaySidebarItem>
    <ClaySidebarItem
      icon={<QueueIcon />}
      onClick={() => setCurrentView('queue')}
    >
      Refill Queue
    </ClaySidebarItem>
  </ClaySidebarSection>
  
  <ClaySidebarSection title="Tools">
    <ClaySidebarItem>
      Settings
    </ClaySidebarItem>
  </ClaySidebarSection>
</ClaySidebar>
```

### ClayChatBubble

Chat bubbles for AI copilot conversations.

```tsx
// User message
<ClayChatBubble
  sender="user"
  message="Can you help with this refill?"
  timestamp="10:30 AM"
/>

// Assistant message
<ClayChatBubble
  sender="assistant"
  message="Sure! I can see the blocker. It's a missing refill authorization..."
  timestamp="10:31 AM"
/>

// Typing indicator
<ClayTypingIndicator />
```

### ClayGradientText

Gradient text for emphasis in headings.

```tsx
<h1>
  Every stuck refill has <ClayGradientText>a reason.</ClayGradientText>
</h1>

// Custom gradient
<ClayGradientText
  from="#77CFC1"
  to="#AFA7FF"
>
  Custom Gradient
</ClayGradientText>
```

### ClayGradientBackground

Background sections with gradient.

```tsx
<ClayGradientBackground
  className="rounded-2xl p-12 text-white"
  from="#6B9EFF"
  to="#77CFC1"
>
  Gradient background content
</ClayGradientBackground>
```

## Color Reference

```
Primary Blue:       #6B9EFF
Teal:               #77CFC1
Lavender:           #DCD7FF
Purple:             #AFA7FF
Green:              #CDEEDB
Amber:              #FFE5B5
Red:                #FFD4D4
Primary Text:       #1F2937
Secondary Text:     #64748B
Background:         #F6F8FC
Secondary BG:       #EEF3F9
Card:               #FFFFFF
Border:             #E2E8F0
```

## Shadow System

```
--clay-shadow-sm:   inset 1px 1px 3px rgba(255,255,255,0.9), 
                    inset -1px -1px 3px rgba(190,200,215,0.25),
                    0 4px 12px rgba(80,100,130,0.06);

--clay-shadow-md:   inset 2px 2px 5px rgba(255,255,255,0.9),
                    inset -2px -2px 5px rgba(190,200,215,0.35),
                    0 10px 25px rgba(80,100,130,0.08);

--clay-shadow-lg:   inset 2px 2px 8px rgba(255,255,255,0.95),
                    inset -2px -2px 8px rgba(190,200,215,0.4),
                    0 15px 40px rgba(80,100,130,0.12);

--clay-shadow-xl:   inset 3px 3px 10px rgba(255,255,255,1),
                    inset -3px -3px 10px rgba(190,200,215,0.45),
                    0 20px 50px rgba(80,100,130,0.15);
```

## Animation Utilities

Available animations in `src/styles/clay-design.css`:

- `.animate-float` - Gentle vertical floating
- `.animate-float-slow` - Slower floating motion
- `.animate-fade-in` - Fade in animation
- `.animate-slide-up` - Slide up with fade
- `.animate-scale-in` - Scale in from 0.95
- `.animate-glow` - Pulsing glow effect
- `.animate-pulse-soft` - Soft pulsing opacity

## Best Practices

1. **Consistency**: Always use clay components for new UI elements
2. **Color Palette**: Stick to the defined color system
3. **Shadows**: Use provided shadow utilities, not custom shadows
4. **Border Radius**: Maintain 18-32px border radius for clay feel
5. **Spacing**: Use 6px unit increments (p-4, p-6, gap-6, etc.)
6. **Animations**: Use provided utilities and keep animations under 400ms
7. **Accessibility**: All components include proper focus states and ARIA labels
8. **Mobile**: All components are responsive by default

## Examples

### Dashboard Header
```tsx
<div className="bg-white p-6 rounded-2xl shadow-[inset_2px_2px_5px_rgba(255,255,255,0.9),inset_-2px_-2px_5px_rgba(190,200,215,0.35),0_10px_25px_rgba(80,100,130,0.08)]">
  <h1 className="text-2xl font-bold text-[#1F2937]">Dashboard</h1>
  <p className="text-[#64748B] mt-1">Your refill operations at a glance</p>
</div>
```

### Card Grid
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <ClayCard key={item.id} elevated>
      <ClayCardBody className="p-6">
        <h3 className="font-bold text-[#1F2937]">{item.title}</h3>
        <p className="text-[#64748B] mt-2">{item.description}</p>
      </ClayCardBody>
    </ClayCard>
  ))}
</div>
```

### Action Row
```tsx
<div className="flex gap-3 p-4 bg-white rounded-2xl shadow-md">
  <ClayButton size="sm" variant="secondary">Cancel</ClayButton>
  <ClayButton size="sm">Save</ClayButton>
</div>
```

## Extending Components

To create custom clay-styled components, follow the pattern:

```tsx
// Use inline shadows instead of predefined classes
className="shadow-[inset_2px_2px_5px_rgba(255,255,255,0.9),inset_-2px_-2px_5px_rgba(190,200,215,0.35),0_10px_25px_rgba(80,100,130,0.08)]"

// Use clay color palette
className="bg-[#DCEBFF] text-[#6B9EFF]"

// Maintain rounded appearance
className="rounded-2xl"

// Smooth transitions
className="transition-all duration-300"
```

## Support

For issues or questions about clay components:
1. Check this guide for the component you need
2. Review the component source code in `src/components/clay/`
3. Check the landing page (`src/components/landing/LandingPageNew.tsx`) for usage examples
