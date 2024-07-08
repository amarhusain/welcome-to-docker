import { randomBytes, scrypt } from "crypto";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { JwtPayload, JwtPayloadResponse } from "../common/global";

const scryptAsync = promisify(scrypt);

export class AuthService {

    async generateJwt(payload: JwtPayload, JWT_KEY: string, expiresIn: string) {
        return jwt.sign(payload, JWT_KEY, {
            expiresIn: expiresIn,
        });
    }

    async pwdToHash(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;
        return `${buf.toString('hex')}.${salt}`;
    }

    async pwdCompare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split('.');
        const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
        return buf.toString('hex') === hashedPassword;
    }

    async verifyJwt(jwtToken: string, JWT_KEY: string) {
        return jwt.verify(jwtToken, JWT_KEY) as JwtPayloadResponse;
    }
}

export const authService = new AuthService();