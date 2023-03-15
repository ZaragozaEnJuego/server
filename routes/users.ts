import { Request, Response, Router } from "express";
var router = Router();

/* GET users listing. */
router.get("/", function (req: Request, res: Response) {
  res.send({ users: "respond with a resource" });
});

export default router;
