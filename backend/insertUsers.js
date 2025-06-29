const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

mongoose.connect("mongodb://localhost:27017/f1");

// Schema do BD
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

async function createUsers() {
  try {
    await User.deleteMany({});

    //usuários pré-cadastrados
    const users = [
      { username: "admin", password: bcrypt.hashSync("password", 10) },
      { username: "user1", password: bcrypt.hashSync("password", 10) },
    ];

    await User.insertMany(users);
    console.log("Usuários criados com sucesso");

    const allUsers = await User.find();
    console.log("Usuários no banco:", allUsers);

    process.exit(0);
  } catch (err) {
    console.error("Erro:", err);
    process.exit(1);
  }
}

createUsers();
