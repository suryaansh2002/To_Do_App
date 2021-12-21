const mongoose = require("mongoose");

const User2Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    todos:{
      type:[Object],
      default:[],
    }

  },
  { timestamps: true }
);

// export model user with UserSchema
module.exports = mongoose.model("Users", User2Schema);
