import "dotenv/config";
import mongoose from "mongoose";
import dbConnect from "../config/mongodb.js";
import productModel from "../models/productModel.js";

async function run() {
  try {
    await dbConnect();

    const seededBrands = ["Orebi", "Axiom", "Nova", "Zenon", "Luma", "Vast"]; // seeded batches
    const seededNames = [
      // single and sample entries
      /Dev Seed/i,
      /Classic Backpack/i,
      /Wireless Headphones/i,
      /Smart Watch/i,
    ];

    const deleteQuery = {
      $or: [
        { brand: { $in: seededBrands } },
        ...seededNames.map((rx) => ({ name: rx })),
      ],
    };

    const toDelete = await productModel.countDocuments(deleteQuery);
    if (toDelete === 0) {
      console.log("No seeded products found to delete.");
      await mongoose.connection.close();
      process.exit(0);
      return;
    }

    const result = await productModel.deleteMany(deleteQuery);
    console.log(`Deleted ${result.deletedCount} seeded products.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Cleanup failed:", err);
    await mongoose.connection.close();
    process.exit(1);
  }
}

run();


