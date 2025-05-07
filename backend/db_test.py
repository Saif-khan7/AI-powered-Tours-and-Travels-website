from pymongo import MongoClient

# Connect to MongoDB Atlas
uri = "mongodb+srv://saifskhan7:Um7mKHuiIsdKnyZf@cluster0.vhegfll.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri)
db = client["travel_planner"]
collection = db["tours"]

# Tour package documents
tours = [
    {
        "name": "Ladakh Himalayan Adventure",
        "location": "Ladakh, India",
        "image": "/images/tours/ladakh-adventure.png",
        "description": "Experience the dramatic landscapes of Ladakh on this 7-day journey through ancient monasteries, high mountain passes, and the breathtaking Pangong Lake.",
        "price": "₹43,400",
        "duration": "7 Days / 6 Nights",
        "highlights": [
            "Pangong Lake visit",
            "Nubra Valley exploration",
            "Leh Palace & Shanti Stupa",
            "Khardung La Pass adventure"
        ]
    },
    {
        "name": "Enchanting Kerala Backwaters",
        "location": "Kerala, India",
        "image": "/images/tours/kerala-backwaters.png",
        "description": "Sail through Kerala’s tranquil backwaters, lush tea estates, and vibrant wildlife on this 5-day escape to ‘God’s Own Country’.",
        "price": "₹18,500",
        "duration": "5 Days / 4 Nights",
        "highlights": [
            "Houseboat stay in Alleppey",
            "Munnar tea gardens",
            "Periyar Wildlife Sanctuary",
            "Echo Point visit"
        ]
    },
    {
        "name": "Grand Europe Explorer",
        "location": "Europe",
        "image": "/images/tours/europe-explorer.png",
        "description": "Discover the best of Europe on this 10-day tour covering iconic cities, stunning landscapes, and rich cultural experiences.",
        "price": "€2,499",
        "duration": "10 Days / 9 Nights",
        "highlights": [
            "Paris city tour",
            "Swiss Alps excursion",
            "Venice gondola ride",
            "Amsterdam canal cruise"
        ]
    },
    {
        "name": "Maldives Island Bliss",
        "location": "Maldives",
        "image": "/images/tours/maldives-bliss.png",
        "description": "Relax in paradise with this 4-day Maldives getaway featuring white sand beaches, turquoise waters, and luxurious overwater villas.",
        "price": "$1,299",
        "duration": "4 Days / 3 Nights",
        "highlights": [
            "Overwater villa stay",
            "Snorkeling & water sports",
            "Sunset cruise",
            "Island hopping adventure"
        ]
    }
]

# Insert into MongoDB
result = collection.insert_many(tours)
print("Inserted tour IDs:", result.inserted_ids)