/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F7F7F9",
        black: "#000000",
        light: "#EAF1FF",
        lighthover: "#D6E5FF",
        lightactive: "#91BAFF",
        normal: "#3E6FFA",
        normalhover: "#191FD9",
        normalactive: "#002086",
        main200: "#1E1E1E",
        main100: "#242C6C",
        main200: "#121212",
        gray200: "#BFBFBF",
        gray100: "#D2D2D2",
        gray300: "#D9D9D9",

        // 다크모드/테마용 색상 (CSS 변수 기반)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // 카드 컴포넌트 색상
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // 팝오버(툴팁/모달 등) 컴포넌트 색상
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        // 프라이머리(주요 액션 버튼 등) 색상
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // 세컨더리(보조 버튼 등) 색상
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // 음영, 비활성화 색상
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        // 강조 색상
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        "pre-black": ["Pretendard-Black", "sans-serif"],
        "pre-extrabold": ["Pretendard-ExtraBold", "sans-serif"],
        "pre-bold": ["Pretendard-Bold", "sans-serif"],
        "pre-semibold": ["Pretendard-SemiBold", "sans-serif"],
        "pre-regular": ["Pretendard-Regular", "sans-serif"],
        "pre-medium": ["Pretendard-Medium", "sans-serif"],
        "pre-light": ["Pretendard-Light", "sans-serif"],
        "pre-thin": ["Pretendard-Thin", "sans-serif"],
        "pre-extralight": ["Pretendard-ExtraLight", "sans-serif"],
      },
      fontSize: {
        8: "8px",
        10: "10px",
        12: "12px",
        14: "14px",
        16: "16px",
        20: "20px",
        24: "24px",
      },
    },
  },
  plugins: [],
};
