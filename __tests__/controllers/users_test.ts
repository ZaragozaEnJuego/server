import { Request, Response } from "express";
import UserModel from "../../api/models/users";// importa tu modelo de Mongoose
import {
    getUser, 
    findOrCreateUser
} from "../../api/controllers/users";
import mongoose from "mongoose";

jest.mock("../../api/models/users"); // Mockeamos el modelo

let req: Request;
let res: Response;

beforeEach(() => {
    req = { params: {} } as Request;
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;
});

describe("getUser", () => {
    it("should return the user when a valid id is provided", async () => {
        // Define el objeto Request con un id válido
        req.params = { id: "6446b7e5415c3073bd604f02" };

        const expectedUser = {
            name: "Ismael Penacho",
            _id: "6446b7e5415c3073bd604f02",
            liquidity: 10000,
            mail: "774572@unizar.es",
            admin: false,
        };

        const UserModelpy = jest.spyOn(UserModel, "findById");
        UserModelpy.mockResolvedValue(expectedUser);

        // Crea una solicitud con un parámetro de id válido

        // Ejecuta la función que quieres probar
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        await getUser(req, res);

        // Comprueba que la respuesta tiene el código de estado y los datos de propiedad esperados
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            name: expectedUser.name,
            _id: expectedUser._id,
            liquidity: expectedUser.liquidity,
            mail: expectedUser.mail,
            admin: expectedUser.admin,
        });
    });

    it("should return a 400 error when no id is provided", async () => {
        // Define el objeto Request sin id
        req.params = {};
        // Ejecuta la función que quieres probar
        await getUser(req, res);

        // Comprueba que la respuesta tiene el código de estado y el mensaje de error esperados
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "No id provided" });
    });

    it("should return a 404 error when an invalid id is provided", async () => {
        // Define el objeto Request con un id inválido
        req.params = { id: "111" };

        // Define lo que debe devolver el modelo mock cuando se llama a "findById"
        jest.mocked(UserModel.findById).mockResolvedValueOnce(null);

        // Ejecuta la función que quieres probar
        await getUser(req, res);

        // Comprueba que la respuesta tiene el código de estado y el mensaje de error esperados
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            msg: "User does not exist",
        });
    });
});

describe("findOrCreateUser", () => {
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
    const existingUser = {
        name: "Ismael Penacho",
        liquidity: 10000,
        mail: "774572@unizar.es",
        admin: false,
    };
    it("should find an existing user and resolve with the user object", async () => {
  
      jest.spyOn(UserModel, "findOne").mockResolvedValueOnce(existingUser);
  
      await findOrCreateUser(existingUser.name, existingUser.mail, existingUser.admin);
  
      expect(UserModel.findOne).toHaveBeenCalledTimes(1);
      expect(UserModel.create).not.toHaveBeenCalled();
    });
  
    it("should reject with an error if there is an error with finding or creating the user", async () => {
        const error = new Error("Something went wrong");
        jest.spyOn(UserModel, "findOne").mockRejectedValueOnce(error);

        await expect(findOrCreateUser(existingUser.name, existingUser.mail, existingUser.admin)).rejects.toThrow(error);

        expect(UserModel.findOne).toHaveBeenCalledTimes(1);
        expect(UserModel.create).not.toHaveBeenCalled();
    });

    it("should create a new user and resolve with the new user object", async () => {
        const newUser = new UserModel({
            _id: "6446b7e5415c3073bd604f01",
            name: "pruebaTest",
            liquidity: 1000,
            mail: "pruebaTest@unizar.es",
            access: true,
            admin: false,
        });
        
      jest.spyOn(UserModel, "findOne").mockResolvedValueOnce(null);
      jest.spyOn(UserModel, "create").mockResolvedValueOnce([newUser]);

      await findOrCreateUser(newUser.name, newUser.mail, newUser.admin);

      expect(UserModel.findOne).toHaveBeenCalledTimes(1);
      expect(UserModel.create).toHaveBeenCalledTimes(1);
    });
});