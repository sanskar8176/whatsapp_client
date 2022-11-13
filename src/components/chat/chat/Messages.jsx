import { useState, useEffect, useContext, useRef } from 'react';
import { Box, makeStyles } from '@material-ui/core';

// import { io } from 'socket.io-client';

import { getMessages, newMessages } from '../../../service/api';
import { AccountContext } from '../../../context/AccountProvider';

//components
import Message from './Message';
import Footer from './Footer';

const useStyles = makeStyles({
    wrapper: {
        backgroundImage: `url(${'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'})`,
        // css se url lgane pr asani se text uske upr likhi ja skti hai 
        
        // height: 'calc(100% - 114px)',
        backgroundSize: '50%'
    },
   
    component: {
        height: '79vh',
        overflowY: 'scroll'
    },
    container: {
        padding: '1px 80px'
    }
})


const Messages = ({ person, conversation }) => {
    const classes = useStyles();

    const [messages, setMessages] = useState([]);
    const [incomingMessage, setIncomingMessage] = useState(null);
    const [value, setValue] = useState();

    const scrollRef = useRef();

    const { account, socket, newMessageFlag, setNewMessageFlag } = useContext(AccountContext);

    useEffect(() => {
        
        socket.current.on('getMessage', data => {
            setIncomingMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })
    }, []);


    
    useEffect(() => {
        const getMessageDetails = async () => {
            let data = await getMessages(conversation._id);
            setMessages(data);
        }
        getMessageDetails();
    }, [conversation?._id, person._id, newMessageFlag]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ transition: "smooth" })
    }, [messages]);
// scrollref ka use scrollbar ko latest msg pr show krne ke liye 




    useEffect(() => {
        incomingMessage && conversation?.members?.includes(incomingMessage.sender) && 
            setMessages((prev) => [...prev, incomingMessage]);   //previous sbhi msg me new incoming msg append kiya 
        
    }, [incomingMessage, conversation]);

    const receiverId = conversation?.members?.find(member => member !== account.googleId);
    
    const sendText = async (e) => {
        let code = e.keyCode || e.which;     //e me konsa button presss tha vo data bhi aya tha 
        if(!value) return;
// enter ka keycode 13hota hai 
// msg values ko states me store 
        if(code === 13) { 
            let message = {
                sender: account.googleId,
                conversationId: conversation._id,
                text: value
            };
// sender ko alg se bheja taki msg kon bheja eska differnce kita ha ske 
        

                socket.current.emit('sendMessage', { //send msg is name of socket
                senderId: account.googleId,
                receiverId,
                text: value
            })

            await newMessages(message);

            setValue('');    //send ke baad input ko empty krne ke liye 
            setNewMessageFlag(prev => !prev);   
        } 
    }

    return (
        <Box className={classes.wrapper}>
            <Box className={classes.component}>
                {  // sare messages ko alag krk as a prop bheja 
                    messages && messages.map(message => (
                        <Box className={classes.container} ref={scrollRef}>
                            <Message message={message} />
                        </Box>
                    ))
                }
            </Box>
            <Footer sendText={sendText} value={value} setValue={setValue} />
        </Box>
    )
}

export default Messages;