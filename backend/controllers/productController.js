import Product from "../models/product.js";
import { uploadProductImage } from "../services/uploadService.js";
import { resolvePublicStorageUrl } from "../utils/storageUrl.js";

const DEFAULT_PRODUCT_IMAGE = "https://picsum.photos/id/237/200/300";

const parseBoolean = (value, fallback = true) => {
  if (value === undefined) return fallback;
  if (typeof value === "boolean") return value;
  return value === "true";
};

const resolveProductImage = (image) =>
  resolvePublicStorageUrl(image, "products", DEFAULT_PRODUCT_IMAGE);

const serializeProduct = (product) => {
  const productObject = product.toObject ? product.toObject() : product;

  return {
    ...productObject,
    image: resolveProductImage(productObject.image),
  };
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: products.map(serializeProduct),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get products",
    });
  }
};
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products.map(serializeProduct),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get products",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: serializeProduct(product),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get product",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, preparationTime, size, isAvailable } =
      req.body;

    const trimmedName = name?.trim();

    // 1. Duplicate check (name + size + price)
    const existingProduct = await Product.findOne({
      name: trimmedName,
      size,
      price,
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product already exists with same name, size and price",
      });
    }

    // 2. Upload image to Supabase (if file exists)
    let imageUrl = DEFAULT_PRODUCT_IMAGE;

    if (req.file) {
      imageUrl = await uploadProductImage(req.file);
    }

    // 3. Create product
    const product = new Product({
      name: trimmedName,
      description,
      price,
      category,
      preparationTime,
      size,
      isAvailable: parseBoolean(isAvailable, true),
      image: imageUrl,
    });

    await product.save();

    // 4. Response
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: serializeProduct(product),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, price, category, preparationTime, size, isAvailable } =
      req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const trimmedName = name?.trim();

    // 1. Check duplicate (excluding current product)
    const existingProduct = await Product.findOne({
      _id: { $ne: id },
      name: trimmedName,
      size,
      price,
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message:
          "Another product already exists with same name, size and price",
      });
    }

    // 2. Image update (if new image uploaded)
    let imageUrl = product.image;

    if (req.file) {
      imageUrl = await uploadProductImage(req.file);
    }

    // 3. Update fields
    product.name = trimmedName || product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.preparationTime = preparationTime ?? product.preparationTime;
    product.size = size ?? product.size;
    product.isAvailable = parseBoolean(isAvailable, product.isAvailable);
    product.image = imageUrl;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: serializeProduct(product),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
