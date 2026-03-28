import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../application/use-cases/RegisterUser";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const userRepository = new UserRepository();
      const registerUseCase = new RegisterUserUseCase(userRepository);

      const user = await registerUseCase.execute(name, email, password);

      res.status(201).json({
       message: "User registered successfully",
       user: {
       id: user.id,
       name: user.name,
       email: user.email,
       role: user.role
        }
    });
    } catch (error: any) {
      res.status(400).json({
        error: error.message
      });
    }
  }
}