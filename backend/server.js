// backend/server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose
  .connect( process.env.MONGO_URI )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


// ✅ Property Schema
const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  }
});

const Property = mongoose.model("Property", propertySchema);

// ✅ GET /api/properties — fetch all properties
app.get("/api/properties", async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

// ✅ GET /api/properties/:id — fetch property by ID
app.get("/api/properties/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch property" });
  }
});

// ✅ POST /api/properties — add new property
app.post("/api/properties", async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.send("🏡 Property API with MongoDB is running!");
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
