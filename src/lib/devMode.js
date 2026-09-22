// Lets you run the app locally without a real Firebase project: skips Google
// login and stores templates in localStorage instead of Firestore.
// Only activates in `npm run dev` (import.meta.env.DEV) — never in a production build,
// even if VITE_DEV_NO_AUTH ends up set somewhere it shouldn't.
export const DEV_NO_AUTH = import.meta.env.DEV && import.meta.env.VITE_DEV_NO_AUTH === 'true'
