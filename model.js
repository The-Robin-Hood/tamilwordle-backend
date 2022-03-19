import { ObjectId } from "bson";
import pkg from "mongoose";

const {Schema,models,model} = pkg;

const tamilWordleSchema = new Schema({
  _id: ObjectId,
  wordslist: Array,
  words: Array,
});

export default models["Wordlist"]
  ? model("Wordlist")
  : model("Wordlist", tamilWordleSchema, "Wordlist");
