import { Box, Button, Typography } from '@mui/material';
import {TaskAlt} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import { motion } from 'framer-motion';
import theme from '../theme/theme';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import Signin from './Signin';
import currentPicks from '../json_files/currentPicks.json';

const betKey = 'dd/mm/yyyy';


const updateVotes = async(data) => {
  const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}api/updateVotes`;

  const JSONdata = JSON.stringify(data);

  const options = {
    // The method is POST because we are sending data.
    method: 'POST',
    // Tell the server we're sending JSON.
    headers: {
      'Content-Type': 'application/json',
    },
    // Body of the request is the JSON data we created above.
    body: JSONdata
  };
  
  
  const response = await fetch(endpoint, options);
  return response.ok;
}



const checkVoted = async(data) => {
  const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}api/checkVoted`;

  const JSONdata = JSON.stringify(data);

  const options = {
    // The method is POST because we are sending data.
    method: 'POST',
    // Tell the server we're sending JSON.
    headers: {
      'Content-Type': 'application/json',
    },
    // Body of the request is the JSON data we created above.
    body: JSONdata
  };
  
  
  const response = await fetch(endpoint, options);
  const result = await response.json();
  return result.didVote;
}






// ███████╗███████╗██╗     ███████╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗
// ██╔════╝██╔════╝██║     ██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
// ███████╗█████╗  ██║     █████╗  ██║        ██║   ██║██║   ██║██╔██╗ ██║
// ╚════██║██╔══╝  ██║     ██╔══╝  ██║        ██║   ██║██║   ██║██║╚██╗██║
// ███████║███████╗███████╗███████╗╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║
// ╚══════╝╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
                                                                       
const SelectionItem = ({pick,...props}) => {

  const pickName = `pick_${pick}`;
  

  

  return(
    
      <motion.div id='square-selection'
      initial={{rotate:0}}
      whileHover={{rotate:4}}
      onClick={() => {
        props.setter(pickName);
      }}
      >

        <Box sx={{
          position:'relative',
          cursor:'pointer',
          borderRadius:'10px',
          height:'100%',
          width:'100%',
          border:(props.set == pickName)? '1px solid #00ffbf':`1px solid ${theme.palette.primary.fontdull}` ,
          backgroundColor:(props.set == pickName)? 'primary.darker':'primary.main',
          display:'flex',
          flexDirection:'column',
          justifyContent:'center'
        }}>

          <Box sx={{width:'100%',display:'flex',justifyContent:'center',position:'absolute'}}>
            <Typography id='current' sx={{width:'80%', color:'primary.font',display:'flex', justifyContent:'center', alignItems:'center',fontSize:'15px'}}>
              {currentPicks[betKey][pickName]['bet']}
            </Typography>
          </Box>

        </Box>
      </motion.div>
  )
}

// ███████╗██╗   ██╗██████╗ ███╗   ███╗██╗████████╗
// ██╔════╝██║   ██║██╔══██╗████╗ ████║██║╚══██╔══╝
// ███████╗██║   ██║██████╔╝██╔████╔██║██║   ██║   
// ╚════██║██║   ██║██╔══██╗██║╚██╔╝██║██║   ██║   
// ███████║╚██████╔╝██████╔╝██║ ╚═╝ ██║██║   ██║   
// ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝   ╚═╝   
                                                
const SubmitButton = ({subFunction, showButton}) => {

  return(
    <Button 
        disabled={!showButton? true:false}
        sx={{
            color:'white'.font,marginX:'auto', width:'70%',
            '&.MuiButton-contained':{
              backgroundColor:'primary.main'    
            }
        }}
        onClick={() => {
          subFunction();
        }}
        variant='contained'
        
    >
        Vote
    </Button>
  )
}


