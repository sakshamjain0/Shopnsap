import "dotenv/config";
import mongoose from "mongoose";
import dbConnect from "../config/mongodb.js";
import productModel from "../models/productModel.js";

const PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&auto=format&fit=crop",
];

async function run() {
  try {
    await dbConnect();

    const products = await productModel.find({
      $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } },
        { images: null },
      ],
    });

    if (products.length === 0) {
      console.log("No products need backfilling.");
      await mongoose.connection.close();
      process.exit(0);
      return;
    }

    for (const [index, product] of products.entries()) {
      const image = PLACEHOLDERS[index % PLACEHOLDERS.length];
      product.images = [image];
      await product.save();
      console.log(`Updated product ${product.name} with placeholder image`);
    }

    await mongoose.connection.close();
    console.log("Backfill complete.");
    process.exit(0);
  } catch (err) {
    console.error("Backfill failed:", err);
    await mongoose.connection.close();
    process.exit(1);
  }
}

run();


