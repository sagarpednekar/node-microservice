const { Schema, model } = require("mongoose");

const { addressSchema } = require("../Address");

const userObject = {
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: false,
  },
  address: addressSchema,
};

const UserSchemaV1 = new Schema(userObject);

const UserSchemaV2 = new Schema({
  ...userObject,
  address: {
    type: Schema.Types.ObjectId,
    ref: "Address",
  },
});

module.exports = {
  UserV1: model("UserV1", UserSchemaV1),
  UserV2: model("UserV2", UserSchemaV2),
};
