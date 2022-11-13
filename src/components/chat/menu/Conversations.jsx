import { useState, useEffect, useContext, useRef } from 'react';
import { Box, makeStyles, Divider } from '@material-ui/core';

import { AccountContext } from '../../../context/AccountProvider';

//components
import Conversation from './Conversation';
import { getUsers } from '../../../service/api';

const useStyles = makeStyles({
    component: {
        overflow: 'overlay',
        height: '81vh'
    },
    divider: {
        margin: '0 0 0 67px',
        backgroundColor: '#F2F2F2'
    }
})

const Conversations = ({ text }) => {
    const classes = useStyles();
    const [users, setUsers] = useState([]);
    // usestate sttate chane pr work krega 

    const { account, socket, setActiveUsers } = useContext(AccountContext);

    useEffect(() => {
        const fetchData = async () => {
            try{
                let data = await getUsers();
                let fiteredData = data.filter(user => user.name.toLowerCase().includes(text.toLowerCase()));
                setUsers(fiteredData);
            }catch(error){
                console.log('Error in fetching user in conversations.jsx',error);    
            }
        }
        fetchData();
    }, [text]); 

    // [] ka mtlb component didmount then kewal ek bar chelga
    //text k change hone pr ye useeffect call aur usk according database se user fetch krega



    useEffect(() => {
        socket.current.emit('addUser', account.googleId);  // bhejne k liye emit
        socket.current.on("getUsers", users => {
            setActiveUsers(users);
        })
    }, [account])

    return (
        <Box className={classes.component}>
            {
                users && users.map((user, index) => (
                    user.googleId !== account.googleId && 
                        <>
                            <Conversation key = {user._id} user={user} />
                            {
                                users.length !== (index + 1)  && <Divider className={classes.divider} />
                            }
                        </>
                ))
            }
        </Box>
    )
}

export default Conversations;