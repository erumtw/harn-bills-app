import { View, Text } from 'react-native';
import React, {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
// import { get_current_user } from '../api/constant/services';
import { getCurrentUser } from '../firebase/services';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setUser(res);
          setIsLogged(true);
        } else {
          setUser(null);
          setIsLogged(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <GlobalContext.Provider value={{ user, setUser, isLogged, setIsLogged }}>
      {children}
    </GlobalContext.Provider>
  );
};
