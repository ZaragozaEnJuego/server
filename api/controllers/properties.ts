import Propertie from "../models/properties";
import { Request, Response } from "express";
import WeatherDataModel from "../models/temperature";
import KindRulesModel from "../models/kindRules";
import mongoose from "mongoose";

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
 *                   income:
 *                     type: number
 *                   owner:
 *                     type: string
 *                   kind:
 *                     type: string
 *       500:
 *         description: Some server error
 *
 */
const getPropertieList = (req: Request, res: Response) => {
  Propertie.find().then((list) => {
    console.log(list);
    res.status(200).json(list);
  });
};
/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: The properties managing API
 * /properties/{id}::
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
 *                 income:
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
 *                     income:
 *                       type: number
 *                       description: The income of the stats
 *
 *       404:
 *         description: The propertie does not exis
 *       500:
 *         description: Some server error
 *
 */
const getPropertie = async (req: Request, res: Response) => {
  if (req.params.id === undefined) {
    res.status(400).json({ msg: "No id provided" });
    return;
  }
  const propertie = await Propertie.findById(req.params.id);
  if (propertie === null) {
    res.status(404).json({ msg: "Propertie does not exist" });
    return;
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
    income: number;
  }
  const stats = weatherData.map((dayData): statsDTO => {
    //calculate the income modifier
    let tempModifier = 0;
    if (kindResData.MaxTemperature.value < dayData.temperature) {
      tempModifier = propertie.income * kindResData.MaxTemperature.modifier;
    } else if (kindResData.MinTemperature.value > dayData.temperature) {
      tempModifier = propertie.income * kindResData.MinTemperature.modifier;
    }
    //calculate the electricity modifier

    const electricityPrice =
      kindResData.EnergyConsumption * dayData.electricity;
    //calculate the weather modifier
    let weatherModifier = 0;
    switch (dayData.state) {
      case "sunny":
        weatherModifier = propertie.income * kindResData.Weather.sunny;
        break;
      case "cloudy":
        weatherModifier = propertie.income * kindResData.Weather.cloudy;
        break;
      case "rainy":
        weatherModifier = propertie.income * kindResData.Weather.rainy;
        break;

      default:
        break;
    }

    return {
      date: dayData.date,
      income:
        propertie.income + tempModifier - electricityPrice + weatherModifier,
    };
  });

  res.status(200).json({
    name: propertie.name,
    _id: propertie._id,
    address: propertie.address,
    price: propertie.price,
    income: propertie.income,
    owner: propertie.owner,
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
  if (!propertieId) {
    res.status(404).json({
      message: "Not found, propertie id is required",
    });
    return;
  }

  Propertie.findById(propertieId)
    .then((propertie) => {
      KindRulesModel.find({ kind: propertie?.kind })
        .then((kindRules) => {
          res.status(200).json(kindRules);
        })
        .catch((reason) =>
          res.status(500).json({
            message: "Propertie have not kind rules associated",
          })
        );
    })
    .catch((reason) => {
      res.status(404).json({
        message: "Not found, propertie does not exist",
      });
    });
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
 *                 income:
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
  if (!propertieId) {
    res.status(404).json({
      message: "Not found, propertie id is required",
    });
    return;
  }

  //check owner id was provided
  if (!body.ownerId) {
    res.status(400).json({
      message: "owner id is required",
    });
    return;
  }

  // Iniciar una nueva sesión de MongoDB para garantizar atomicidad en todas las consultas
  const session = await mongoose.startSession();

  //validate newOwner

  try {
    await session.withTransaction(async () => {
      const updatedPropertie = await Propertie.findByIdAndUpdate(
        propertieId,
        { owner: body.ownerId },
        { new: true }
      );
      res.status(201).json(updatedPropertie);
    });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  } finally {
    // Finalizar la sesión de MongoDB
    session.endSession();
  }
};

const propertieCreate = (req: Request, res: Response) => {
  const propertie = Propertie.create({
    name: "Nombre",
    address: "Dirección",
    income: 100,
    price: 10000,
    kind: "Health",
  })
    .then((propertie) => {
      res.status(201).json(propertie);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

export {
  propertieCreate,
  getPropertieList,
  getPropertie,
  getPropertieRules,
  propertieBuy,
};
