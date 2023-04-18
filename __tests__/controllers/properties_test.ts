import { Request, Response } from "express";
import PropertieModel from "../../api/models/properties"; // importa tu modelo de Mongoose
import { getPropertieList } from "../../api/controllers/properties";

jest.mock("../../api/models/properties"); // Mockeamos el modelo

let req: Request;
let res: Response;

beforeEach(() => {
  req = {} as Request;
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
});

describe("getPropertieList", () => {
  it("should return a list of properties when there are properties in the database", async () => {
    // Define lo que debe devolver el modelo mock cuando se llama a "find"
    const expectedProperties = [
      { id: 1, name: "Property 1" },
      { id: 2, name: "Property 2" },
      { id: 3, name: "Property 3" },
    ];
    jest
      .mocked(PropertieModel.find)
      .mockResolvedValueOnce(expectedProperties as any);

    // Ejecuta la función que quieres probar
    await getPropertieList(req, res);

    // Comprueba que la respuesta tiene el código de estado y la lista de propiedades esperados
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedProperties);
  });
});
