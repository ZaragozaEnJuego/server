import { Request, Response } from "express";
import axios from "axios";
import WeatherDataModel, { WeatherData } from "../models/stats";

const AEMET_API_URL = 'https://opendata.aemet.es/opendata/api/observacion/convencional/datos/estacion/9434';
const AEMET_SKY_URL = 'https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/50297';
const PRECIO_LUZ_API_URL = 'https://api.preciodelaluz.org/v1/prices/avg';
const AEMET_API_KEY = process.env.AEMET_API_KEY;

interface Temperatures {
  tmin: number;
  tmax: number;
}

/* Esta función consigue la temperatura máxima y mínima */
const getAemetData = async (): Promise<{ tmax: number, tmin: number }> => {

  /* Interface que para la función getAemetData */
  interface AemetResponse {
      fecha: string;
      tmax: number;
      tmin: number;
  }

  /* El primer get tiene que conseguir los metadatos */
  const response = await axios.get(`${AEMET_API_URL}/?api_key=${AEMET_API_KEY}`);
      
  /* Obtener la URL del archivo de datos meteorológicos desde la respuesta*/
  const { datos } = response.data;
  const dataResponse = await axios.get<AemetResponse[]>(datos);

  /* Control de errores */
  if (dataResponse === undefined) {
    return { tmax: 30, tmin: 20 };
  }

  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);
  
  /* Nos quedamos con la temperatura de las 12 */
  const tmax = dataResponse.data.find((s: { fecha: string; }) => s.fecha === `${dateStr}T12:00:00`)?.tmax ?? 30;
  const tmin = dataResponse.data.find((s: { fecha: string; }) => s.fecha === `${dateStr}T12:00:00`)?.tmin ?? 20;
 
  return { tmax, tmin };

}

const getElectricityZaragozaPrice = async (): Promise<number> => {

  /* Interface para la función getElectricityZaragozaPrice */
  interface PriceResponse {
    date: string;
    market: string;
    price: number;
    units: string;
  }

  // Se coge la información del precio de la luz
  const response = await axios.get<PriceResponse>(`${PRECIO_LUZ_API_URL}?zone=PCB`);
  const price = response.data.price;

  /* Control de errores */
  if(response === undefined) {
    const price = 100;
  }

  return price;
};

const getSkyState = async (): Promise<String> => {

  // Hacer una llamada a la API de AEMET para obtener la información meteorológica
  const response = await axios.get(`${AEMET_SKY_URL}/?api_key=${AEMET_API_KEY}`);
      
  // Obtener la URL del archivo de datos meteorológicos desde la respuesta
  const { datos } = response.data;

  // Interface para tratar los datos que llegan del get
  interface ResponseWeather {
    prediccion:{
      dia:{
        estadoCielo:{
          value:string,
          periodo:string,
          descripcion:string,
        }[]
      }
    }
  }

  const dataResponse = await axios.get<ResponseWeather>(datos);

  /* Control de errores */
  if (dataResponse === undefined) {
    return "sunny";
  }
      
  // Obtener la información del estado del cielo en el periodo de 12-24
  const estadoCielo  = dataResponse.data.prediccion.dia.estadoCielo.find((s: { periodo: string; }) => s.periodo === "12-24")?.descripcion;

  switch (estadoCielo) {
    case "Despejado":
      return "sunny";
    case "Poco nuboso":
      return "cloudy";
    case "Intervalos nubosos":
      return "cloudy";
    case "Nuboso":
      return "cloudy";
    case "Cubierto":
      return "cloudy";
    case "Muy nuboso":
      return "cloudy";
    case "Bruma":
      return "cloudy";
    case "Niebla":
      return "cloudy";
    case "Calima":
      return "cloudy";
    case "Nubes altas":
      return "cloudy";
    default:
      return "rainy";
  }
};

const setWeatherData = async () => {
  /* Obtener los valores de tmin y tmax de AEMET */
  let { tmax, tmin } = await getAemetData();

  /* Calcular temperatura media */
  const temperature = tmax + tmin / 2;

  /* Obtener el precio de la luz */
  const electricityPrice = await getElectricityZaragozaPrice();

  /* Obtener el estado del cielo */
  const skyState = await getSkyState();

  /* Introduzco la información a la base de datos */

  const savedWeatherData = await WeatherDataModel.create({
    fecha: new Date(), 
    tmed: temperature, 
    estadoCielo: skyState, 
    electricidad: electricityPrice 
  });
};

async function getWeatherData(req: Request, res: Response) {
  
  const today = new Date(); // Get current date
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // Date last month

  // Realiza la consulta a la base de datos
  const weatherData = await WeatherDataModel.find({
    date: { $gte: thirtyDaysAgo, $lte: today },
  });
  if (weatherData === null) {
    res.status(500).json({ msg: "Internal error" });
    return;
  }

  // Aquí falta la respuesta json
}

export { setWeatherData, getWeatherData };