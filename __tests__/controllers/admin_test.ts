import { Request, Response } from "express";
import UserModel from "../../api/models/users";
import { getUserList, updateAccess } from "../../api/controllers/admin"

jest.mock("../../api/models/admin")

let req: Request
let res: Response

beforeEach(() => {
    req = { params: {} } as Request;
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;
})

describe("getUserList", () => {
    it("Should return a list of users when there are users in database", async () => {
        const expectedData = [
            { id: 1, name: "User A"},
            { id: 2, name: "User B"},
            { id: 3, name: "User C"}
        ]
        jest.mocked(UserModel.find).mockResolvedValueOnce(
            expectedData as any
        )

        await getUserList(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expectedData)
    })
    it("Should return a 500 error when there is a server error", async () => {

        jest.mocked(UserModel.find).mockRejectedValueOnce({});

        await getUserList(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    })
})

describe("updateAccess", () => {
    
})