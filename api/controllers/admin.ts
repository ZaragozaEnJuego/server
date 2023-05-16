import Users from "../models/users";
import { Request, Response, response } from "express";
import UserModel from "../models/users";
import PropertyPurchaseDataModel from "../models/statsAdmin";
import PropertieModel from "../models/properties";
import OfferModel from "../models/offers";
import LoginStatModel from "../models/loginStats";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of users.
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
 *                   icon:
 *                     type: string
 *                   patrimonio:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The auto-generated id of the propertie
 *                       name:
 *                         type: string
 *                       address:
 *                         type: string
 *                       price:
 *                         type: number
 *                       baseIncome:
 *                         type: number
 *                       owner:
 *                         type: string
 *                       kind:
 *                         type: string
 *                       stats:
 *                         type: object
 *                         properties:
 *                            date:
 *                              type: string
 *                              format: date-time
 *                              description: The date of the stats
 *                            baseIncome:
 *                            type: number
 *                            description: The baseIncome of the stats
 *                   liquidez:
 *                     type: number
 *                   mail:
 *                     type: string
 *                   access:
 *                     type: boolean
 *                   admin:
 *                     type: boolean
 *                   stats:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       description: The date of the stats
 *                     baseIncome:
 *                       type: number
 *                       description: The baseIncome of the stats
 *       500:
 *         description: Some server error
 *
 */
const getUserList = (req: Request, res: Response) => {
    Users.find()
        .then((list) => res.status(200).json(list))
        .catch((err) => res.status(500).json(err));
};

const updateAccess = async (req: Request, res: Response) => {
    if (req.params.id === undefined) {
        res.status(400).json({
            message: "user id is required",
        });
        return;
    }
    if (req.body.access === undefined) {
        res.status(400).json({
            message: "attribute access is required",
        });
        return;
    }

    let access = true;
    if (req.body.access === false) {
        access = false;
    }

    try {
        if (!access) {
            const propertieList = await PropertieModel.find({
                owner: req.params.id,
            });

            for (const propertie of propertieList) {
                await PropertieModel.findByIdAndUpdate(propertie.id, {
                    owner: null,
                });
            }

            const filterOffers = {
                $or: [{ owner: req.params.id }, { offerer: req.params.id }],
            };

            await OfferModel.deleteMany(filterOffers);
        }
        const user = await Users.findByIdAndUpdate(
            req.params.id,
            { access },
            { new: true } // devuelve el usuario actualizado
        );

        if (user === null) {
            res.status(404).json({ message: "User not found" });
        } else {
            res.status(200).json(user);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const newUsersPerDay = async (req: Request, res: Response) => {
    const today = new Date(); // Obtener la fecha actual
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // Fecha de hace 30 días

    // Realizar la consulta a la base de datos
    // Utilizamos aggregate para agrupar por fecha y contar los usuarios
    const result = await UserModel.aggregate([
        {
            $match: {
                created: { $gte: thirtyDaysAgo, $lte: today },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$created" },
                },
                count: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);

    // Crear un mapa para mapear los resultados por fecha
    const resultMap = new Map();
    result.forEach((entry) => {
        resultMap.set(entry._id, entry.count);
    });

    // Crear el array con los objetos que contienen la fecha y el número de usuarios
    const usersPerDay = [];
    const currentDate = new Date(thirtyDaysAgo);
    while (currentDate <= today) {
        const formattedDate = currentDate.toISOString().slice(0, 10);
        const count = resultMap.get(formattedDate) ?? 0;
        usersPerDay.push({ date: formattedDate, count });
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Devolver el resultado
    res.json(usersPerDay);
};

const transactionPerDay = async (req: Request, res: Response) => {
    const today = new Date(); // Obtener la fecha actual
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // Fecha de hace 30 días

    // Realizar la consulta a la base de datos
    // Utilizamos aggregate para agrupar por fecha y contar los usuarios
    const result = await PropertyPurchaseDataModel.aggregate([
        {
            $match: {
                date: { $gte: thirtyDaysAgo, $lte: today },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$date" },
                },
                count: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);

    // Crear un mapa para mapear los resultados por fecha
    const resultMap = new Map();
    result.forEach((entry) => {
        resultMap.set(entry._id, entry.count);
    });

    // Crear el array con los objetos que contienen la fecha y el número de usuarios
    const transactionsPerDay = [];
    const currentDate = new Date(thirtyDaysAgo);
    while (currentDate <= today) {
        const formattedDate = currentDate.toISOString().slice(0, 10);
        const count = resultMap.get(formattedDate) ?? 0;
        transactionsPerDay.push({ date: formattedDate, count });
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Devolver el resultado
    res.json(transactionsPerDay);
};

const userLoginsPerDay = async (req: Request, res: Response) => {
    const today = new Date(); // Obtener la fecha actual
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // Fecha de hace 30 días

    // Realizar la consulta a la base de datos
    // Utilizamos aggregate para agrupar por fecha y contar los usuarios
    const result = await LoginStatModel.aggregate([
        {
            $match: {
                date: { $gte: thirtyDaysAgo, $lte: today },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$date" },
                },
                count: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);

    // Crear un mapa para mapear los resultados por fecha
    const resultMap = new Map();
    result.forEach((entry) => {
        resultMap.set(entry._id, entry.count);
    });

    // Crear el array con los objetos que contienen la fecha y el número de usuarios
    const usersPerDay = [];
    const currentDate = new Date(thirtyDaysAgo);
    while (currentDate <= today) {
        const formattedDate = currentDate.toISOString().slice(0, 10);
        const count = resultMap.get(formattedDate) ?? 0;
        usersPerDay.push({ date: formattedDate, count });
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Devolver el resultado
    res.json(usersPerDay);
};

const collectPropertyPurchaseInfo = async (property: string) => {
    const propertie = await PropertieModel.findById(property);
    if (propertie !== null) {
        const kind = propertie.kind;
        await PropertyPurchaseDataModel.create({
            property: property,
            kind: kind,
            date: new Date(),
        });
    }
};

const collectLoginStat = async (user: string) => {
    await LoginStatModel.create({ user: user, date: Date.now() });
};

export {
    getUserList,
    updateAccess,
    newUsersPerDay,
    transactionPerDay,
    userLoginsPerDay,
    collectPropertyPurchaseInfo,
    collectLoginStat,
};
