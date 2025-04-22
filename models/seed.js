const mongoose = require("mongoose");
require("dotenv").config();
const Destination = require("./destination");
const Comment = require("./comment");
const User = require("./user");

const destinations = [
  {
    name: "Santorini, Greece",
    cost: "150",
    image: "https://images.unsplash.com/photo-1720630941649-8e2dd3956990?auto=format&fit=crop&w=800",
    description: "Beautiful white-washed houses perched on cliffs overlooking the Aegean Sea. Known for stunning sunsets and unique architecture.",
    location: "Santorini, Greece",
    lat: 36.3932,
    lng: 25.4615,
  },
  {
    name: "Kyoto, Japan",
    cost: "200",
    image: "https://images.unsplash.com/photo-1588000316012-ae41e1c9db1a?auto=format&fit=crop&w=800",
    description: "Ancient capital of Japan featuring numerous temples, traditional gardens, imperial palaces, and Shinto shrines.",
    location: "Kyoto, Japan",
    lat: 35.0116,
    lng: 135.7681,
  },
  {
    name: "Machu Picchu, Peru",
    cost: "120",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800",
    description: "Ancient Incan city set high in the Andes Mountains. One of the most famous and spectacular archaeological sites in the world.",
    location: "Machu Picchu, Peru",
    lat: -13.1631,
    lng: -72.545,
  },
  {
    name: "Paris, France",
    cost: "180",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800",
    description: "The City of Light, famous for the Eiffel Tower, world-class museums like the Louvre, charming cafes, and haute cuisine. A paradise for art, fashion, and culture lovers.",
    location: "Paris, France",
    lat: 48.8566,
    lng: 2.3522,
  },
  {
    name: "Berlin, Germany",
    cost: "120",

    image: "https://images.unsplash.com/photo-1659413084271-ca1345764e15?auto=format&fit=crop&w=800",
    description:
      "A city rich in history and modern culture, featuring the Brandenburg Gate, East Side Gallery, and vibrant art scene. Known for its nightlife, street art, and innovative tech startup culture.",
    location: "Berlin, Germany",
    lat: 52.52,
    lng: 13.405,
  },
  {
    name: "Bali, Indonesia",
    cost: "90",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800",
    description:
      "Tropical paradise with pristine beaches, ancient temples, lush rice terraces, and vibrant coral reefs. Perfect for both relaxation and adventure, featuring amazing local cuisine and culture.",
    location: "Bali, Indonesia",
    lat: -8.3405,
    lng: 115.092,
  },
];

async function cleanDB() {
  try {
    await Destination.deleteMany({});
    await Comment.deleteMany({});
    console.log("Database cleaned");
  } catch (err) {
    console.error("Error cleaning database:", err);
  }
}

async function createSampleUser() {
  try {
    let user = await User.findOne({ username: "admin" });
    if (!user) {
      user = await User.register(new User({ username: "admin" }), "admin123");
      console.log("Sample user created");
    }
    return user;
  } catch (err) {
    console.error("Error creating sample user:", err);
    return null;
  }
}

async function seedDB() {
  try {
    await cleanDB();

    // seed user
    const user = await createSampleUser();
    if (!user) return;

    // seed destinations
    for (const destination of destinations) {
      destination.author = {
        id: user._id,
        username: user.username,
      };
      const createdDestination = await Destination.create(destination);

      // seed comments
      const comment = await Comment.create({
        text: `This is a beautiful destination! I visited ${destination.name} last summer and it was amazing.`,
        author: {
          id: user._id,
          username: user.username,
        },
      });
      createdDestination.comments.push(comment);
      await createdDestination.save();
    }

    console.log("Database seeded!");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}

mongoose
  .connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    return seedDB();
  })
  .then(() => {
    mongoose.connection.close();
    console.log("Database connection closed");
  })
  .catch((err) => {
    console.error("Error:", err);
  });
