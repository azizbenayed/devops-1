import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@eftickets/common";

import { User } from "../models/user";
import { UserDocMethod } from "../types/IUser";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    await user.save();

    await sendTokenResponse(user as any, 201, res);
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

  res.status(codeStatus).cookie("token", token, options).send({
    id: user.id,
    email: user.email,
  });
};

export { router as signupRouter };
