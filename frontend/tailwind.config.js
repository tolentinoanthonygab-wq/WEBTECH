const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-md': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: '#f8fafc',
            foreground: '#0f172a',
            primary: { DEFAULT: '#2563eb', foreground: '#ffffff' },
            secondary: { DEFAULT: '#7c3aed', foreground: '#ffffff' },
            success: { DEFAULT: '#16a34a', foreground: '#ffffff' },
            warning: { DEFAULT: '#d97706', foreground: '#ffffff' },
            danger: { DEFAULT: '#dc2626', foreground: '#ffffff' },
          },
        },
        dark: {
          colors: {
            background: '#0f172a',
            foreground: '#f1f5f9',
            primary: { DEFAULT: '#3b82f6', foreground: '#ffffff' },
            secondary: { DEFAULT: '#8b5cf6', foreground: '#ffffff' },
          },
        },
      },
    }),
  ],
};
