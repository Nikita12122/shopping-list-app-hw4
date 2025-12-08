const express = require("express");
const cors = require("cors");

require("./data/mongo"); // ✅ MongoDB auto-connect

const app = express();

app.use(cors());
app.use(express.json());

const shoppingList = require("./controllers/shoppingList");
const item = require("./controllers/item");

// Shopping List Routes
app.post("/shoppingList/create", shoppingList.create);
app.get("/shoppingList/list", shoppingList.list);
app.get("/shoppingList/get", shoppingList.get);
app.post("/shoppingList/update", shoppingList.update);
app.post("/shoppingList/delete", shoppingList.delete);
app.post("/shoppingList/archive", shoppingList.archive);
app.post("/shoppingList/addMember", shoppingList.addMember);
app.post("/shoppingList/removeMember", shoppingList.removeMember);

// Item Routes
app.post("/item/create", item.create);
app.post("/item/update", item.update);
app.get("/item/list", item.list);
app.post("/item/delete", item.delete);

app.listen(3000, () => {
    console.log("API running on http://localhost:3000");
});
