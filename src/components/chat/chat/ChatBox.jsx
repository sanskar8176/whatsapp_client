import { useContext, useState, useEffect } from 'react';
import { Box } from '@material-ui/core';

import { UserContext } from '../../../context/UserProvider';
import { AccountContext } from '../../../context/AccountProvider';
import { getConversation, newMessages } from '../../../service/api';

//components
import ChatHeader from './ChatHeader';
import Messages from './Messages';

const ChatBox = () => {
    const { person, setPerson } = useContext(UserContext);
    const { account } = useContext(AccountContext);

    const [conversation, setConversation] = useState({});
    
    useEffect(() => {
        const getConversationDetails = async () => {
            let data = await getConversation({ sender: account.googleId, receiver: person.googleId });
            setConversation(data);
        }
        getConversationDetails();
    }, [person.googleId]);
    //kisi ki conversation me click krne pr ye useeffect call hoga
    return (
        <Box style={{height: '75%'}}>
            <ChatHeader person={person} />
            <Messages person={person} conversation={conversation} />
        </Box>
    )
}

// conversationId = receveris + senderid 

export default ChatBox;