const express = require("express");
const app = express();
const productRoutes = require("./routes/products.routes");

app.use(express.json());
app.use("/api", productRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
