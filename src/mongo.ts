import mongoose from "mongoose";
import { mongo } from "../CONFIG";
import _ from 'lodash';
mongoose.set("useFindAndModify", false);
// const ObjectId = mongoose.Schema.Types.ObjectId;
// const ObjectId = mongoose.Types.ObjectId;
const hugsnan = mongoose.createConnection(mongo.connect, {
  useNewUrlParser: true
});

hugsnan
  .on("connected", () => {
    console.log("Connected to " + mongo.connect);
  })
  .catch(err => {
    console.log("Not Connected to Database ERROR!");
    // console.log(err);
  });

const UserSchema = new mongoose.Schema(
  {
    name: String
    // ปี: String,
    // ชื่อ: String,
    // สกุล: String,
    // คณะ: String,
    // รหัสนิสิต: String,
    // รหัสคณะ: String,
    // faculty: String,
    // lastname: String,
    // firstname: String
  },
  {
    strict: false,
    // versionKey: false,
    toObject: {
      transform: function (doc, ret, game) {
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);
const Users = hugsnan.model("users", UserSchema);

export async function append(obj: any) {
  console.log('APPEND')
  let { รหัสนิสิต } = obj;
  if (!รหัสนิสิต) throw [400, "not found field รหัสนิสิต"];
  let doc = await Users.findOneAndUpdate({ รหัสนิสิต }, obj, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  });
  return doc.toObject();
}

export async function update(values: any[][]) {
  console.log('UPDATE')
  let datas = toJson(values);
  await Promise.all(_.map(datas, append))
  return toJson(values)
}

function toJson(values: any[][]) {
  let [head, ...tail] = values;
  return _.map(tail, row => _.zipObject(head, row))
}

