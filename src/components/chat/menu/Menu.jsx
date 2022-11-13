import { useState } from 'react';
import { Box } from '@material-ui/core';

//components
import Header from './Header';
import Search from './Search';
import Conversations from './Conversations';

const Menu = () => {
    const [text, setText] = useState('');
    return (
        <Box>
            <Box>
                <Header/>
                <Search setText={setText} />
                <Conversations text={text} />   
                {/* jp input me likhege vo text variable me a jayega    // lifting the state up concept*/}
            </Box>
        </Box>
    )
}

export default Menu;