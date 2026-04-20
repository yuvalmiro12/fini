import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Rubik', 'system-ui', 'sans-serif'],
        sans: ['Rubik', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#F7F5E8',
        creamDark: '#EFEADA',
        ink: '#1F1A15',
        inkSoft: '#4A4237',
        inkMute: '#8A8070',
        line: 'rgba(31,26,21,0.08)',
        lineSoft: 'rgba(31,26,21,0.05)',
        rose: '#FDDDE8',
        roseDeep: '#F9C6D7',
        pink: '#C85A8A',
        mint: '#D6EEE0',
        mintDeep: '#BEE3CB',
        green: '#5B8E6F',
        greenSoft: '#A7C9B4',
        lavender: '#E8ECFF',
        lavenderDeep: '#D4DBFA',
        blue: '#5A6FB8',
        income: '#5B8E6F',
        incomeTint: '#DDEEDF',
        expense: '#D47070',
        expenseTint: '#FADEDC',
        gold: '#C9A24D',
        goldTint: '#F3E7C7',
      },
    },
  },
  plugins: [],
}
export default config
