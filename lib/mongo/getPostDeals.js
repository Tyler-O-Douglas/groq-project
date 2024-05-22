import { connectDb } from "./connectDb";
import Deal from "@/models/deal";

export async function getDeals() {
    try {
        await connectDb();
        let deals = await Deal.find({});
        deals = JSON.parse(JSON.stringify(deals));
        return deals;
    } catch (error) {
        console.error('Error getting deals:', error);
        throw error;
    }
}

export async function createUpdateDeal(deal) {
    await connectDb();
    let existingDeal = await Deal.findById(deal._id);
    if (existingDeal && !deal.shouldDelete) {
        delete deal.shouldDelete;
        existingDeal = await Deal.findByIdAndUpdate(deal._id, deal, { new: true });
    } else if (!existingDeal && !deal.shouldDelete) {
        existingDeal = new Deal(deal);
        delete existingDeal._id;
        delete existingDeal.shouldDelete;
        await existingDeal.save();
    } else if (existingDeal && deal.shouldDelete) {
        await Deal.findByIdAndDelete(deal._id);
    }
    return existingDeal;
}
