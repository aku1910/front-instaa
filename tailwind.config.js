/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      media:{
s:"400px"
      },
      colors:{
        brand:'#4CB5F9',
        facebook:'#385185',
        link:'#00376b',
        brend:'#0095F6'
      },
      backgroundImage:{
        'logo-pattern':'url(https://static.cdninstagram.com/images/instagram/xig/homepage/phones/home-phones.png?__makehaste_cache_breaker=HOgRclNOosk.png)'
      },
    },
  },
  plugins: [],
}