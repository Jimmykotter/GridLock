import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { GameBoard } from './pages/gameboard'; // Ensure this component exists
import { Signup } from './pages/Signup';
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Use the correct key for the token stored in local storage
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token'); // Updated key to match your token
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="flex-column justify-flex-start min-100-vh">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/gameboard" element={<GameBoard />} />
          </Routes>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
