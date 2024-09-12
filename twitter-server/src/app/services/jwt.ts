import { User } from "@prisma/client";
import JWT from "jsonwebtoken";
import { join } from "path";
import { JWTUser } from "../clients/interface";
import dotenv from "dotenv";

dotenv.config();

// temp JWT Secret
const SECRET = process.env.JWT || "secret";

class JWTServices {
  public static GenereateJWT(user: User) {
    const payload: JWTUser = {
      id: user.id,
      email: user.email,
    };
    const token = JWT.sign(payload, SECRET);
    return token;
  }

  public static VerifyJWT(token: string) {
    try {
      const user = JWT.verify(token, SECRET);
      return user;
    } catch (error) {
      return null;
    }
  }
}

export default JWTServices;
