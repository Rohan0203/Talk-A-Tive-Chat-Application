import {createContext, useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [user, setUser] = useState();
    const navigate = useNavigate();
    var [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if(!userInfo){
            navigate('/');
        }
    }, [navigate])

    return (
      <ChatContext.Provider
        value={{
          user,
          setUser,
          notification,
          selectedChat,
          setNotification,
          setSelectedChat,
          chats,
          setChats,
        }}
      >
        {children}
      </ChatContext.Provider>
    );
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;