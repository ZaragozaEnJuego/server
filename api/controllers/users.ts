import UserModel from "../models/users";
import { Request, Response } from "express";
import logger from "./logger";
import PropertieModel, { Propertie } from "../models/properties";

const getUser = async (req: Request, res: Response) => {
  if (req.params.id === undefined) {
    res.status(400).json({ msg: "No id provided" });
    return;
  }
  interface userDto {
    id: string;
    name: string;
    icon?: string;
    mail?: string;
    liquidity: number;
    //lastDayIncome: number;
    properties: Propertie[];
  }
  const user = await UserModel.findById(req.params.id);

  if (user === null) {
    res.status(404).json({ msg: "User does not exist" });
    return;
  }
  const properties = await PropertieModel.find({ owner: req.params.id });
  const userResponse: userDto = {
    id: user._id,
    name: user.name,
    mail: user.mail,
    liquidity: user.liquidity,
    properties: properties,
  };
  res.status(200).json(userResponse);
};

const getIsAdmin = (mail: string) => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ mail: mail })
      .then((user) => {
        if (user) {
          resolve(user.admin);
          //console.log(`El usuario encontrado es: ${user}`);
          logger.info("usuario encontrado: " + mail + "/" + user);
        } else {
          reject(mail);
        }
      })
      .catch((err) => reject(err));
  });
};

const getId = (mail: string) => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ mail: mail })
      .then((user) => {
        if (user) {
          resolve(user._id);
          //console.log(`El usuario encontrado es: ${user}`);
        } else {
          reject(mail);
        }
      })
      .catch((err) => reject(err));
  });
};

const findOrCreateUser = (name: string, mail: string, admin: boolean) => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ mail: mail })
      .then((user) => {
        if (user) {
          resolve(user);
          //console.log(`El usuario encontrado es: ${user}`);
        } else {
          //console.log(`No se encontró ningún usuario con el correo ${mail}`);
          UserModel.create({
            name: name,
            liquidity: 4000000,
            mail: mail,
            access: true,
            admin: admin,
          })
            .then((newUser) => {
              //console.log(`Creado correctamente. ${newUser}`);
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

export { getUser, findOrCreateUser, getId, getIsAdmin };
