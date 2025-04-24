module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // if using Next.js 13+
  ],
  safelist: [
    // Padding
    {
      pattern: /^p(x|y|t|r|b|l)?-/,
      variants: ["sm", "md", "lg", "xl", "2xl", "hover", "focus"],
    },

    // Margin
    {
      pattern: /^m(x|y|t|r|b|l)?-/,
      variants: ["sm", "md", "lg", "xl", "2xl"],
    },

    // Width and Height
    {
      pattern: /^(w|h)-/,
      variants: ["sm", "md", "lg", "xl", "2xl"],
    },

    // Flex and Grid
    {
      pattern: /^(flex|grid|col|row|gap)-/,
      variants: ["sm", "md", "lg", "xl", "2xl"],
    },

    // Background Colors
    {
      pattern:
        /^bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/,
      variants: ["hover", "focus", "active"],
    },

    // Text Colors
    {
      pattern:
        /^text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/,
      variants: ["hover", "focus", "active"],
    },

    // Gradients
    {
      pattern: /^bg-gradient-to-(t|tr|r|br|b|bl|l|tl)/,
    },
    {
      pattern: /^from-/,
    },
    {
      pattern: /^via-/,
    },
    {
      pattern: /^to-/,
    },

    // Borders
    {
      pattern: /^(border|rounded|ring)-/,
      variants: ["hover", "focus"],
    },

    // Shadows
    {
      pattern: /^shadow-/,
      variants: ["hover", "focus"],
    },

    // Typography
    {
      pattern: /^(font|text|leading|tracking)-/,
    },

    // Transitions and Animations
    {
      pattern: /^(transition|animate|transform|scale|rotate|translate)-/,
    },

    // Opacity
    {
      pattern: /^opacity-/,
      variants: ["hover", "focus"],
    },

    // Display
    {
      pattern: /^(block|inline|flex|grid|hidden)/,
      variants: ["sm", "md", "lg", "xl", "2xl"],
    },

    // Position
    {
      pattern: /^(static|fixed|absolute|relative|sticky)/,
    },

    // Z-index
    {
      pattern: /^z-/,
    },

    // Overflow
    {
      pattern: /^overflow-/,
    },

    // Specifically include some commonly used individual classes
    "container",
    "mx-auto",
    "space-y-4",
    "space-x-4",
    "gap-4",
    "gap-6",
    "gap-8",
    "p-4",
    "p-5",
    "p-6",
    "p-8",
    "p-10",
    "p-12",
    "p-16",
    "p-20",
    "px-4",
    "px-6",
    "px-8",
    "py-4",
    "py-6",
    "py-8",
    "py-12",
    "py-16",
    "py-20",
    "mt-1",
    "mt-2",
    "mt-4",
    "mt-6",
    "mt-8",
    "mt-10",
    "mt-12",
    "mb-1",
    "mb-2",
    "mb-4",
    "mb-6",
    "mb-8",
    "mb-10",
    "mb-12",
    "ml-1",
    "ml-2",
    "ml-4",
    "ml-auto",
    "mr-1",
    "mr-2",
    "mr-4",
    "mr-auto",
    "bg-white",
    "bg-black",
    "bg-transparent",
    "text-white",
    "text-black",
    "flex-row",
    "flex-col",
    "items-center",
    "items-start",
    "items-end",
    "justify-center",
    "justify-between",
    "justify-start",
    "justify-end",
    "rounded-md",
    "rounded-lg",
    "rounded-xl",
    "rounded-2xl",
    "rounded-full",
    "max-w-xs",
    "max-w-sm",
    "max-w-md",
    "max-w-lg",
    "max-w-xl",
    "max-w-2xl",
    "max-w-3xl",
    "max-w-4xl",
    "max-w-5xl",
    "max-w-6xl",
    "max-w-7xl",
    "h-full",
    "w-full",
    "h-screen",
    "w-screen",
    "min-h-screen",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
