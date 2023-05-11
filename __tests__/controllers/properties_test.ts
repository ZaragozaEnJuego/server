import { Request, Response } from "express";
import PropertieModel from "../../api/models/properties"; // importa tu modelo de Mongoose
import {
  getPropertie,
  getPropertieList,
  getPropertieRules,
  propertieBuy,
} from "../../api/controllers/properties";
import WeatherDataModel from "../../api/models/stats";
import KindRulesModel from "../../api/models/kindRules";
import UserModel from "../../api/models/users";
import mongoose from "mongoose";

jest.mock("../../api/models/properties"); // Mockeamos el modelo

let req: Request;
let res: Response;

beforeEach(() => {
  req = { params: {} } as Request;
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
    jest.spyOn(PropertieModel, "find").mockReturnValueOnce({
      limit: jest.fn().mockReturnValueOnce(expectedProperties),
    } as any);

    // Ejecuta la función que quieres probar
    await getPropertieList(req, res);

    // Comprueba que la respuesta tiene el código de estado y la lista de propiedades esperados
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedProperties);
  });

  it("should return a 500 error when there is an error with the database", async () => {
    // Define el error que debe devolver el modelo mock cuando se llama a "find"

    jest.spyOn(PropertieModel, "find").mockReturnValueOnce({
      limit: jest.fn().mockRejectedValueOnce({}),
    } as any);

    // Ejecuta la función que quieres probar
    await getPropertieList(req, res);

    // Comprueba que la respuesta tiene el código de estado y el error esperados
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("getPropertie", () => {
  it("should return the propertie when a valid id is provided", async () => {
    // Define el objeto Request con un id válido
    req.params = { id: "642ffe7b687431a7aad27610" };

    const expectedPropertie = {
      name: "Bonaparte",
      _id: "642ffe7b687431a7aad27610",
      address: "Avenida Francisco de Goya, 17",
      price: 200000,
      baseIncome: 5000,
      kind: "groceries",
    };

    const expectedStats = [
      {
        date: new Date("2022-03-20T00:00:00Z"),
        baseIncome: 5249.94,
      },
      {
        date: new Date("2022-03-21T00:00:00Z"),
        baseIncome: 4899.9,
      },
    ];

    const expectedWeatherData = [
      {
        date: new Date("2022-03-20T00:00:00Z"),
        temperature: 25,
        electricity: 0.3,
        state: "sunny",
      },
      {
        date: new Date("2022-03-21T00:00:00Z"),
        temperature: 18,
        electricity: 0.5,
        state: "cloudy",
      },
    ];
    const expectedKindRulesData = {
      kind: "apartment",
      MaxTemperature: {
        value: 30,
        modifier: 0.1,
      },
      MinTemperature: {
        value: 10,
        modifier: -0.05,
      },
      EnergyConsumption: 0.2,
      Weather: {
        sunny: 0.05,
        cloudy: -0.02,
        rainy: -0.1,
      },
    };
    const propertieSpy = jest.spyOn(PropertieModel, "findById");
    propertieSpy.mockResolvedValue(expectedPropertie);

    const weatherDataSpy = jest.spyOn(WeatherDataModel, "find");
    weatherDataSpy.mockResolvedValue(expectedWeatherData);

    const kindRulesSpy = jest.spyOn(KindRulesModel, "findOne");
    kindRulesSpy.mockResolvedValue(expectedKindRulesData);

    // Crea una solicitud con un parámetro de id válido

    // Ejecuta la función que quieres probar
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    await getPropertie(req, res);

    // Comprueba que la respuesta tiene el código de estado y los datos de propiedad esperados
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      name: expectedPropertie.name,
      _id: expectedPropertie._id,
      address: expectedPropertie.address,
      price: expectedPropertie.price,
      baseIncome: expectedPropertie.baseIncome,
      kind: expectedPropertie.kind,
      stats: expectedStats,
    });
  });

  it("should return a 400 error when no id is provided", async () => {
    // Define el objeto Request sin id

    // Ejecuta la función que quieres probar
    await getPropertie(req, res);

    // Comprueba que la respuesta tiene el código de estado y el mensaje de error esperados
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: "No id provided" });
  });

  it("should return a 404 error when an invalid id is provided", async () => {
    // Define el objeto Request con un id inválido
    req.params = { id: "642ffe7b687431a7aad27610" };

    // Define lo que debe devolver el modelo mock cuando se llama a "findById"
    jest.mocked(PropertieModel.findById).mockResolvedValueOnce(null);

    // Ejecuta la función que quieres probar
    await getPropertie(req, res);

    // Comprueba que la respuesta tiene el código de estado y el mensaje de error esperados
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Propertie does not exist",
    });
  });
});

