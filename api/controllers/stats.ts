import { Request, Response } from "express";
import axios from "axios";
import WeatherDataModel, { WeatherData } from "../models/stats";

const AEMET_API_URL =
  "https://opendata.aemet.es/opendata/api/observacion/convencional/datos/estacion/9434";
const AEMET_SKY_URL =
  "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/50297";
const PRECIO_LUZ_API_URL = "https://api.preciodelaluz.org/v1/prices/avg";
const AEMET_API_KEY = process.env.AEMET_API_KEY;
const TMIN_PRED = 20;
const TMAX_PRED = 30;

const getAemetData = async (): Promise<{ tmax: number; tmin: number }> => {
  /* Interface que para la función getAemetData */
  interface AemetResponse {
    fint: string;
    tamin: number;
    tamax: number;
  }

  try {
    /* El primer get tiene que conseguir los metadatos */
    const response = await axios.get(
      `${AEMET_API_URL}/?api_key=${AEMET_API_KEY}`
    );

    /* Obtener la URL del archivo de datos meteorológicos desde la respuesta*/
    const { datos } = response.data;
    const dataResponse = await axios.get<AemetResponse[]>(datos);

    /* Fecha de interes */
    const today = new Date();
    const yesterday = new Date(today.getTime() - 86400000);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    /* Nos quedamos con la temperatura de las 12:00 de ayer (normales) */
    const tmax =
      dataResponse.data.find(
        (s: { fint: string }) => s.fint === `${yesterdayStr}T12:00:00`
      )?.tamax ?? TMAX_PRED;
    const tmin =
      dataResponse.data.find(
        (s: { fint: string }) => s.fint === `${yesterdayStr}T12:00:00`
      )?.tamin ?? TMIN_PRED;

    return { tmax, tmin };
  } catch (error) {
    return { tmax: TMAX_PRED, tmin: TMIN_PRED };
  }
};

const getElectricityZaragozaPrice = async (): Promise<number> => {
  /* Interface para la función getElectricityZaragozaPrice */
  interface PriceResponse {
    date: string;
    market: string;
    price: number;
    units: string;
  }

  // Control de errores
  try {
    // Si la API funciona correctamente se hace el get y se cogen los datos de la web
    const response = await axios.get<PriceResponse>(
      `${PRECIO_LUZ_API_URL}?zone=PCB`
    );

    // En caso de no encontrar el campo se se pone 160 como valor predeterminado
    const price = response.data.price ?? 160;
    return price;
  } catch (error) {
    // Si la API no funciona en el momento de hacer la petición, se pone valor 160 predeterminado
    const price = 160;
    return price;
  }
};

const getSkyState = async (): Promise<string> => {
  try {
    const response = await axios.get(
      `${AEMET_SKY_URL}/?api_key=${AEMET_API_KEY}`
    );
    const { datos } = response.data;

    interface WeatherData {
      prediccion: {
        dia: {
          estadoCielo: {
            value: string;
            periodo: string;
            descripcion: string;
          }[];
        }[];
      };
    }

    const dataResponse = await axios.get<WeatherData>(datos);

    if (dataResponse?.data?.prediccion?.dia?.length === 0) {
      return "sunny";
    }

    const estadoCielo = dataResponse.data.prediccion.dia[0].estadoCielo
      .find((s) => s.periodo === "12-24")
      ?.descripcion?.toLowerCase();

    switch (estadoCielo) {
      case "despejado":
        return "sunny";
      case "poco nuboso":
      case "intervalos nubosos":
      case "nuboso":
      case "cubierto":
      case "muy nuboso":
      case "bruma":
      case "niebla":
      case "calima":
      case "nubes altas":
        return "cloudy";
      case "chubascos":
      case "lluvia ligera":
      case "lluvia":
      case "lluvia moderada":
      case "lluvia fuerte":
      case "chubascos tormentosos":
      case "nieve ligera":
      case "nieve":
      case "nieve moderada":
      case "nieve fuerte":
      case "granizo ligero":
      case "granizo":
      case "granizo moderado":
      case "granizo fuerte":
      case "tormenta":
        return "rainy";
      default:
        return "sunny";
    }
  } catch (error) {
    return "sunny";
  }
};

const setWeatherData = async () => {
  /* Obtener los valores de tmin y tmax de AEMET */
  const { tmax, tmin } = await getAemetData();

  /* Calcular temperatura media */
  const temperature = (tmax + tmin) / 2;

  /* Obtener el precio de la luz */
  const electricityPrice = await getElectricityZaragozaPrice();

  /* Obtener el estado del cielo */
  const skyState = await getSkyState();

  const savedWeatherData = await WeatherDataModel.create(
    {
      date: new Date(),
      temperature: temperature,
      state: skyState,
      electricity: electricityPrice,
    },
    { maxTimeMS: 20000 }
  ); // 20 segundos de tiempo máximo de espera
};
/**
 * @swagger
 * tags:
 *    name: Stats
 *    description: The stats managing API
 * /weather/:
 *    get:
 *      summary: Get Weather Data
 *      tags: [Stats]
 *      responses:
 *        200:
 *          description: Data received
 *          content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                       date:
 *                          type: Date
 *                       temperature:
 *                          type: number
 *                       state:
 *                          type: string
 *                       electricity:
 *                          type: number
 *        500:
 *           description: Internal error
 */
async function getWeatherData(req: Request, res: Response) {
  const today = new Date(); // Get current date
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // Date last month

  // Realiza la consulta a la base de datos
  // -1 indica orden descendente (más reciente a más antiguo)
  // limit para limitar los resultados a 30
  const weatherData = await WeatherDataModel.find({
    date: { $gte: thirtyDaysAgo, $lte: today },
  })
    .sort({ date: -1 })
    .limit(30);

  // Control de errores
  if (weatherData === null) {
    res.status(500).json({ msg: "Internal error" });
    return;
  }

  // Objeto json
  res.status(200).json(weatherData);
}

export {
  setWeatherData,
  getAemetData,
  getWeatherData,
  getElectricityZaragozaPrice,
  getSkyState,
};
