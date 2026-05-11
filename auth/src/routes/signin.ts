import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@eftickets/common";
import { Password } from "../services/password";
import { User } from "../models/user";
import { UserDocMethod } from "../types/IUser";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password!"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    await sendTokenResponse(existingUser as any, 200, res);
  }
);

interface TokenOptions {
  maxAge: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
}

const sendTokenResponse = async (
  user: UserDocMethod,
  codeStatus: number,
  res: Response
) => {
  const token = await user.getJwtToken();

  const options: TokenOptions = {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  };

  res.status(codeStatus).cookie("session", token, options).send({
    id: user.id,
    email: user.email,
  });
};

export { router as signinRouter };
