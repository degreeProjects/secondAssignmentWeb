import { Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";
import config from "../env.config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logger } from "../config/logger";

const userRepository = new UserRepository();

export class AuthController {
  async register(req: Request, res: Response) {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res
        .status(400)
        .send("missing one of the following: email, password, username");
    }

    try {
      const sameUser = await userRepository.getByEmail(email);
      if (sameUser) return res.status(409).send("email already exists");

      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);
      const user = await userRepository.create({
        email,
        password: encryptedPassword,
        username,
      });

      logger.info(`New user registered with email: ${email}`);
      return res.status(201).send(user);
    } catch (err) {
      return res.status(500).send("error while trying to register");
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send("missing email or password");

    try {
      const user = await userRepository.getByEmail(email);
      if (!user) return res.status(401).send("email is incorrect");

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).send("password is incorrect");

      const options = {
        expiresIn: config.jwtExpiration,
      } as jwt.SignOptions;

      const accessToken = jwt.sign(
        { _id: user._id },
        config.jwtSecret,
        options
      );
      const refreshToken = jwt.sign({ _id: user._id }, config.jwtRefreshSecret);
      if (!user.refreshTokens) {
        user.refreshTokens = [refreshToken];
      } else {
        user.refreshTokens.push(refreshToken);
      }

      await user.save();
      return res.status(200).send({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (err) {
      return res.status(500).send("error while trying to login");
    }
  }

  async logout(req: Request, res: Response) {
    const authHeader = req.headers["authorization"];
    const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (!refreshToken) {
      return res.status(401).send("refresh token is required");
    }

    jwt.verify(refreshToken, config.jwtRefreshSecret, async (err, decoded) => {
      if (err)
        return res
          .status(401)
          .send("something is wrong with the provided refresh token");

      const userId = (decoded as { _id: string })?._id;
      if (!userId) return res.status(401).send("invalid refresh token");

      try {
        const userDb = await userRepository.getById(userId);
        if (!userDb) return res.status(401).send("user not found");

        if (
          !userDb?.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = [];
          await userDb.save();
          return res.status(401).send("refresh token not recognized");
        } else {
          userDb.refreshTokens = userDb.refreshTokens.filter(
            (token) => token !== refreshToken
          );
          await userDb.save();
          return res.sendStatus(200);
        }
      } catch (err) {
        res.status(500).send("error while trying to logout");
      }
    });
  }

  async refresh(req: Request, res: Response) {
    const authHeader = req.headers["authorization"];
    const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (!refreshToken) {
      return res.status(401).send("refresh token is required");
    }

    jwt.verify(refreshToken, config.jwtRefreshSecret, async (err, decoded) => {
      if (err)
        return res
          .status(401)
          .send("something is wrong with the provided refresh token");

      const userId = (decoded as { _id: string })?._id;
      if (!userId) return res.status(401).send("Invalid refresh token");

      try {
        const userDb = await userRepository.getById(userId);
        if (!userDb) return res.status(401).send("User not found");

        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = [];
          await userDb.save();
          return res.sendStatus(401);
        }

        const options = {
          expiresIn: config.jwtExpiration,
        } as jwt.SignOptions;

        const accessToken = jwt.sign(
          { _id: userId },
          config.jwtSecret,
          options
        );
        const newRefreshToken = jwt.sign(
          { _id: userId },
          config.jwtRefreshSecret
        );
        userDb.refreshTokens = userDb.refreshTokens.filter(
          (token) => token !== refreshToken
        );
        userDb.refreshTokens.push(newRefreshToken);
        await userDb.save();
        return res.status(200).send({
          accessToken: accessToken,
          refreshToken: newRefreshToken,
        });
      } catch (err) {
        res.status(500).send("Error while trying to refresh");
      }
    });
  }
}

export default new AuthController();
