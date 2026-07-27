/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        swing: {
          "0%":   { transform: "translateX(-50%) rotate(-20deg)" },
          "50%":  { transform: "translateX(-50%) rotate(20deg)" },
          "100%": { transform: "translateX(-50%) rotate(-20deg)" },
        },
      },
      keyframes: {
        beamSwing: {
          "0%":   { transform: "translateX(-50%) rotate(-22.5deg)" },
          "50%":  { transform: "translateX(-50%) rotate(22.5deg)" },
          "100%": { transform: "translateX(-50%) rotate(-22.5deg)" },
        },
      },
      animation: {
        // duration must roughly match SWING_SPEED = 0.8 in the JS sine wave
        // Math.sin(t * 0.8) completes a full cycle every (2π / 0.8) ≈ 7.85s
        beamSwing: "beamSwing 7.85s ease-in-out infinite",
      },
      animation: {
        swing: "swing 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}


