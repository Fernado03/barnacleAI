// Design tokens for consistent styling across the application
export const DESIGN_TOKENS = {
  // Color palette
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    secondary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    gradients: {
      primary: 'from-blue-700 to-cyan-600',
      primaryHover: 'from-blue-800 to-cyan-700',
      background: 'from-white to-gray-50',
      overlay: 'linear-gradient(to right, transparent 0%, rgba(30, 58, 138, 0.3) 75%, rgba(7, 89, 133, 0.5) 100%)',
    }
  },

  // Typography
  typography: {
    fontFamily: {
      primary: "'Inter', sans-serif",
    },
    fontSize: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
      '7xl': 'text-7xl',
      '8xl': 'text-8xl',
    },
    fontWeight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    }
  },

  // Spacing
  spacing: {
    navbar: {
      height: 'h-20',
      padding: 'pt-28', // Account for fixed navbar height + margin (pt-6 + py-4 + logo height)
    },
    section: {
      padding: 'py-16 sm:py-20 md:py-24',
      paddingX: 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16',
    },
    container: {
      maxWidth: 'max-w-7xl',
      centerX: 'mx-auto',
    },
    card: {
      padding: 'p-6',
      margin: 'mb-8 lg:mb-10',
      gap: 'gap-8 lg:gap-10',
    }
  },

  // Borders and Radius
  borders: {
    radius: {
      sm: 'rounded-lg',
      md: 'rounded-xl',
      lg: 'rounded-2xl',
      xl: 'rounded-3xl',
      full: 'rounded-full',
    },
    width: {
      thin: 'border',
      medium: 'border-2',
      thick: 'border-4',
    }
  },

  // Shadows
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
    '3xl': 'shadow-3xl',
  },

  // Animations and Transitions
  animations: {
    transition: {
      fast: 'transition-all duration-300 ease-in-out',
      medium: 'transition-all duration-500 ease-out',
      slow: 'transition-all duration-700 ease-in-out',
    },
    hover: {
      scale: 'hover:scale-105',
      scaleDown: 'hover:scale-95',
      translateY: 'hover:-translate-y-2',
      shadow: 'hover:shadow-xl',
    },
    active: {
      scale: 'active:scale-95',
    }
  },

  // Layout
  layout: {
    grid: {
      responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      center: 'justify-items-center items-stretch',
    },
    flex: {
      center: 'flex items-center justify-center',
      between: 'flex items-center justify-between',
      column: 'flex flex-col',
      wrap: 'flex flex-wrap',
    }
  },

  // Marine Theme Standards
  marine: {
    backgrounds: {
      primary: 'bg-gradient-to-br from-blue-900 to-cyan-800', // Main pages
      light: 'bg-gradient-to-br from-blue-50 to-cyan-50', // About sections
      auth: 'bg-gradient-to-br from-blue-900 to-cyan-800', // Auth pages
    },
    elements: {
      opacity: {
        standard: 'opacity-15',
        subtle: 'opacity-10',
        prominent: 'opacity-20'
      },
      container: {
        standard: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        narrow: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
        wide: 'max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8'
      },
      spacing: {
        section: 'pt-32 pb-32',
        content: 'relative z-10'
      }
    }
  }
};

// Utility functions for applying design tokens
export const applyTokens = {
  gradient: (gradient) => `bg-gradient-to-br ${DESIGN_TOKENS.colors.gradients[gradient]}`,
  spacing: (type, variant) => DESIGN_TOKENS.spacing[type][variant],
  typography: (size, weight = 'normal') => `${DESIGN_TOKENS.typography.fontSize[size]} ${DESIGN_TOKENS.typography.fontWeight[weight]}`,
  marine: {
    background: (type) => DESIGN_TOKENS.marine.backgrounds[type],
    container: (size = 'standard') => DESIGN_TOKENS.marine.elements.container[size],
    section: () => `${DESIGN_TOKENS.marine.elements.spacing.section} ${DESIGN_TOKENS.marine.elements.spacing.content}`,
    opacity: (level = 'standard') => DESIGN_TOKENS.marine.elements.opacity[level]
  }
};