describe("getPropertieRules function", () => {
  test("should return 404 if propertieId is not provided", async () => {
    await getPropertieRules(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Not found, propertie id is required",
    });
  });

  test("should return 404 if propertie does not exist", async () => {
    const propertieId = "642ffe7b687431a7aad27610";
    req.params = { id: propertieId };

    jest.spyOn(PropertieModel, "findById").mockResolvedValueOnce(null);

    await getPropertieRules(req, res);

    expect(PropertieModel.findById).toHaveBeenCalledWith(propertieId);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Not found, propertie does not exist",
    });
  });

  test("should return 500 if propertie have not kind rules associated", async () => {
    const propertieId = "642ffe7b687431a7aad27610";
    const propertie = {
      _id: propertieId,
      name: "Bonaparte",
      kind: "groceries",
      lng: -0.8881719,
      lat: 41.6427539,
      price: 125355,
      address: "Avenida Francisco de Goya, 17",
      baseIncome: 1611,
      owner: "Pepe",
    };

    req.params = { id: propertieId };

    jest.spyOn(PropertieModel, "findById").mockResolvedValueOnce(propertie);
    jest.spyOn(KindRulesModel, "findOne").mockRejectedValueOnce({});

    await getPropertieRules(req, res);

    expect(PropertieModel.findById).toHaveBeenCalledWith(propertieId);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Propertie have not kind rules associated",
    });
  });

  test("should return kind rules associated to the propertie", async () => {
    const propertieId = "642ffe7b687431a7aad27610";
    const propertie = {
      _id: propertieId,
      name: "Bonaparte",
      kind: "groceries",
      lng: -0.8881719,
      lat: 41.6427539,
      price: 125355,
      address: "Avenida Francisco de Goya, 17",
      baseIncome: 1611,
      owner: "Pepe",
    };
    const kindRules = [
      { kind: "groceries", Weather: { sunny: 0.1 } },
      { kind: "transport", Weather: { cloudy: 0.2 } },
    ];
    req.params = { id: propertieId };
    jest.spyOn(PropertieModel, "findById").mockResolvedValueOnce(propertie);
    jest.spyOn(KindRulesModel, "findOne").mockResolvedValueOnce(kindRules[0]);

    await getPropertieRules(req, res);

    expect(PropertieModel.findById).toHaveBeenCalledWith(propertieId);
    expect(KindRulesModel.findOne).toHaveBeenCalledWith({
      kind: propertie.kind,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(kindRules[0]);
  });
});

describe("propertieBuy", () => {
  // Mock data
  const propertieId = "612f398eb657d971ec1771b1";
  const ownerId = "612f3998b657d971ec1771b3";

  it("should return 404 if no propertie id provided", async () => {
    // Arrange
    const req = { params: {}, body: { ownerId } } as Request;

    req.params = {};
    req.body = { ownerId };

    // Act
    await propertieBuy(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Not found, propertie id is required",
    });
  });

  it("should return 400 if no owner id provided", async () => {
    // Arrange

    req.params = { id: propertieId };
    req.body = {};

    // Act
    await propertieBuy(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "owner id is required",
    });
  });

  it("should return 400 if landlord does not have enough money", async () => {
    // Arrange
    req.params = { id: propertieId };
    req.body = { ownerId };
    const propertie = {
      _id: propertieId,
      name: "Test propertie",
      price: 50000,
      owner: undefined,
    };
    const landlord = {
      _id: ownerId,
      name: "Test landlord",
      liquidity: 40000,
    };

    jest.spyOn(UserModel, "findById").mockResolvedValue(landlord);
    jest.spyOn(PropertieModel, "findById").mockResolvedValue(propertie);

    // Act
    await propertieBuy(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Not enought money",
    });
  });

  it("should return 400 if owner id is invalid", async () => {
    // Arrange
    req.params = { id: propertieId };
    req.body = { ownerId };
    const propertie = {
      _id: propertieId,
      name: "Test propertie",
      price: 50000,
      owner: undefined,
    };
    const landlord = {
      _id: ownerId,
      name: "Test landlord",
      liquidity: 40000,
    };
    jest.spyOn(UserModel, "findById").mockResolvedValue(null);
    jest.spyOn(PropertieModel, "findById").mockResolvedValue(propertie);

    // Act
    await propertieBuy(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Wrong landlord Id",
    });
  });
  it("should return updated propertie when transaction succeeds", async () => {
    req.params = { id: propertieId };
    req.body = { ownerId };
    const propertie = {
      _id: propertieId,
      name: "Test propertie",
      price: 50000,
      owner: undefined,
    };
    const landlord = {
      _id: ownerId,
      name: "Test landlord",
      liquidity: 60000,
    };

    const landlordAfterTransaction = {
      _id: ownerId,
      name: landlord.name,
      liquidity: landlord.liquidity - propertie.price,
    };

    jest.spyOn(UserModel, "findById").mockResolvedValueOnce(landlord);
    jest.spyOn(PropertieModel, "findById").mockResolvedValueOnce(propertie);
    jest.spyOn(PropertieModel, "findByIdAndUpdate").mockResolvedValueOnce({
      ...propertie,
      ownerId: landlord._id,
    });
    jest
      .spyOn(UserModel, "findByIdAndUpdate")
      .mockResolvedValueOnce(landlordAfterTransaction);

    // Act
    await propertieBuy(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith({
      id: propertie._id,
    });
  });
});
