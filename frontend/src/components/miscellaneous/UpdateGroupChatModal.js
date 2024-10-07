import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from 'axios';
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  const [loading, setLoading] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRemove = async(u) => {
    if(selectedChat.groupAdmin._id !== user._id && u._id !== user._id) {
        toast({
          title: "Only admins can remove someone!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
    }

    try {
        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }

        const {data} = await axios.put("/api/chat/groupremove", {
            chatId: selectedChat._id,
            userId: u._id,
        }, config)

        setSelectedChat(data);
        setLoading(false);
        fetchMessages();
        setFetchAgain(!fetchAgain);
    } catch (error) {
        toast({
          title: "Error Occured !!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
    }
  };

  const handleAddUser = async(u) => {
    if(selectedChat.users.find(u1 => u1._id === u._id)) {
        toast({
            title: "User already added in group!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        })
        return;
    }
    if(selectedChat.groupAdmin._id !== user._id) {
        toast({
            title: "Only admins can add someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        })
        return;
    }

    try {
        setLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const {data} = await axios.put("/api/chat/groupadd", {
            chatId: selectedChat._id,
            userId: u._id,
        }, config);

        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
    } catch (error) {
        toast({
          title: "Error Occured !!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
    }
  };

  const handleRename = async () => {
    if(!groupChatName) return;
    try {
        setRenameLoading(true);

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        };

        const {data} = await axios.put('/api/chat/rename', {
            chatId: selectedChat._id,
            chatName: groupChatName,
        }, config);

        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);

    } catch (error) {
        toast({
          title: "Error Occured",
          description: "Failed to load the Chats",
          duration: 5000,
          status: "error",
          isClosable: true,
          position: "bottom-left",
        });
        setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured !!",
        description: "Failed to Load the Search Results",
        duration: 5000,
        status: "error",
        isClosable: true,
        position: "bottom-left",
      });
    }
  };


  return (
    <>
      <IconButton
        onClick={onOpen}
        display={{ base: "flex" }}
        icon={<ViewIcon />}
      />
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily="Work sans"
            fontSize="40px"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                  />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                value={groupChatName}
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl d="flex">
              <Input
                placeholder="Add User To Group"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult.map((u) => (
                <UserListItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleAddUser(u)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
