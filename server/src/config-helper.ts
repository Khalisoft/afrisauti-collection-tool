import * as fs from 'fs';
import { S3 } from 'aws-sdk';

export type CommonVoiceConfig = {
  VERSION: string;
  PROD: boolean;
  SERVER_PORT: number;
  DB_ROOT_USER: string;
  DB_ROOT_PASS: string;
  MYSQLUSER: string;
  MYSQLPASS: string;
  MYSQLDBNAME: string;
  MYSQLHOST: string;
  MYSQLPORT: number;
  BUCKET_NAME: string;
  BUCKET_LOCATION: string;
  ENVIRONMENT: string;
  RELEASE_VERSION?: string;
  SECRET: string;
  S3_CONFIG: S3.Types.ClientConfiguration;
  ADMIN_EMAILS: string;
  AUTH0: {
    DOMAIN: string;
    CLIENT_ID: string;
    CLIENT_SECRET: string;
  };
  BASKET_API_KEY?: string;
  IMPORT_SENTENCES: boolean;
  REDIS_URL: string;
};

const DEFAULTS: CommonVoiceConfig = {
  VERSION: null, // Migration number (e.g. 20171205171637), null = most recent
  RELEASE_VERSION: null, // release version set by nubis,
  PROD: true, // Set to true for staging and production.
  SERVER_PORT: 8080,
  DB_ROOT_USER: 'root', // For running schema migrations.
  DB_ROOT_PASS: 'Aman@Secured2019',
  MYSQLUSER: 'voicecommons', // For normal DB interactions.
  MYSQLPASS: 'voicecommons',
  MYSQLDBNAME: 'voiceweb',
  MYSQLHOST: 'localhost',
  MYSQLPORT: 3306,
  BUCKET_NAME: 'afri-speech',
  BUCKET_LOCATION: 'us-east-2',
  ENVIRONMENT: 'default',
  SECRET: 'TODO: Set a secure SECRET in config.json',
  ADMIN_EMAILS:
    '["amansulaiman92@gmail.com", "i@amansulaiman.me", "hubuktechnology@outlook.com"]', // array of admin emails, as JSON
  S3_CONFIG: {
    signatureVersion: 'v4',
    useDualstack: true,
  },
  AUTH0: {
    DOMAIN: 'amansulaiman.auth0.com',
    CLIENT_ID: 'yi5ySSvPKO0iH1f140H9pIcMy2Rth45L',
    CLIENT_SECRET:
      'm5ULp3Y274E_5cOZrApMaA5VAu73Cin2Azhbl9_RRXxNAiKItjGuSOi3j4vJw2Ef',
  },
  IMPORT_SENTENCES: true,
  REDIS_URL: null,
};

let injectedConfig: CommonVoiceConfig;

export function injectConfig(config: any) {
  injectedConfig = { ...DEFAULTS, ...config };
}

let loadedConfig: CommonVoiceConfig;

export function getConfig(): CommonVoiceConfig {
  if (injectedConfig) {
    return injectedConfig;
  }

  if (loadedConfig) {
    return loadedConfig;
  }

  let config = null;
  try {
    let config_path = process.env.SERVER_CONFIG_PATH || './config.json';
    config = JSON.parse(fs.readFileSync(config_path, 'utf-8'));
  } catch (err) {
    console.error(err, 'could not load config.json, using defaults');
  }
  loadedConfig = { ...DEFAULTS, ...config };

  return loadedConfig;
}
