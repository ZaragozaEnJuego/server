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

const updateAccess = (req: Request, res: Response) => {
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

export { getUserList, updateAccess };
