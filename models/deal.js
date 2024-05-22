import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DealSchema = new Schema({

companyName : String,
dealStage : String,
opportunityName : String,
accountOwner : String,
amount : Number,
contactNames : [String],
firstContact : Date,
closeDate : Date,
likelihood : Number,
notes : [{
    note : String,
    date : Date,
    person : String
}],
});

const Deal = mongoose.models.Deal ?? mongoose.model('Deal', DealSchema);

export default Deal;