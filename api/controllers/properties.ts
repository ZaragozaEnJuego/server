import { Request, Response } from "express";
import WeatherDataModel from "../models/stats";
import KindRulesModel from "../models/kindRules";
import mongoose from "mongoose";
import PropertieModel from "../models/properties";
import UserModel from "../models/users";
import { log } from "console";

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: The properties managing API
 * /properties:
 *   get:
 *     summary: List all properties
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: The list of properties.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The auto-generated id of the propertie
 *                     nullable: true
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   price:
 *                     type: number
 *                   baseIncome:
 *                     type: number
 *                   owner:
 *                     type: string
 *                   kind:
 *                     type: string
 *       500:
 *         description: Some server error
 *
 */
const getPropertieList = async (req: Request, res: Response) => {
  try {
    const list = await PropertieModel.find();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};
/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: The properties managing API
 * /properties/{id}:
 *   get:
 *     summary: Get the propertie by id
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The propertie id
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The auto-generated id of the propertie
 *                 name:
 *                   type: string
 *                 address:
 *                   type: string
 *                 price:
 *                   type: number
 *                 baseIncome:
 *                   type: number
 *                 owner:
 *                   type: string
 *                 kind:
 *                   type: string
 *                 stats:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       description: The date of the stats
 *                     baseIncome:
 *                       type: number
 *                       description: The baseIncome of the stats
 *
 *       404:
 *         description: The propertie does not exis
 *       500:
 *         description: Some server error
 *
 */
const getPropertie = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (id === undefined || !mongoose.isObjectIdOrHexString(id)) {
    res.status(400).json({ msg: "No id provided" });
    return;
  }

  const propertie = await PropertieModel.findById(req.params.id);
  if (propertie === null) {
    res.status(404).json({ msg: "Propertie does not exist" });
    return;
  }
  let ownerName: string | undefined;
  try {
    const owner = await UserModel.findById(propertie.owner);
    ownerName = owner?.name;
  } catch (error) {
    console.log("no hay user");
  }

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

  const kindResData = await KindRulesModel.findOne({
    kind: propertie.kind,
  });

  if (kindResData === null) {
    res.status(500).json({ msg: "Internal error" });
    return;
  }

  interface statsDTO {
    date: Date;
    baseIncome: number;
  }
  console.log(kindResData?.MaxTemperature);
  console.log(propertie.baseIncome);
  const stats = weatherData.map((dayData): statsDTO => {
    console.log(dayData.temperature);
    //calculate the baseIncome modifier
    let tempModifier = 0;
    if (kindResData.MaxTemperature.value < dayData.temperature) {
      tempModifier = propertie.baseIncome * kindResData.MaxTemperature.modifier;
    } else if (kindResData.MinTemperature.value > dayData.temperature) {
      tempModifier = propertie.baseIncome * kindResData.MinTemperature.modifier;
    }
    //calculate the electricity modifier

    const electricityPrice =
      kindResData.EnergyConsumption * dayData.electricity;
    //calculate the weather modifier
    let weatherModifier = 0;
    switch (dayData.state) {
      case "sunny":
        weatherModifier = propertie.baseIncome * kindResData.Weather.sunny;
        break;
      case "cloudy":
        weatherModifier = propertie.baseIncome * kindResData.Weather.cloudy;
        break;
      case "rainy":
        weatherModifier = propertie.baseIncome * kindResData.Weather.rainy;
        break;

      default:
        break;
    }

    return {
      date: dayData.date,
      baseIncome:
        propertie.baseIncome +
        tempModifier -
        electricityPrice +
        weatherModifier,
    };
  });

  res.status(200).json({
    name: propertie.name,
    _id: propertie._id,
    address: propertie.address,
    price: propertie.price,
    baseIncome: propertie.baseIncome,
    owner: ownerName,
    kind: propertie.kind,
    stats: stats,
  });
};

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: The properties managing API
 * /properties/{id}/rules:
 *   get:
 *     summary: Get kind rules for a specific property
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the property
 *     responses:
 *       200:
 *         description: Kind rules of the property
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 kind:
 *                   type: string
 *                   enum: [transport, education, health, groceries]
 *                   description: The kind of the property
 *                 MaxTemperature:
 *                   type: object
 *                   properties:
 *                     value:
 *                       type: number
 *                       description: Maximum temperature value
 *                     modifier:
 *                       type: number
 *                       description: Temperature modifier
 *                   description: The maximum temperature rules
 *                 MinTemperature:
 *                   type: object
 *                   properties:
 *                     value:
 *                       type: number
 *                       description: Minimum temperature value
 *                     modifier:
 *                       type: number
 *                       description: Temperature modifier
 *                   description: The minimum temperature rules
 *                 EnergyConsumption:
 *                   type: number
 *                   description: The energy consumption rules
 *                 Weather:
 *                   type: object
 *                   properties:
 *                     sunny:
 *                       type: number
 *                       description: The sunny weather rules
 *                     rainy:
 *                       type: number
 *                       description: The rainy weather rules
 *                     cloudy:
 *                       type: number
 *                       description: The cloudy weather rules
 *                   description: The weather rules
 *       404:
 *         description: Not found, property does not exist
 *       500:
 *         description: Some server error
 *
 */

