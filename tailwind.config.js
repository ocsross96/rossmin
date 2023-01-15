module.exports = {
  mode: 'jit',
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    screens: {
      sm: '719px',
      md: '1023px',
      lg: '1144px',
      retina: {
        raw: '(min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx)'
      }
    },
    fontFamily: {
      sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif']
    },
    container: {
      padding: {
        DEFAULT: '1.5rem',
        sm: '0rem'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
