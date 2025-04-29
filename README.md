# GridLock

**GridLock** is a full-stack MERN application where users challenge an AI opponent in a classic game of Tic-Tac-Toe. Users can log in, track their wins, losses, and ties, and compete against a simple or advanced AI. Built with a focus on fast, responsive gameplay, **GridLock** merges traditional strategy with modern web technologies.

## Features

- Play Tic-Tac-Toe against an AI opponent
- Create a user account and log in with JWT-based authentication
- Track wins, losses, and ties on a personal dashboard
- Fully responsive and clean user interface
- Fast and intuitive gameplay experience
- Real-time game result tracking and display

## Screenshots

![image](https://github.com/user-attachments/assets/example-placeholder.png)

## Built With

**Frontend**
- [React](https://reactjs.org/) – Frontend UI library
- [Apollo Client](https://www.apollographql.com/docs/react/) – GraphQL client for managing API requests
- [React Router](https://reactrouter.com/) – Client-side routing
- [Chakra UI](https://chakra-ui.com/) – Component library for a polished, mobile-friendly design

**Backend**
- [Node.js](https://nodejs.org/) – Runtime environment
- [Express](https://expressjs.com/) – Server framework
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/) – GraphQL API server
- [MongoDB](https://www.mongodb.com/) – NoSQL database
- [Mongoose](https://mongoosejs.com/) – ODM for MongoDB
- [JWT](https://jwt.io/) – Authentication with JSON Web Tokens
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) – Password hashing

## GraphQL API

**Queries**
- `me` – Returns the current user's profile and game record
- `games` – Returns recent games played by the user

**Mutations**
- `login(email, password)` – Logs in user and returns token
- `addUser(username, email, password)` – Creates a new user and returns token
- `recordGame(result)` – Records a game result (win, loss, tie) for the user

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/gridlock.git
cd gridlock
```

### 2. Install dependencies:
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3. Start the development servers:
```bash
# Backend
cd server
npm run develop

# Frontend
cd ../client
npm run dev
```

## Contributing

This is a collaborative class project but forks and personal customizations are welcome! Feel free to customize and build upon it.

## License

This project is licensed under the [MIT License](LICENSE).

## Authors

**Jimmy**  
- [GitHub](https://github.com/jimmykotter)  
- [Email](mailto:Jimmykotter@gmail.com)

*(Add your teammates here if working as a group.)*

## Link to Deployed Website

*(Add this after deploying to Render!)*  
Example placeholder:  
https://gridlock.onrender.com

https://github.com/Jimmykotter/gridlock
https://github.com/Jimmykotter/bookscope
