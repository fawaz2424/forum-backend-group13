import jwt from "jsonwebtoken";
import { authMiddleware } from "../authMiddleware";

jest.mock("jsonwebtoken");

describe("authMiddleware", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 401 if no token is provided", () => {
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
  });

  it("should return 401 if token is invalid", () => {
    req.headers.authorization = "Bearer badtoken";

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
  });

  it("should call next if token is valid", () => {
    req.headers.authorization = "Bearer goodtoken";

    (jwt.verify as jest.Mock).mockReturnValue({
      id: "u1",
      role: "user",
    });

    authMiddleware(req, res, next);

    expect(req.user).toEqual({
      id: "u1",
      role: "user",
    });
    expect(next).toHaveBeenCalledTimes(1);
  });
});