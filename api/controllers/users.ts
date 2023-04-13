import Users from "../models/users";
import { Request, Response, response } from "express";

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
 *                       income:
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
 *                            income:
 *                            type: number
 *                            description: The income of the stats
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
 *                     income:
 *                       type: number
 *                       description: The income of the stats
 *       500:
 *         description: Some server error
 *
 */
const getUserList = (req: Request, res: Response) => {
  Users.find()
    .then((list) => res.status(200).json(list))
    .catch((err) => res.status(500).json(err));
};
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
 *                       income:
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
 *                            income:
 *                            type: number
 *                            description: The income of the stats
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
 *                     income:
 *                       type: number
 *                       description: The income of the stats
 *
 *       404:
 *         description: The user does not exis
 *       500:
 *         description: Some server error
 *
 */
const getUser = (req: Request, res: Response) => {
  Users.findById(req.params.id)
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(500).json(err));
};

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /users/{id}::
 *   patch:
 *     summary: 
 *     tags: [Users]
 *     responses:
 *      400:
 *        description: The user id is required or attribute access is required
 * 
 **/
const updateAccess = (req: Request, res: Response) => {
   if (req.params.id === undefined) {
    res.status(400).json({
      message: "user id is required",
    });
    return;
  }
  
  const { access } = req.body
  
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
  ).then((user) => !user ? res.status(404).json({ message: 'User not found' }) : res.status(200).json(user))
   .catch((err) => res.status(500).json(err))
}

const findOrCreateUser = (id: string, name: any, mail: string, admin: boolean) => {
  return new Promise((resolve, reject) => {
    Users.findOne({ mail: mail })
      .then((user) => {
        if (user) {
          resolve(user);
          console.log(`El usuario encontrado es: ${user}`);
        } else {
          console.log(`No se encontró ningún usuario con el correo ${mail}`)
          Users.create({
            name: name,
            liquidez: 10000,
            mail: mail,
            admin: admin,
          }).then((newUser) => {
            console.log("Creado correctamente.")
            resolve(newUser);
          }).catch((err) => {
            reject(err);
          });
        }
      })
      .catch((err) => reject(err));
  });
};

export { getUserList, getUser, findOrCreateUser, updateAccess };