// ██╗   ██╗ ██████╗ ████████╗██╗███╗   ██╗ ██████╗ 
// ██║   ██║██╔═══██╗╚══██╔══╝██║████╗  ██║██╔════╝ 
// ██║   ██║██║   ██║   ██║   ██║██╔██╗ ██║██║  ███╗
// ╚██╗ ██╔╝██║   ██║   ██║   ██║██║╚██╗██║██║   ██║
//  ╚████╔╝ ╚██████╔╝   ██║   ██║██║ ╚████║╚██████╔╝
//   ╚═══╝   ╚═════╝    ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝ 
                                                 
const VotingView = (props) => {
  const sizeMax = 400;
  const [chosen,setChosen] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [enabledCookies, setEnabledCookies] = useState(false);

  useEffect(() => {
    setEnabledCookies(navigator.cookieEnabled);
  },[]);

  useEffect(() => {
    if (chosen != '') {
      setShowButton(true);
    } else {
      false;
    }
  },[chosen])
  
  const handleSubmit = async() => {
    const currentName = chosen;
    const chosenPick = currentPicks[betKey][chosen]['bet'];
    
    const data = {
      'betkey':betKey,
      'pick_1':currentPicks[betKey]['pick_1'],
      'pick_2':currentPicks[betKey]['pick_2'],
      'pick_3':currentPicks[betKey]['pick_3'],
      'pick_4':currentPicks[betKey]['pick_4'],
      "pick":currentName,
      "bet":chosenPick,
      'user':props.currentUser.username
    }
    
    

    const worked = await updateVotes(data);

    if (worked) {
      props.setFunction(true);
    }
  }

  return(
    <Box sx={{height:'90%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
              position:'relative',zIndex:0
            }}>
        {!props.currentUser && <DisabledOverlay />}
        <Box sx={{width:'100%',display:'flex'}}>
          <Box sx={{width:'50%', display:'flex',flexDirection:'column',alignItems:'center'}}>
            <SelectionItem pick={1} set={chosen} setter={setChosen} />
            <SelectionItem pick={2} set={chosen} setter={setChosen} />
          </Box>
          <Box sx={{width:'50%', display:'flex',flexDirection:'column',alignItems:'center'}}>
            <SelectionItem pick={3} set={chosen} setter={setChosen} />
            <SelectionItem pick={4} set={chosen} setter={setChosen} />
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          alignItems:'center',
          justifyContent:'center',
          height: '70px',
          width:'100%'
        }}>
          <Box sx={{width:'100%',display:'flex'}}>
            <SubmitButton subFunction={handleSubmit} showButton={showButton}/>
          </Box>
        </Box>

    </Box>
  )
}

// ██╗   ██╗ ██████╗ ████████╗███████╗██████╗ 
// ██║   ██║██╔═══██╗╚══██╔══╝██╔════╝██╔══██╗
// ██║   ██║██║   ██║   ██║   █████╗  ██║  ██║
// ╚██╗ ██╔╝██║   ██║   ██║   ██╔══╝  ██║  ██║
//  ╚████╔╝ ╚██████╔╝   ██║   ███████╗██████╔╝
//   ╚═══╝   ╚═════╝    ╚═╝   ╚══════╝╚═════╝ 
                                           
