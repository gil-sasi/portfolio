import mongoose, { Schema, models, model } from "mongoose";

const ContactInfoSchema = new Schema({
  email: { type: String, required: true },
  socials: [
    {
      platform: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
});

export default models.ContactInfo || model("ContactInfo", ContactInfoSchema);
