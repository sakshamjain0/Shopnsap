import "dotenv/config";
import mongoose from "mongoose";
import dbConnect from "../config/mongodb.js";
import productModel from "../models/productModel.js";

// Accepts CLI args for flexibility, but defaults are set below
const args = process.argv.slice(2);
const params = Object.fromEntries(
  args.map((arg) => {
    const [k, ...rest] = arg.split("=");
    return [k, rest.join("=")];
  })
);

async function run() {
  try {
    await dbConnect();

    const name = params.name || "Apple iPhone";
    const brand = params.brand || "Apple";
    const category = params.category || "Electronics";
    const price = Number(params.price || 999);
    const stock = Number(params.stock || 25);
    const imageUrl = params.image || process.env.IMAGE_URL || "";
    const description =
      params.description || `${brand} ${name} official product`;
    const type = params._type || "best_sellers";
    const offer = params.offer === "true";
    const badge = params.badge === "true";
    const discountedPercentage = Number(params.discountedPercentage || 10);

    if (!imageUrl) {
      throw new Error("Missing required parameter: image");
    }

    const product = new productModel({
      _type: type,
      name,
      images: [imageUrl],
      price,
      discountedPercentage,
      stock,
      soldQuantity: 0,
      category,
      brand,
      badge,
      isAvailable: true,
      offer,
      description,
      tags: [brand.toLowerCase(), name.toLowerCase()],
    });

    await product.save();
    console.log(`Added product: ${brand} ${name}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Add single product failed:", err.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

run();


