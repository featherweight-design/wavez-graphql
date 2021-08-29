declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET: string;
      SENDGRID_API_KEY: string;
      NODE_ENV: 'development' | 'production';
      ORIGIN: string;
      PORT?: string;
      WAVEZ_FROM_EMAIL: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
