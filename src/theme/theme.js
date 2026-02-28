// Doctor's Chamber Theme Configuration
// Based on logo color analysis

export const theme = {
  // Primary brand colors from logo
  colors: {
    // Medical Blue - Primary brand color
    primary: '#0066CC',
    primaryDark: '#0052A3',
    primaryLight: '#3380D9',
    
    // Dark Blue - Professional/Trust
    secondary: '#003366',
    secondaryDark: '#002647',
    secondaryLight: '#1A4D80',
    
    // Light Blue/Aqua - Calming/Health
    accent: '#00B4D8',
    accentDark: '#0091B3',
    accentLight: '#33C3E0',
    
    // Neutral colors
    white: '#FFFFFF',
    gray50: '#F8F9FA',
    gray100: '#E9ECEF',
    gray200: '#DEE2E6',
    gray300: '#CED4DA',
    gray400: '#ADB5BD',
    gray500: '#6C757D',
    gray600: '#495057',
    gray700: '#343A40',
    gray800: '#212529',
    gray900: '#000000',
    
    // Status colors
    success: '#28A745',
    successLight: '#71DD8A',
    warning: '#FFC107',
    warningLight: '#FFD08A',
    danger: '#DC3545',
    dangerLight: '#F1B0B7',
    info: '#17A2B8',
    infoLight: '#7CC7D4',
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
    sm: '0 1px 2px 0 rgba(0, 102, 204, 0.05)',
    base: '0 1px 3px 0 rgba(0, 102, 204, 0.1), 0 1px 2px 0 rgba(0, 102, 204, 0.06)',
    md: '0 4px 6px -1px rgba(0, 102, 204, 0.1), 0 2px 4px -1px rgba(0, 102, 204, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 102, 204, 0.1), 0 4px 6px -2px rgba(0, 102, 204, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 102, 204, 0.1), 0 10px 10px -5px rgba(0, 102, 204, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 102, 204, 0.25)',
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
