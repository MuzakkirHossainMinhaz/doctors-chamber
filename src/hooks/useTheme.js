import { useTheme } from '../theme/ThemeProvider';

// Custom hook for accessing theme values with convenience methods
export const useThemeColors = () => {
  const theme = useTheme();
  
  return {
    // Colors
    primary: theme.colors.primary,
    primaryDark: theme.colors.primaryDark,
    primaryLight: theme.colors.primaryLight,
    secondary: theme.colors.secondary,
    secondaryDark: theme.colors.secondaryDark,
    secondaryLight: theme.colors.secondaryLight,
    accent: theme.colors.accent,
    accentDark: theme.colors.accentDark,
    accentLight: theme.colors.accentLight,
    white: theme.colors.white,
    gray: theme.colors,
    success: theme.colors.success,
    warning: theme.colors.warning,
    danger: theme.colors.danger,
    info: theme.colors.info,
    
    // Typography
    fonts: theme.fonts,
    fontSizes: theme.fontSizes,
    
    // Spacing
    spacing: theme.spacing,
    
    // Border radius
    borderRadius: theme.borderRadius,
    
    // Shadows
    shadows: theme.shadows,
    
    // Transitions
    transitions: theme.transitions,
    
    // Helper methods
    getGradient: (type = 'primary') => {
      const gradients = {
        primary: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
        secondary: `linear-gradient(135deg, ${theme.colors.secondary} 0%, ${theme.colors.secondaryDark} 100%)`,
        accent: `linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.accentDark} 100%)`,
      };
      return gradients[type] || gradients.primary;
    },
    
    getShadow: (level = 'base') => theme.shadows[level] || theme.shadows.base,
    
    getSpacing: (value) => theme.spacing[value] || value,
    
    getBorderRadius: (size = 'base') => theme.borderRadius[size] || theme.borderRadius.base,
  };
};

export default useThemeColors;
