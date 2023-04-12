import mongoose, { Model, Schema } from "mongoose"

interface Offer {
    _id?: string,
    property: string,
    offerer: string,
    owner: string,
    amount: number
}

const offerSchema = new Schema<Offer>({
    property: { type: String, required: true },
    offerer: { type: String, required: true },
    owner: { type: String, required: true },
    amount: { type: Number, required: true },
})

const OfferModel: Model<Offer> =
    mongoose.models.Entry || mongoose.model("Entry", offerSchema)

export default OfferModel
