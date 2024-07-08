import dotenv from 'dotenv';
import { Config } from '../common/global';

dotenv.config();

const { DEVELOPMENT_DOMAIN, PRODUCTION_DOMAIN, JWT_KEY, JWT_EXPIRES_IN, SERVER_PORT, MONGO_URI_DEVELOPMENT, MONGO_URI_PRODUCTION, COMMUNICATION_SERVICES_CONNECTION_STRING } = process.env;

const jwtKey = JWT_KEY || 'E3229B4313A5EA2DBE7B229B4313A5EAEF954E31CE32EF954E31CE32DBE7B29B4313A5EA2EE3';
const jwtExpiresIn = JWT_EXPIRES_IN || '24h';
const serverPort = SERVER_PORT ? Number(SERVER_PORT) : 8180;
const emailConnStr = COMMUNICATION_SERVICES_CONNECTION_STRING || 'endpoint=https://shivamhomeocarecommunicationservice.india.communication.azure.com/;accesskey=HgRVNRs/RWjRx91/Zp7JDdqvVUDO5gEdD6i1e5iQb910oCRS9tldUv2JhksBvaj3aARrY3fm5ExplmkOfcJ2ag==';

// ------------ Uncomment for production -----------///
const mongoConnUri = MONGO_URI_PRODUCTION || '';
const appDomain = PRODUCTION_DOMAIN || 'https://shivamhomeocare.com';

// ------------ Uncomment for development -----------//
// const mongoConnUri = MONGO_URI_DEVELOPMENT || '';
// const appDomain = DEVELOPMENT_DOMAIN;

export const config: Config = {
    mongoConnUri,
    serverPort,
    jwtKey,
    jwtExpiresIn,
    emailConnStr,
    appDomain
}