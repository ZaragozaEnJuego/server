import Users from "../models/users";
import { Request, Response, response } from "express";
import Propertie from "../models/properties";

//esta función ira en el controlador de admin y unicamente mandara
//los datos requeridos no expondra toodo el schema
const getUserList = (req: Request, res: Response) => {
    res.status(501).json({ msg: "Not implemented" });
    return;

    Users.find()
        .then((list) => res.status(200).json(list))
        .catch((err) => res.status(500).json(err));
};

const getUser = (req: Request, res: Response) => {
    Users.findById(req.params.id)
        .then(async (user) => {
            if (!user) {
                res.status(404).json({ msg: "User does not exist" });
                return;
            }

            const properties = await Propertie.find({ owner: user._id });

            res.status(200).json({
                name: user.name,
                _id: user._id,
                liquidity: user.liquidity,
                properties: properties,
                //add stats
            });
        })
        .catch((err) => res.status(500).json(err));
};
//esta función ira en el controlador de admin y unicamente mandara
const updateAccess = (req: Request, res: Response) => {
    res.status(501).json({ msg: "Not implemented" });
    return;
    if (req.params.id === undefined) {
        res.status(400).json({
            message: "user id is required",
        });
        return;
    }

    const { access } = req.body;

    if (access === undefined) {
        res.status(400).json({
            message: "attribute access is required",
        });
        return;
    }

    Users.findByIdAndUpdate(
        req.params.id,
        { access },
        { new: true } // devuelve el usuario actualizado
    )
        .then((user) =>
            !user
                ? res.status(404).json({ message: "User not found" })
                : res.status(200).json(user)
        )
        .catch((err) => res.status(500).json(err));
};

const findOrCreateUser = (
    id: string,
    name: any,
    mail: string,
    admin: boolean
) => {
    return new Promise((resolve, reject) => {
        Users.findOne({ mail: mail })
            .then((user) => {
                if (user) {
                    resolve(user);
                    console.log(`El usuario encontrado es: ${user}`);
                } else {
                    console.log(
                        `No se encontró ningún usuario con el correo ${mail}`
                    );
                    Users.create({
                        name: name,
                        liquidez: 10000,
                        mail: mail,
                        admin: admin,
                    })
                        .then((newUser) => {
                            console.log("Creado correctamente.");
                            resolve(newUser);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
            })
            .catch((err) => reject(err));
    });
};

export { getUserList, getUser, findOrCreateUser, updateAccess };