const VotedView = () => {

  return(
    <Box sx={{
      width:'100%',
      height:'80%',
      display:'flex',
      alignItems:'center',
      justifyContent:'center'
    }}>
      <Box sx={{width:'100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <Typography variant='h3' sx={{color:'primary.font',margin:'10px'}}>
          Thank You
        </Typography>
        <Box sx={{height:'120px',display:'flex',alignItems:'center'}}>
          <TaskAlt sx={{width:'70px',height:'70px',color:'secondary.main'}} />
        </Box>
        <Typography variant='h6' sx={{color:'primary.fontdull'}}>
          Your pick has been submitted
        </Typography>
      </Box>

    </Box>
  )
}




// ██████╗ ██╗███████╗ █████╗ ██████╗ ██╗     ███████╗
// ██╔══██╗██║██╔════╝██╔══██╗██╔══██╗██║     ██╔════╝
// ██║  ██║██║███████╗███████║██████╔╝██║     █████╗  
// ██║  ██║██║╚════██║██╔══██║██╔══██╗██║     ██╔══╝  
// ██████╔╝██║███████║██║  ██║██████╔╝███████╗███████╗
// ╚═════╝ ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝
                                                   
const DisabledOverlay = () => {

  return(
    <Box sx={{
      width:'100%',
      height:'100%',
      backgroundColor:'#20202055',
      position:'absolute',
      borderRadius:'10px',
      zIndex:1,
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      backdropFilter:'blur(10px)'
    }}>

      <Box sx={{width:'60%',height:'50%',backgroundColor:'#05050555',borderRadius:'10px',display:'flex',alignItems:'center'}}>
        <Typography variant='h4' sx={{color:'primary.font',margin:'20px'}}>
          Please Login or Register in order to vote
        </Typography>
      </Box>

    </Box>
  )
}


// ██████╗  █████╗ ███╗   ██╗███╗   ██╗███████╗██████╗ 
// ██╔══██╗██╔══██╗████╗  ██║████╗  ██║██╔════╝██╔══██╗
// ██████╔╝███████║██╔██╗ ██║██╔██╗ ██║█████╗  ██████╔╝
// ██╔══██╗██╔══██║██║╚██╗██║██║╚██╗██║██╔══╝  ██╔══██╗
// ██████╔╝██║  ██║██║ ╚████║██║ ╚████║███████╗██║  ██║
// ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝
                                                    
const EnableBanner = (props) => {
  
  return(
    <Box sx={{
      position:'absolute',
      top:0,
      left:0,
      width:'100%',
      height:'50px',
      backgroundColor:'secondary.main',
      borderBottomLeftRadius:'5px',
      borderBottomRightRadius:'5px',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      color:'primary.font'
    }}>
      <Typography variant='h6'>
        Please enable cookies in order to vote
      </Typography>

    </Box>
  )
}


function Votepage({data}) {
  
  const [voted, setVoted] = useState(false);
  const [showBanner,setShowBanner]=useState(true);
  const [windowHeight, setWindowHeight] = useState(800);
  const { data: session, status } = useSession();

  const handleHeight = (event) => {
    setWindowHeight(window.innerHeight);
  }

  const quickCheck = async() => {
    if (data.user) {
      const checkData = { 
        betkey:betKey,
        username:data.user.username
      }
      const didVote = await checkVoted(checkData);
      if (didVote) {
        setVoted(didVote);
      }
    }
  }

  useEffect(() => { 
    setWindowHeight(window.innerHeight);
    setShowBanner(navigator.cookieEnabled);
    quickCheck();
    window.addEventListener('resize',handleHeight);

    return () => window.removeEventListener('resize',handleHeight);
  },[])
  

  // ███╗   ███╗    ██████╗  ██████╗ ██████╗ ██╗   ██╗
  // ████╗ ████║    ██╔══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
  // ██╔████╔██║    ██████╔╝██║   ██║██║  ██║ ╚████╔╝ 
  // ██║╚██╔╝██║    ██╔══██╗██║   ██║██║  ██║  ╚██╔╝  
  // ██║ ╚═╝ ██║    ██████╔╝╚██████╔╝██████╔╝   ██║   
  // ╚═╝     ╚═╝    ╚═════╝  ╚═════╝ ╚═════╝    ╚═╝   
                                                   
  return (
    
      <ThemeProvider theme={theme} > 
        <Box sx={{width:'100%',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'primary.darker',overflowY:'hidden'}}>

          <Box sx={{position:'absolute', left:0,top:0}}>
            <Signin user={data} />
          </Box>

          <Box sx={{
            width:'600px',
            height:windowHeight < 700? '500px':'700px',
            display:'flex',
            flexDirection:'column',
            flexWrap:'wrap',
            justifyContent:'center',
            borderRadius:'10px',
            position:'relative',
            background:'linear-gradient(135deg, #743fd155, #3e84cf55)'
          }}>
            
            {!voted?
              <VotingView setFunction={setVoted} currentUser={data.user} />:
              <VotedView />
            }
          </Box>

        </Box>
      </ThemeProvider>
    
  );
}




export default Votepage;
