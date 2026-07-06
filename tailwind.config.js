module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "system-ui", "sans-serif"],
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'gradient-shift': {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
        },
        'fade-in-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.4s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'slide-in': 'slide-in 0.3s ease-out backwards',
        'slide-in-1': 'slide-in 0.3s ease-out 0.15s backwards',
        'slide-in-2': 'slide-in 0.3s ease-out 0.2s backwards',
        'slide-in-3': 'slide-in 0.3s ease-out 0.25s backwards',
        'slide-in-4': 'slide-in 0.3s ease-out 0.3s backwards',
        'slide-in-5': 'slide-in 0.3s ease-out 0.35s backwards',
        'slide-in-6': 'slide-in 0.3s ease-out 0.4s backwards',
        'slide-in-7': 'slide-in 0.3s ease-out 0.45s backwards',
        'slide-in-8': 'slide-in 0.3s ease-out 0.5s backwards',
        'slide-in-9': 'slide-in 0.3s ease-out 0.55s backwards',
        'gradient-shift': 'gradient-shift 15s ease infinite',
      },
    },
  },
  plugins: [],
};
