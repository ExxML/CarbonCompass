/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: 'rgb(66, 133, 244)',
                    600: 'rgb(52, 120, 236)',
                    100: 'rgb(222, 235, 255)',
                },
            },
            borderRadius: {
                'panel': '14px',
                'input': '10px',
            },
            boxShadow: {
                'panel': '0 2px 8px rgba(0, 0, 0, 0.14)',
                'panel-strong': '0 4px 16px rgba(0, 0, 0, 0.22)',
            },
        },
    },
    plugins: [],
}
