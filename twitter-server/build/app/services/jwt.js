"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// temp JWT Secret
const SECRET = process.env.JWT || "secret";
class JWTServices {
    static GenereateJWT(user) {
        const payload = {
            id: user.id,
            email: user.email,
        };
        const token = jsonwebtoken_1.default.sign(payload, SECRET);
        return token;
    }
    static VerifyJWT(token) {
        try {
            const user = jsonwebtoken_1.default.verify(token, SECRET);
            return user;
        }
        catch (error) {
            return null;
        }
    }
}
exports.default = JWTServices;
