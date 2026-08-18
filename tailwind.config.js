/** @type {import('tailwindcss').Config} */
/**
 * Token map from design-system.json.
 * Components must use these theme keys — never raw hex / px values.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      tablet: '480px',
      desktop: '1024px',
    },
    borderRadius: {
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      full: '9999px',
    },
    extend: {
      colors: {
        'canvas-top': '#2A1A1F',
        'canvas-mid': '#12141C',
        'canvas-bottom': '#2A1240',
        sidebar: '#0B0D14',
        'surface-card': 'rgba(30, 34, 48, 0.55)',
        'surface-secondary': 'rgba(255, 255, 255, 0.04)',
        'surface-pill': '#242B3D',
        'surface-elevated': '#131722',
        'accent-primary': '#F5A623',
        'accent-violet': '#8B5CF6',
        'accent-end': '#A855F7',
        facebook: '#1877F2',
        'devto-card': '#F4F4F5',
        'text-primary': '#FFFFFF',
        'text-secondary': '#9AA1B2',
        'text-tertiary': '#6B7280',
        'text-on-accent': '#12141C',
        'status-available': '#22C55E',
        'status-playing': '#8B5CF6',
        'border-hairline': 'rgba(255, 255, 255, 0.08)',
        'border-glass': 'rgba(255, 255, 255, 0.12)',
        'nav-active': 'rgba(139, 92, 246, 0.28)',
      },
      spacing: {
        'space-1': '4px',
        'space-2': '8px',
        'space-3': '12px',
        'space-4': '16px',
        'space-5': '20px',
        'space-6': '24px',
        'space-8': '32px',
        'space-10': '40px',
        'space-12': '48px',
        'avatar-lift': '140px',
        'avatar-sink': '100px',
        'avatar-notch': '8px',
      },
      width: {
        sidebar: '280px',
        rail: '320px',
        'avatar-mobile': '220px',
        'avatar-desktop': '200px',
        'avatar-compact': '120px',
        chip: '52px',
        'icon-3d': '64px',
      },
      height: {
        'avatar-mobile': '220px',
        'avatar-desktop': '200px',
        'avatar-compact': '120px',
        chip: '52px',
        'icon-3d': '64px',
        underline: '3px',
        'project-thumb': '160px',
      },
      minHeight: {
        tile: '156px',
        'tile-row': '120px',
      },
      minWidth: {
        'project-card': '220px',
      },
      maxWidth: {
        shell: '1536px',
        mobile: '430px',
        app: '540px',
        bio: '20rem',
      },
      gridTemplateColumns: {
        hero: '1fr minmax(0, 280px)',
      },
      fontFamily: {
        display: ['"Baloo 2"', '"SF Pro Rounded"', 'Quicksand', 'system-ui', 'sans-serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['2.75rem', { lineHeight: '1.1', fontWeight: '700' }],
        h1: ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['1.3125rem', { lineHeight: '1.3', fontWeight: '700' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.5', fontWeight: '500' }],
        body: ['0.9375rem', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['0.8125rem', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.01em' }],
        micro: ['0.6875rem', { lineHeight: '1.3', fontWeight: '600' }],
      },
      boxShadow: {
        card: '0 8px 32px rgba(0, 0, 0, 0.35)',
        avatar: '0 4px 20px rgba(245, 166, 35, 0.25)',
        icon: '0 10px 18px rgba(0, 0, 0, 0.28)',
      },
      backdropBlur: {
        glass: '24px',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(90deg, #F5A623 0%, #A855F7 100%)',
        'canvas-glow':
          'radial-gradient(ellipse 80% 50% at 18% -8%, #2A1A1F 0%, transparent 58%), radial-gradient(ellipse 70% 45% at 85% 108%, #2A1240 0%, transparent 52%)',
        'nav-active-fill': 'linear-gradient(90deg, rgba(139, 92, 246, 0.35) 0%, rgba(245, 166, 35, 0.08) 100%)',
        'email-card': 'linear-gradient(165deg, #3A5BA0 0%, #243056 52%, #1A2238 100%)',
        'facebook-card': 'linear-gradient(165deg, #5AB0FF 0%, #2E89F6 48%, #1877F2 100%)',
        'github-card': 'linear-gradient(165deg, #2C3038 0%, #12141A 100%)',
        'figma-card': 'linear-gradient(165deg, #2A3142 0%, #171A22 100%)',
      },
    },
  },
}
