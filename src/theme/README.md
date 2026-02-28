# Doctor's Chamber Theme System

This comprehensive theme system is based on the official Doctor's Chamber logo colors and provides a consistent design language across the entire application.

## Color Palette

### Primary Brand Colors
- **Primary Blue**: `#0066CC` - Main medical brand color
- **Primary Dark**: `#0052A3` - Darker variant for hover states
- **Primary Light**: `#3380D9` - Lighter variant for highlights

### Secondary Brand Colors
- **Secondary Blue**: `#003366` - Professional/trust color
- **Secondary Dark**: `#002647` - Darker variant
- **Secondary Light**: `#1A4D80` - Lighter variant

### Accent Colors
- **Accent Aqua**: `#00B4D8` - Calming/health color
- **Accent Dark**: `#0091B3` - Darker variant
- **Accent Light**: `#33C3E0` - Lighter variant

### Neutral Colors
- **White**: `#FFFFFF`
- **Gray Scale**: `#F8F9FA` to `#000000` (10 shades)

### Status Colors
- **Success**: `#28A745` (Green)
- **Warning**: `#FFC107` (Yellow)
- **Danger**: `#DC3545` (Red)
- **Info**: `#17A2B8` (Blue)

## Usage

### CSS Custom Properties
The theme is available as CSS custom properties throughout the application:

```css
.my-component {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}
```

### React Hook Usage
Use the `useThemeColors` hook for programmatic access:

```jsx
import { useThemeColors } from '../hooks/useTheme';

const MyComponent = () => {
  const { primary, secondary, getGradient, getShadow } = useThemeColors();
  
  return (
    <div style={{
      background: getGradient('primary'),
      boxShadow: getShadow('lg'),
      color: secondary
    }}>
      Content
    </div>
  );
};
```

### Theme Provider
The theme is wrapped around the entire application in `App.jsx`:

```jsx
<ThemeProvider>
  <NotificationSystem>
    {/* Your app content */}
  </NotificationSystem>
</ThemeProvider>
```

## Design Guidelines

### Logo Usage
- Always use `/logo.png` for the official logo
- Maintain consistent sizing: 40px for headers, 60px for hero sections
- Add subtle shadows for depth: `shadow-sm` class

### Typography
- Primary font: Segoe UI, Roboto, Helvetica Neue
- Secondary font: Georgia, Times New Roman (for special content)
- Monospace font: Fira Code, Monaco (for code)

### Spacing
- Use the spacing scale: `--spacing-1` (4px) to `--spacing-24` (96px)
- Consistent margins and padding using the scale

### Shadows
- `shadow-sm`: Subtle elevation for cards
- `shadow-md`: Standard elevation for interactive elements
- `shadow-lg`: Higher elevation for modals and dropdowns

### Transitions
- `transition-fast`: 150ms for quick interactions
- `transition-base`: 250ms for standard animations
- `transition-slow`: 350ms for complex animations

## Component Examples

### Buttons
```jsx
<Button variant="primary" className="rounded-pill transition-smooth">
  Primary Action
</Button>
```

### Cards
```jsx
<Card className="shadow-lg border-0 transition-smooth">
  <Card.Body>
    Content
  </Card.Body>
</Card>
```

### Navigation
```jsx
<Nav.Link className="transition-smooth">
  <i className="bi bi-house me-2"></i>
  Home
</Nav.Link>
```

## Responsive Design

The theme includes responsive breakpoints:
- `xs`: 0px
- `sm`: 576px
- `md`: 768px
- `lg`: 992px
- `xl`: 1200px
- `2xl`: 1400px

## Accessibility

- Focus styles use accent color: `--color-accent`
- Reduced motion support for users who prefer it
- High contrast ratios for text readability
- Semantic HTML structure maintained

## Customization

To customize the theme:

1. Modify `src/theme/theme.js` for core theme values
2. Update CSS custom properties in `src/index.css`
3. Add new utility classes as needed

## Best Practices

1. **Consistency**: Always use theme colors instead of hardcoded values
2. **Semantic**: Use colors according to their semantic meaning
3. **Accessibility**: Ensure sufficient contrast ratios
4. **Performance**: Use CSS transitions for smooth animations
5. **Responsive**: Design mobile-first with responsive breakpoints

## File Structure

```
src/
├── theme/
│   ├── theme.js          # Core theme configuration
│   ├── ThemeProvider.jsx # React context provider
│   └── README.md         # This documentation
├── hooks/
│   └── useTheme.js       # Custom hook for theme access
└── index.css             # Global styles with CSS variables
```

This theme system ensures a cohesive, professional, and accessible design that reflects the Doctor's Chamber brand identity.
