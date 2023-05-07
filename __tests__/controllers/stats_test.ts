import {
  getAemetData,
  getElectricityZaragozaPrice,
  getSkyState,
} from "../../api/controllers/stats";
import axios from "axios";

jest.mock("axios");

describe("getAemetData", () => {
  // Test para comprobar que la función devuelve temperaturas
  // cuando la API funciona correctamente
  it("should return the correct weather data", async () => {
    const aemetResponse = {
      datos: "http://datos",
    };

    const today = new Date();
    const yesterday = new Date(today.getTime() - 86400000);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const aemetDataResponse = [
      {
        fint: `${yesterdayStr}T12:00:00`,
        tamax: 20,
        tamin: 10,
      },
      {
        fint: `${yesterdayStr}T12:00:00`,
        tamax: 18,
        tamin: 8,
      },
    ];

    // Se configura el mock de axios para que devuelva los valores que se necesitan
    (axios.get as jest.MockedFunction<typeof axios.get>)
      .mockResolvedValueOnce({ data: aemetResponse })
      .mockResolvedValueOnce({ data: aemetDataResponse });

    const result = await getAemetData();

    // Se comprueba que devuelve los valores esperados
    expect(result.tmax).toEqual(expect.any(Number));
    expect(result.tmin).toEqual(expect.any(Number));

    // Se restaura la función axios.get original
    jest.spyOn(axios, "get").mockRestore();
  });
});

describe("getElectricityZaragozaPrice", () => {
  // Test para comprobar que la función devuelve el precio de la electricidad
  // cuando la API funciona correctamente
  it("should return the electricity price when the API returns data", async () => {
    // Se define el precio esperado y se crea un mock de la función
    // axios.get que devuelve el precio esperado
    const expectedPrice = 100;
    jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ data: { price: expectedPrice } });

    // Se llama a la función que se quiere testear
    // y se guarda el resultado en una variable
    const result = await getElectricityZaragozaPrice();

    // Se comprueba que el resultado es igual a un número
    expect(result).toEqual(expect.any(Number));

    // Se restaura la función axios.get original
    jest.spyOn(axios, "get").mockRestore();
  });

  // Test para comprobar que la función devuelve el precio por defecto (160) 
  // cuando la API no funciona correctamente
  it("should return the default electricity price when the API is down", async () => {
    // Se crea un mock de la función axios.get que devuelve un error simulando que la API no funciona
    jest.spyOn(axios, "get").mockRejectedValueOnce(new Error("API is down"));

    // Se llama a la función que se quiere testear y se guarda el resultado en una variable
    const result = await getElectricityZaragozaPrice();

    // Se comprueba que el resultado es igual al precio por defecto (160)
    expect(result).toBe(160);

    // Se restaura la función axios.get original
    jest.spyOn(axios, "get").mockRestore();
  });
});

describe("getSkyState", () => {
  // Test para comprobar que la función devuelve el estado del cielo
  it('should return "sunny" when AEMET API response is undefined', async () => {
    jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ data: { datos: undefined } });
    const skyState = await getSkyState();
    expect(skyState).toBe("sunny");
  });

  it('should return "sunny" when AEMET API response has no valid sky state description', async () => {
    const mockResponse = {
      data: {
        datos: "http://www.aemet.es/xml/municipios/localidad_28079.xml",
      },
    };
    jest.spyOn(axios, "get").mockResolvedValueOnce(mockResponse);
    const skyState = await getSkyState();
    expect(skyState).toBe("sunny");
  });

  it('should return "sunny" when AEMET API response has "Despejado" sky state description', async () => {
    const mockResponse = {
      data: {
        datos: "http://www.aemet.es/xml/municipios/localidad_28079.xml",
        prediccion: {
          dia: [
            {
              estadoCielo: [
                {
                  value: "11",
                  periodo: "00-12",
                  descripcion: "Despejado",
                },
                {
                  value: "11",
                  periodo: "12-24",
                  descripcion: "Despejado",
                },
              ],
            },
          ],
        },
      },
    };
    jest.spyOn(axios, "get").mockResolvedValueOnce(mockResponse);
    const skyState = await getSkyState();
    expect(skyState).toBe("sunny");
  });
});
