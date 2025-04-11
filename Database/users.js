const users = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "securePassword123", 
      profilePicture: "../smart-irrigation-system/src/images/Blank pfp.jpg",
      isDark : false,
      plants: [
        {
          id: 1,
          name: "Aloe Vera",
          type: "Tomatoes",
          imageUrl: "./src/images/plant1.png",
          metrics: {
            humidity: "70%",
            pHLevel: 6.5,
            nutrients: {
              nitrogen: "25%",
              phosphorus: "12%",
              potassium: "18%",
            },
          },
        },
        {
          id: 2,
          name: "Cactus",
          type: "Wheat (Spring)",
          imageUrl: "./src/images/plant3.png",
          metrics: {
            humidity: "90%",
            pHLevel: 7.2,
            nutrients: {
              nitrogen: "15%",
              phosphorus: "8%",
              potassium: "12%",
            },
          },
        },
      ],
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "janesmith@example.com",
      password: "anotherSecurePassword",
      profilePicture: "../smart-irrigation-system/src/images/Blank pfp.jpg",
      isDark : false,
      plants: [
        {
          id: 1,
          name: "Basil",
          type: "Onion (Green)",
          imageUrl: "./src/images/plant2.png",
          metrics: {
            humidity: "30%",
            pHLevel: 6.8,
            nutrients: {
              nitrogen: "20%",
              phosphorus: "15%",
              potassium: "10%",
            },
          },
        },
        {
          id: 2,
          name: "Rosemary",
          type: "Potatoes",
          imageUrl: "./src/images/plant4.png",
          metrics: {
            humidity: "20%",
            pHLevel: 6.3,
            nutrients: {
              nitrogen: "18%",
              phosphorus: "14%",
              potassium: "20%",
            },
          },
        },
      ],
    },
  ];
  
 
  module.exports = users;