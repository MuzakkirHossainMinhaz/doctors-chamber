// Doctor's Chamber Theme Configuration
// Colors extracted from public/logo.png and adapted for accessible UI use

export const theme = {
  // Brand colors from logo
  colors: {
    // Coral from the building wings / medical cross
    primary: '#FF896F',
    primaryDark: '#D96D56',
    primaryLight: '#FFB29F',

    // Blue from the doorway
    secondary: '#1C85E8',
    secondaryDark: '#166CC0',
    secondaryLight: '#56A4EE',

    // Structural neutrals from the logo body
    accent: '#C8D0D8',
    accentDark: '#A6B1BB',
    accentLight: '#EBF5FE',

    // Neutral colors tuned around the logo palette
    white: '#FFFFFF',
    gray50: '#F8FBFE',
    gray100: '#EBF5FE',
    gray200: '#DCE8F1',
    gray300: '#C8D0D8',
    gray400: '#A6B1BB',
    gray500: '#7A8794',
    gray600: '#5A6772',
    gray700: '#38424C',
    gray800: '#25303A',
    gray900: '#162028',

    // Semantic colors kept distinct, but harmonized to the brand palette
    success: '#2C8E78',
    successLight: '#D9F3EC',
    warning: '#E28A2E',
    warningLight: '#FCE8CF',
    danger: '#C75B64',
    dangerLight: '#F8D9DE',
    info: '#1C85E8',
    infoLight: '#DCEEFF',
  },
  
  // Typography
  fonts: {
    primary: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    secondary: '"Georgia", "Times New Roman", serif',
    mono: '"Fira Code", "Monaco", "Consolas", monospace',
  },
  
  // Font sizes
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  
  // Spacing
  spacing: {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
  },
  
  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    base: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(28, 133, 232, 0.08)',
    base: '0 1px 3px 0 rgba(28, 133, 232, 0.14), 0 1px 2px 0 rgba(22, 108, 192, 0.08)',
    md: '0 4px 6px -1px rgba(28, 133, 232, 0.14), 0 2px 4px -1px rgba(22, 108, 192, 0.08)',
    lg: '0 10px 15px -3px rgba(28, 133, 232, 0.14), 0 4px 6px -2px rgba(22, 108, 192, 0.08)',
    xl: '0 20px 25px -5px rgba(28, 133, 232, 0.14), 0 10px 10px -5px rgba(22, 108, 192, 0.06)',
    '2xl': '0 25px 50px -12px rgba(28, 133, 232, 0.3)',
  },
  
  // Breakpoints
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    '2xl': '1400px',
  },
  
  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
};

// CSS Custom Properties generator
export const generateCSSVariables = () => {
  const cssVars = {};
  
  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    cssVars[`--color-${key}`] = value;
  });
  
  // Typography
  cssVars['--font-primary'] = theme.fonts.primary;
  cssVars['--font-secondary'] = theme.fonts.secondary;
  cssVars['--font-mono'] = theme.fonts.mono;
  
  // Font sizes
  Object.entries(theme.fontSizes).forEach(([key, value]) => {
    cssVars[`--font-size-${key}`] = value;
  });
  
  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value;
  });
  
  // Border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    cssVars[`--radius-${key}`] = value;
  });
  
  // Shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    cssVars[`--shadow-${key}`] = value;
  });
  
  // Transitions
  Object.entries(theme.transitions).forEach(([key, value]) => {
    cssVars[`--transition-${key}`] = value;
  });
  
  return cssVars;
};

export default theme;
