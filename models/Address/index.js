const {Schema,model} = require("mongoose");


const AddressSchema = new Schema({
    addressLine1: {
        type: String,
        required: true
    },
    adddressLine2: {
        type: String,
        required: false
    },
    city: {
        type:String,
        required:true
    },
    state:{
        type: String,
        required:true
    },
    zipcode:{
        type:String,
        required:true
    },
    country:{
        type: String,
        required: true
    }
});

module.exports = { Address: model("Address",AddressSchema), addressSchema: AddressSchema }
