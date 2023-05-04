import UserModel from "../models/users";
import { Request, Response } from "express";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /users/{id}::
 *   get:
 *     summary: Get the propertie by id
 *     tags: [Users]
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
 *                            description: The income of the stats
 *                   liquidity:
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
 *
 *       404:
 *         description: The user does not exis
 *       500:
 *         description: Some server error
 *
 */
const getUser = async (req: Request, res: Response) => {
  if (req.params.id === undefined) {
    res.status(400).json({ msg: "No id provided" });
    return;
  }
  const user = await UserModel.findById(req.params.id);
  if (user === null) {
      res.status(404).json({ msg: "User does not exist" });
      return;
  }
  res.status(200).json(user);
};

const getIsAdmin = ( 
  mail : string 
) => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ mail: mail })
      .then((user) => {
        if (user) {
          resolve(user.admin);
          //console.log(`El usuario encontrado es: ${user}`);
        } else {
          reject(mail);
        }
      })
      .catch((err) => reject(err));
  });
};

const getId = ( 
  mail : string 
) => {
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

const findOrCreateUser = (
  name: string,
  mail: string,
  admin: boolean
) => {
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
            liquidity: 10000,
            mail: mail,
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