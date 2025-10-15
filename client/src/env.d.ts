/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string
  // כאן תוכל להוסיף עוד משתני סביבה אם תשתמש בעתיד
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
