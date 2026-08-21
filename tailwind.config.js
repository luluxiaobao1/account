/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./accountadmin/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 补充中间灰阶，用于更细腻的边框/弱文字层级
        gray: {
          150: "#eef0f2",
          250: "#dfe3e8",
          350: "#a8b0bb",
        },
      },
    },
  },
  plugins: [],
};
