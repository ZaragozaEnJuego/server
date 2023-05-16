import { Request, Response } from "express";
import LoginStatModel from "../../api/models/loginStats";
import { userLoginsPerDay } from "../../api/controllers/admin";

let req: Request;
let res: Response;

beforeEach(() => {
    req = { params: {} } as Request;
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;
});

describe("userLoginsPerDay", () => {
    it("happy path", async () => {
        // Obtener la fecha actual y la fecha de hace 30 días
        const today = new Date();
        const thirtyDaysAgo = new Date(
            today.getTime() - 30 * 24 * 60 * 60 * 1000
        );

        // Crear un resultado con la fecha de hoy y contar de 1, y el resto de fechas con un recuento de 0
        const result: any = [];
        const currentDate = new Date(thirtyDaysAgo);
        while (currentDate <= today) {
            const formattedDate = currentDate.toISOString().slice(0, 10);
            let count = 0;
            result.push({ date: formattedDate, count });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        result[result.length - 1].count = 1;

        // Mockear la función de agregación del modelo LoginStatModel para devolver el resultado de prueba
        jest.spyOn(LoginStatModel, "aggregate").mockResolvedValueOnce([
            {
                _id: today.toISOString().slice(0, 10),
                date: today,
                count: 1,
            },
        ]);

        // Act
        await userLoginsPerDay(req, res);

        expect(res.json).toHaveBeenCalledWith(result);
    });
});