const getPropertieRules = async (req: Request, res: Response) => {
  const propertieId = req.params.id;
  //check propertie id was provided
  if (propertieId === undefined) {
    res.status(404).json({
      message: "Not found, propertie id is required",
    });
    return;
  }

  const propertie = await PropertieModel.findById(propertieId);
  if (propertie === null) {
    res.status(404).json({
      message: "Not found, propertie does not exist",
    });
    return;
  }

  try {
    const rules = await KindRulesModel.findOne({
      kind: propertie?.kind,
    });
    console.log(rules);

    res.status(200).json(rules);
  } catch (error) {
    res.status(500).json({
      message: "Propertie have not kind rules associated",
    });
  }
};
/**
 * @swagger
 * /properties/{id}/buy:
 *   post:
 *     summary: Comprar propiedad
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la propiedad a comprar
 *     requestBody:
 *       description: Datos del comprador
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownerId:
 *                 type: string
 *                 description: ID del nuevo propietario
 *     responses:
 *       201:
 *         description: Propiedad comprada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID de la propiedad comprada
 *                 name:
 *                   type: string
 *                   description: Nombre de la propiedad
 *                 address:
 *                   type: string
 *                   description: Dirección de la propiedad
 *                 price:
 *                   type: number
 *                   description: Precio de la propiedad
 *                 baseIncome:
 *                   type: number
 *                   description: Ingreso generado por la propiedad
 *                 owner:
 *                   type: string
 *                   description: Nuevo propietario de la propiedad
 *       400:
 *         description: Petición incorrecta, faltan parámetros
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error
 *       404:
 *         description: Propiedad no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error del servidor
 */
const propertieBuy = async (req: Request, res: Response) => {
  interface IBody {
    ownerId: string;
  }
  const propertieId = req.params.id;
  const body: IBody = req.body;

  //check propertie id was provided
  if (propertieId === undefined) {
    res.status(404).json({
      message: "Not found, propertie id is required",
    });
    return;
  }

  //check owner id was provided
  if (body.ownerId === undefined) {
    res.status(400).json({
      message: "owner id is required",
    });
    return;
  }

  // Iniciar una nueva sesión de MongoDB para garantizar atomicidad en todas las consultas

  //validate newOwner

  try {
    const landlord = await UserModel.findById(body.ownerId);

    if (landlord === null) {
      res.status(400).json({ msg: "Wrong landlord Id" });
      return;
    }
    const propertie = await PropertieModel.findById(propertieId);
    if (propertie === null) {
      res.status(404).json({ msg: "Wrong propertie Id" });
      return;
    }
    if (landlord.liquidity < propertie.price) {
      res.status(400).json({ msg: "Not enought money" });
      return;
    }
    const updatedPropertie = await PropertieModel.findByIdAndUpdate(
      propertieId,
      { owner: body.ownerId },
      { new: true }
    );
    const newBalance = landlord.liquidity - propertie.price;

    await UserModel.findByIdAndUpdate(body.ownerId, { liquidity: newBalance });
    res.status(201).json({ id: updatedPropertie?._id });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

export { getPropertieList, getPropertie, getPropertieRules, propertieBuy };
