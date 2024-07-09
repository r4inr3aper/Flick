import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://rayquaza0438:FLjEPy8UnMauLBrD@cluster0.kmiaq8z.mongodb.net/ecommerce-v1"
    )
    .then(() => {
      console.log("DB Connected!!");
    })
    .catch((error) => {
      console.log(error);
    });
};
