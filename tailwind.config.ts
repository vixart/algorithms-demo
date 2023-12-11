import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          1: "#DCEEFB",
          2: "#B6E0FE",
          3: "#84C5F4",
          4: "#62B0E8",
          5: "#4098D7",
          6: "#2680C2",
          7: "#186FAF",
          8: "#0F609B",
          9: "#0A558C",
          10: "#003E6B",
        },
        secondary: {
          1: "#FFFBEA",
          2: "#FFF3C4",
          3: "#FCE588",
          4: "#FADB5F",
          5: "#F7C948",
          6: "#F0B429",
          7: "#DE911D",
          8: "#CB6E17",
          9: "#B44D12",
          10: "#8D2B0B",
        },
        neutral: {
          1: "#F0F4F8",
          2: "#D9E2EC",
          3: "#BCCCDC",
          4: "#9FB3C8",
          5: "#829AB1",
          6: "#627D98",
          7: "#486581",
          8: "#334E68",
          9: "#243B53",
          10: "#102A43",
        },
        sup1: {
          1: "#E0FCFF",
          2: "#BEF8FD",
          3: "#87EAF2",
          4: "#54D1DB",
          5: "#38BEC9",
          6: "#2CB1BC",
          7: "#14919B",
          8: "#0E7C86",
          9: "#0A6C74",
          10: "#044E54",
        },
        sup2: {
          1: "#FFEEEE",
          2: "#FACDCD",
          3: "#F29B9B",
          4: "#E66A6A",
          5: "#D64545",
          6: "#BA2525",
          7: "#A61B1B",
          8: "#911111",
          9: "#780A0A",
          10: "#610404",
        },
      },
    },
  },
  plugins: [],
};
export default config;
