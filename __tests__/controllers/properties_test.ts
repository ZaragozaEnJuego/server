import { Request, Response } from "express";
import PropertieModel from "../../api/models/properties"; // importa tu modelo de Mongoose
import {
    getPropertie,
    getPropertieList,
} from "../../api/controllers/properties";
import WeatherDataModel from "../../api/models/stats";
import KindRulesModel from "../../api/models/kindRules";

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
        jest.mocked(PropertieModel.find).mockResolvedValueOnce(
            expectedProperties as any
        );

        // Ejecuta la función que quieres probar
        await getPropertieList(req, res);

        // Comprueba que la respuesta tiene el código de estado y la lista de propiedades esperados
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expectedProperties);
    });

    it("should return a 500 error when there is an error with the database", async () => {
        // Define el error que debe devolver el modelo mock cuando se llama a "find"

        jest.mocked(PropertieModel.find).mockRejectedValueOnce({});

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
            income: 5000,
            owner: "Pepe",
            kind: "groceries",
        };

        const expectedStats = [
            {
                date: new Date("2022-03-20T00:00:00Z"),
                income: 5249.94,
            },
            {
                date: new Date("2022-03-21T00:00:00Z"),
                income: 4899.9,
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
            income: expectedPropertie.income,
            owner: expectedPropertie.owner,
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
