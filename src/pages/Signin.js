import {PersonOutline,InputAdornment, Close, Check } from "@mui/icons-material";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { AnimatePresence, motion} from 'framer-motion';
import { AccountCircle, Key,Cancel, Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import theme from "@/theme/theme";
import {signIn, signOut, useSession} from 'next-auth/react';


const fieldStyle={
    margin:'10px',
    '& .MuiInputLabel-root':{
        color:'white'
    },
    '& .MuiOutlinedInput-root':{
        color:'white'
    },
    '&:hover .MuiOutlinedInput-notchedOutline':{
        border:`1px solid ${'#ffffff'}`
    },
    '& .MuiOutlinedInput-notchedOutline':{
        color:'white',
        border:`1px solid ${theme.palette.primary.fontdull}`
    }
}








const IconTextField = ({iconStart,iconEnd,placeholder,password,fieldId,fieldRef,changeEvent,...props}) => {
        


    return(
        <TextField ref={fieldRef && fieldRef}  id={fieldId && fieldId} sx={fieldStyle}
            color='highlight'
            size='small'
            type={password? (props.showPassword? 'text':'password'):'text'}
            placeholder={placeholder && placeholder}
            InputProps={{
                startAdornment:iconStart && iconStart,
                endAdornment:iconEnd && iconEnd
            }}
            onChange={changeEvent && changeEvent}

        />
    )
}


const UserField = ({name,track}) => {

    

    
    return(
        <IconTextField
            iconStart={ <AccountCircle sx={{color:'white',marginRight:'10px'}} /> }
            placeholder='UserName'
            fieldId={name && name}
            changeEvent={track? () => {track()}:() => {}}
        />
    )
}

const PasswordField = ({name, placeholder,fieldRef,track}) => {
    const [showPassword, setShowPassword] = useState(false);
    return(
        <Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <IconTextField
                iconStart={<Key sx={{color:'primary.font',marginRight:'10px'}} />}
                iconEnd={
                    <IconButton sx={{padding:0}}
                        onClick={() => {setShowPassword(!showPassword);}}
                    >
                        {showPassword? 
                            <VisibilityOff sx={{color:'primary.font'}}/>:
                            <Visibility sx={{color:'primary.font'}} />
                        }
                    </IconButton>
                }
                placeholder={placeholder && placeholder}
                password={true}
                showPassword={showPassword}
                fieldId={name && name}
                fieldRef={fieldRef}
                changeEvent={track}
            />
        </Box>
    )
}


// ███████╗    ██╗   ██╗██╗███████╗██╗    ██╗
// ██╔════╝    ██║   ██║██║██╔════╝██║    ██║
// ███████╗    ██║   ██║██║█████╗  ██║ █╗ ██║
// ╚════██║    ╚██╗ ██╔╝██║██╔══╝  ██║███╗██║
// ███████║     ╚████╔╝ ██║███████╗╚███╔███╔╝
// ╚══════╝      ╚═══╝  ╚═╝╚══════╝ ╚══╝╚══╝ 
                                          
const SigninView = ({setReg,setSession}) => {
    
    const [regLine, setRegline] = useState(false);
    const [userExists, setUserExists] = useState(false);
    const [signError, setSignError] = useState(false);
    const [timer, setTimer] = useState(null);


    // functions
    const handleSignin = async() => {
        const userNameField = document.querySelector('#login-username');
        const passwordField = document.querySelector('#login-password');

        const data = {
            username:userNameField.value,
            password:passwordField.value
        }

        const correctCreds = await checkCredentials(data);
        
        

        if (correctCreds.correct) {
            await signIn('credentials',{
                username:userNameField.value,
                password:passwordField.value
            })
        } else {
            setSignError(true);
        }


    }

    const checkCredentials = async(credentials) => {

        const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkCredentials`;
        
        const data=credentials;

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

        const response = await fetch (endpoint,options); 
        const converted = await response.json();
        return(converted);
    }

    const checkUser = async() => {
        const field = document.querySelector('#login-username')
        const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkUser`;
        
        const data={
            username:field.value
        }

        // const JSONdata = JSON.stringify(data);

        // const options = {
        //     // The method is POST because we are sending data.
        //     method: 'POST',
        //     // Tell the server we're sending JSON.
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     // Body of the request is the JSON data we created above.
        //     body: JSONdata
        // };

        // const response = await fetch (endpoint,options); 
        // const info = await response.json();
        
        // if (info.exists) {
        //     setUserExists(true);
        // } else if (!(info.exists)) {
        //     setUserExists(false);
        // }

    }

    const doneTyping = (event) => {
        clearTimeout(timer);

        const newTimer = setTimeout(() => {
        checkUser();
        if (signError) {
            setSignError(false);
        }
        }, 500);

        setTimer(newTimer);
    }


    const ErrorMessage = ({message}) => {

        return(
            <Box sx={{
                color:'#f03737'
            }}>
                <Typography sx={{fontSize:'12px'}}>
                    {message}
                </Typography>
            </Box>
        )
    }

    // ███████╗    ██████╗  ██████╗ ██████╗ ██╗   ██╗
    // ██╔════╝    ██╔══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
    // ███████╗    ██████╔╝██║   ██║██║  ██║ ╚████╔╝ 
    // ╚════██║    ██╔══██╗██║   ██║██║  ██║  ╚██╔╝  
    // ███████║    ██████╔╝╚██████╔╝██████╔╝   ██║   
    // ╚══════╝    ╚═════╝  ╚═════╝ ╚═════╝    ╚═╝   
                                                  
    return(
        <motion.div style={{width:'100%',height:'100%'}}
        initial={{opacity:0}}
        animate={{opacity:1,transition:{delay:1}}}
        exit={{opacity:0}}
        >
            <Box sx={{width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
                <Box sx={{width:'80%',height:'50%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                    <Typography variant='h5' sx={{width:'75%',marginY:'10px',display:'flex',justifyContent:'flex-end'}}>
                        Log In
                    </Typography>

                    {signError && <ErrorMessage message='Username/Password is not correct' /> }

                    <UserField name='login-username' track={doneTyping} />
                    <PasswordField name='login-password' placeholder={'Password'}/>
                    
                    <Button variant="outlined" color='highlight' sx={{width:'90%',margin:'10px'}}
                        onClick={() => {
                            setSession(true);
                        } }
                    >
                        Log In
                    </Button>
                    
                    <Box sx={{width:'80%'}}
                    >
                        <Box >
                            <Box sx={{width:'60px',cursor:'pointer'}}
                                onClick={() => {
                                    setReg(true);
                                }}
                                onMouseEnter={() => {
                                    setRegline(true);
                                }}
                                onMouseLeave={() => {
                                    setRegline(false);
                                }}
                            >

                                <Typography >
                                    Register
                                </Typography>
                                
                            <motion.div style={{height:'1px',backgroundColor:'white'}}
                                initial={{width:0}}
                                animate={{
                                    width:regLine? '100%':0,
                                    transition:{
                                        ease:'easeInOut'
                                    }
                                }}
                                ></motion.div>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </motion.div>
    )
}

// ██████╗     ██╗   ██╗██╗███████╗██╗    ██╗
// ██╔══██╗    ██║   ██║██║██╔════╝██║    ██║
// ██████╔╝    ██║   ██║██║█████╗  ██║ █╗ ██║
// ██╔══██╗    ╚██╗ ██╔╝██║██╔══╝  ██║███╗██║
// ██║  ██║     ╚████╔╝ ██║███████╗╚███╔███╔╝
// ╚═╝  ╚═╝      ╚═══╝  ╚═╝╚══════╝ ╚══╝╚══╝ 
                                          
const RegisterView = ({setReg}) => {
    const [regLog, setRegLog] = useState(false);
    const [userExists,setUserExists] = useState(false);
    const [flag1,setFlag1] = useState(false);
    const [flag2,setFlag2] = useState(false);
    const [flag3,setFlag3] = useState(false);
    const [flag4,setFlag4] = useState(false);
    const [userFlag,setUserFlag] = useState(0);
    const [pass1Flag,setPass1Flag] = useState(0);
    const [pass2Flag,setPass2Flag] = useState(0);
    const [registered, setRegistered] = useState(false);
    const [regName, setRegName] = useState(null);
    

    const handleRegister = async() => {
        
        
        if ((userFlag==1) && (pass1Flag==1) && (pass2Flag==1)) {
            
            const userField = document.querySelector('#register-username');
            const passField = document.querySelector('#reg-password');
            setRegName(userField.value);
            const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/registerUser`;
            const data = {
                username:userField.value,
                password:passField.value
            }

            setRegistered(true)


            // const JSONdata = JSON.stringify(data);

            // const options = {
            //     // The method is POST because we are sending data.
            //     method: 'POST',
            //     // Tell the server we're sending JSON.
            //     headers: {
            //     'Content-Type': 'application/json',
            //     },
            //     // Body of the request is the JSON data we created above.
            //     body: JSONdata
            // };

            // const response = await fetch(endpoint,options);
            
            // if (response) {
            //     setRegistered(true);
            // }
        }

    }

    // ██████╗  █████╗ ███████╗███████╗     ██████╗██╗  ██╗███████╗ ██████╗██╗  ██╗
    // ██╔══██╗██╔══██╗██╔════╝██╔════╝    ██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝
    // ██████╔╝███████║███████╗███████╗    ██║     ███████║█████╗  ██║     █████╔╝ 
    // ██╔═══╝ ██╔══██║╚════██║╚════██║    ██║     ██╔══██║██╔══╝  ██║     ██╔═██╗ 
    // ██║     ██║  ██║███████║███████║    ╚██████╗██║  ██║███████╗╚██████╗██║  ██╗
    // ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝     ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝
                                                                                
    const checkPasswords = () => {
        
        const userfield = document.querySelector('#register-username');
        const pass1field = document.querySelector('#reg-password');
        const pass2field = document.querySelector('#reg-password-repeat');
        
        const special=['!','"','#','$','%','&',"'",'(',')','*','+',',','-','.','/',':',';','<','=','>','?','@','[','\\',']','^','_','`','{','|','}','~']
        var found = 0;

        // flag 1
        if (pass1field.value.length >= 12) {
            setFlag1(true);
        } else {
            setFlag1(false);
        }

        // flag2
        special.forEach((item) => {
            if (pass1field.value.includes(item)) {
                found++;
            }
        })
        if (found>0) {
            setFlag2(true);
        } else {
            setFlag2(false);
        }

        // flag3
        const check1 = /[A-Z]/.test(pass1field.value);
        const check2 = /[0-9]/.test(pass1field.value);
        
        if (check1 && check2) {
            if (!flag3) {
                setFlag3(true);
            }
            
        } else {
            setFlag3(false);
        }

        // flag4
        if ((pass1field.value === pass2field.value) && (pass1field.value.length>0) && (pass2field.value.length>0) ) {
            
            setFlag4(true);
        } else {
            setFlag4(false);
        }

    }

    // ██╗   ██╗███████╗███████╗██████╗      ██████╗██╗  ██╗███████╗ ██████╗██╗  ██╗
    // ██║   ██║██╔════╝██╔════╝██╔══██╗    ██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝
    // ██║   ██║███████╗█████╗  ██████╔╝    ██║     ███████║█████╗  ██║     █████╔╝ 
    // ██║   ██║╚════██║██╔══╝  ██╔══██╗    ██║     ██╔══██║██╔══╝  ██║     ██╔═██╗ 
    // ╚██████╔╝███████║███████╗██║  ██║    ╚██████╗██║  ██║███████╗╚██████╗██║  ██╗
    //  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝     ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝
                                                                                 
    const checkUser = async() => {
        const field = document.querySelector('#register-username')
        const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkUser`;
        
        const data={
            username:field.value
        }
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

        setUserExists(false);
        // const response = await fetch (endpoint,options); 
        // const info = await response.json();
        
        
        // if (info.exists) {
        //     setUserExists(true);
        // } else if (!(info.exists)) {
        //     setUserExists(false);
        // }

    }

    // ███████╗██╗     ██████╗      ██████╗██╗  ██╗███████╗ ██████╗██╗  ██╗
    // ██╔════╝██║     ██╔══██╗    ██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝
    // █████╗  ██║     ██║  ██║    ██║     ███████║█████╗  ██║     █████╔╝ 
    // ██╔══╝  ██║     ██║  ██║    ██║     ██╔══██║██╔══╝  ██║     ██╔═██╗ 
    // ██║     ███████╗██████╔╝    ╚██████╗██║  ██║███████╗╚██████╗██║  ██╗
    // ╚═╝     ╚══════╝╚═════╝      ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝
                                                                        
    const checkFields = async() => {
        
        const userfield = document.querySelector('#register-username');
        const pass1field = document.querySelector('#reg-password');
        const pass2field = document.querySelector('#reg-password-repeat');
            
        await checkUser();
        
        if (userfield.value) {
            if (!userExists) {
                if (userfield.value.length >= 6) {
                    setUserFlag(1);
                } else {
                    setUserFlag(-1);
                }
            } else {
                setUserFlag(-1);
            }
        } else {
            setUserFlag(0);
        } 


        if (pass1field.value) {
            if (flag1 && flag2 && flag3) {
                setPass1Flag(1);
            } else {
                setPass1Flag(-1);
            }
        } else {
            setPass1Flag(0);
        }


        if (pass2field.value) {
            if (pass2field.value == pass1field.value) {
                setPass2Flag(1);
            } else {
                
                setPass2Flag(-1);
            }
        } else {
            setPass2Flag(0);
        }


    }

   


    const [timer,setTimer] = useState(null);

    const doneTyping = async(event) => {
        clearTimeout(timer);

        const newTimer = setTimeout(() => {
            checkPasswords();
            checkFields();
        }, 500);

        setTimer(newTimer);
    }

    useEffect(() => {
        if (!registered) {
            doneTyping();
        }
    },[flag1,flag2,flag3,userExists])



    // ██████╗ ███████╗ ██████╗ ██╗███████╗████████╗███████╗██████╗ ███████╗██████╗ 
    // ██╔══██╗██╔════╝██╔════╝ ██║██╔════╝╚══██╔══╝██╔════╝██╔══██╗██╔════╝██╔══██╗
    // ██████╔╝█████╗  ██║  ███╗██║███████╗   ██║   █████╗  ██████╔╝█████╗  ██║  ██║
    // ██╔══██╗██╔══╝  ██║   ██║██║╚════██║   ██║   ██╔══╝  ██╔══██╗██╔══╝  ██║  ██║
    // ██║  ██║███████╗╚██████╔╝██║███████║   ██║   ███████╗██║  ██║███████╗██████╔╝
    // ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝╚═════╝ 
                                                                                 
    const Registered = () => {

        return(
            <Box sx={{width:'100%',height:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
                <Box sx={{width:'90%',height:'150px',margin:'10px',backgroundColor:'#05050555', flexDirection:'column',
                          borderRadius:'5px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <Typography variant="h3" sx={{margin:'2%'}}>
                        Welcome
                    </Typography>
                    <Typography variant="h4" sx={{color:'highlight.main',margin:'2%'}}>
                        {regName}
                    </Typography>
                </Box>
                <Box sx={{width:'80%'}}>
                        <Box >
                            <Box sx={{width:'60px',cursor:'pointer'}}
                                onClick={() => {
                                    setReg(false);
                                }}
                                onMouseEnter={() => {
                                    setRegLog(true);
                                }}
                                onMouseLeave={() => {
                                    setRegLog(false);
                                }}
                            >

                                <Typography >
                                    Log In
                                </Typography>
                                
                            <motion.div style={{height:'1px',backgroundColor:'white'}}
                                initial={{width:0}}
                                animate={{
                                    width:regLog? '80%':0,
                                    transition:{
                                        ease:'easeInOut'
                                    }
                                }}
                                ></motion.div>
                            </Box>
                        </Box>
                    </Box>
            </Box>
        )


    }


    // ██████╗     ██████╗  ██████╗ ██████╗ ██╗   ██╗
    // ██╔══██╗    ██╔══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
    // ██████╔╝    ██████╔╝██║   ██║██║  ██║ ╚████╔╝ 
    // ██╔══██╗    ██╔══██╗██║   ██║██║  ██║  ╚██╔╝  
    // ██║  ██║    ██████╔╝╚██████╔╝██████╔╝   ██║   
    // ╚═╝  ╚═╝    ╚═════╝  ╚═════╝ ╚═════╝    ╚═╝   
                                                  
    return(
        <motion.div style={{width:'100%',height:'100%'}}
        initial={{opacity:0}}
        animate={{opacity:1,transition:{delay:.5}}}
        exit={{opacity:0}}
        >   
            {!registered ? 
            <Box sx={{width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
                <Box sx={{width:'80%',height:'50%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                    <Typography variant='h5' sx={{width:'80%',display:'flex',justifyContent:'flex-end',marginY:'10px'}}>
                        Register
                    </Typography>
                    
                    <Box sx={{display:'flex',alignItems:'center'}}>
                        <UserField name='register-username' track={() => {doneTyping(); ;}}/>
                        { userFlag==1?
                            <Check color="highlight" sx={{position:'absolute',right:'6px'}} />:
                            userFlag==-1? <Close sx={{position:'absolute',right:'6px',color:'#f03737'}} />:
                            <Box></Box>
                        }
                    </Box>
                    <Box sx={{display:'flex',alignItems:'center'}}>
                        <PasswordField name='reg-password' placeholder={'Password'} track={doneTyping} />
                        {pass1Flag==1?
                            <Check color="highlight" sx={{position:'absolute',right:'6px'}} />:
                            pass1Flag==-1? <Close sx={{position:'absolute',right:'6px',color:'#f03737'}} />:
                            <Box></Box>
                        }
                    </Box>
                    <Box sx={{display:'flex',alignItems:'center'}}>
                        <PasswordField name='reg-password-repeat' placeholder={'Repeat Password'}  track={doneTyping}/>
                        {pass2Flag==1?
                            <Check color="highlight" sx={{position:'absolute',right:'6px'}} />:
                            pass2Flag==-1? <Close sx={{position:'absolute',right:'6px',color:'#f03737'}} />:
                            <Box></Box>
                        }
                    </Box>
                    
                    
                    
                    

                    {/* <IconTextField /> */}

                    <Button color='highlight' variant='outlined' sx={{width:'90%', margin:'10px'}}
                    onClick={() => handleRegister()}
                    >
                        Register
                    </Button>
                    
                    
                    <Box sx={{width:'80%'}}>
                        <Box >
                            <Box sx={{width:'60px',cursor:'pointer'}}
                                onClick={() => {
                                    setReg(false);
                                }}
                                onMouseEnter={() => {
                                    setRegLog(true);
                                }}
                                onMouseLeave={() => {
                                    setRegLog(false);
                                }}
                            >

                                <Typography >
                                    Log In
                                </Typography>
                                
                            <motion.div style={{height:'1px',backgroundColor:'white'}}
                                initial={{width:0}}
                                animate={{
                                    width:regLog? '80%':0,
                                    transition:{
                                        ease:'easeInOut'
                                    }
                                }}
                                ></motion.div>
                            </Box>
                        </Box>
                    </Box>


                    


                </Box>
                
                <Box sx={{
                        backgroundColor:'#05050555',
                        width:'80%',
                        height:'45%',
                        borderRadius:'5px'
                    }}>
                    
                    <Box sx={{width:'100%',height:'15%',display:'flex',alignItems:'center',marginTop:'5%',marginLeft:'10%'}}>
                        <Typography >
                            Requirements:
                        </Typography>
                    </Box>
                    
                    <Box sx={{width:'100%',height:'15%',display:'flex',alignItems:'center',justifyContent:'',margin:'10px',backgroundColor:''}}>
                        <Cancel sx={{margin:'5px',color:flag1? 'highlight.main':'#f03737'}} />
                        <Typography sx={{fontSize:'15px',marginLeft:'10px'}}>
                            At least 12 characters
                        </Typography>
                    </Box>
                    <Box sx={{width:'100%',height:'15%',display:'flex',alignItems:'center',justifyContent:'',margin:'10px',backgroundColor:''}}>
                        <Cancel sx={{margin:'5px',color:flag2? 'highlight.main':'#f03737'}} />

                        <Box style={{position:'relative',top:'20%',height:'100%',width:'100%'}}>
                            <Box sx={{position:'absolute',width:'auto'}}>
                                <Typography sx={{fontSize:'20px'}}>
                                    Special Characters
                                </Typography>
                                <Typography sx={{color:'primary.fontdull', fontSize:'10px',marginLeft:'10px'}} >
                                    Ex: !@#$%^...
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    
                    <Box sx={{width:'100%',height:'15%',display:'flex',alignItems:'center',justifyContent:'',margin:'10px',backgroundColor:''}}>
                        <Cancel sx={{margin:'5px',color:flag3? 'highlight.main':'#f03737'}} />
                        <Box>
                            <Typography sx={{fontSize:'20px',marginLeft:'2%px'}}>
                                Uppercase/Numbers
                            </Typography>
                            
                        </Box>
                    </Box>
                    <Box sx={{width:'100%',height:'15%',display:'flex',alignItems:'center',justifyContent:'',margin:'10px',backgroundColor:''}}>
                        <Cancel sx={{margin:'5px',color:flag4? 'highlight.main':'#f03737'}} />
                        <Box>
                            <Typography sx={{fontSize:'20px',marginLeft:'2%px'}}>
                                Passwords Match
                            </Typography>
                            
                        </Box>
                    </Box>
                    


                </Box>
            </Box>:
            <Registered />
            }
        </motion.div>
    )
}

const LoggedIn = ({currentUser,setSession}) => {
    
    return(
        <motion.div style={{height:'100%',width:'100%'}}
            initial={{opacity:0}}
            animate={{opacity:1,transition:{delay:1}}}
            exit={{opacity:0}}
        >
        <Box sx={{
            width:'100%',
            height:'100%'
        }}>

            <Box sx={{width:'100%',height:'50%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <Box sx={{height:'50%'}}>
                    <Typography variant='h4' sx={{marginY:'5%'}}>
                        Logged In
                    </Typography>
                    <Typography variant='h5' sx={{color:'highlight.main',marginY:'5%'}}>
                        {currentUser}
                    </Typography>
                </Box>
                <Button variant="outlined" color='highlight' sx={{width:'60%'}}
                    onClick={() => {
                        setSession(false);
                    }}
                >
                    Log Out
                </Button>

            </Box>
            
        </Box>
        </motion.div>
    )
}


// ███████╗██╗ ██████╗ ███╗   ██╗    ██╗███╗   ██╗
// ██╔════╝██║██╔════╝ ████╗  ██║    ██║████╗  ██║
// ███████╗██║██║  ███╗██╔██╗ ██║    ██║██╔██╗ ██║
// ╚════██║██║██║   ██║██║╚██╗██║    ██║██║╚██╗██║
// ███████║██║╚██████╔╝██║ ╚████║    ██║██║ ╚████║
// ╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝    ╚═╝╚═╝  ╚═══╝
                                               
const Signin = ({user}) => {
    const [open,setOpen] = useState(false);
    const [register, setRegister] = useState(false);
    const [session,setSession] = useState(false);
    const [testuser,setTestuser] = useState('Test User');
    // const { data: session, status } = useSession();

    

    const containerStyle = {
        small:{
            margin:'10px',
            width:50,
            height:50,
            borderRadius:25,
            transition:{
                delay:.5,
                ease:'easeInOut'
            }
        },
        expanded:{
            margin:0,
            width:300,
            height:'100vh',
            borderRadius:5,
            transition:{
                delay:.5,
                ease:'easeInOut'
            }
        }
    }

    return(
        <motion.div style={{
            background:'linear-gradient(135deg, #743fd1, #3e84cf)',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            color:'white',
            margin:'10px',
            cursor:open? 'default':'pointer',
            position:'relative',
            zIndex:1
        }}
        initial={containerStyle.small}
        animate={open? containerStyle.expanded:containerStyle.small}
        
        >   
            <AnimatePresence>
                {
                open &&  
                    (register? <RegisterView setReg={setRegister} /> :
                    session? <LoggedIn currentUser={testuser} setSession={setSession} /> :
                    <SigninView setReg={setRegister} setSession={setSession} />)
                }

 
                {/* icons buttons */}
                {
                open? 
                // vvvvvvvvvvvvvvvvvvvvvvvvv
                <motion.div key='close-icon' style={{position:'absolute',top:15,left:30}}
                    initial={{opacity:0}}
                    animate={{opacity:1,transition:{delay:.5}}} 
                    exit={{opacity:0}}
                >
                    <IconButton 
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        <Close sx={{height:30, width:30,color:'primary.font'}} />
                    </IconButton>
                </motion.div>:
                // vvvvvvvvvvvvvvvvvvvvvvvvv
                <motion.div key='profile-icon' style={{position:'absolute'}}
                    initial={{opacity:0}}
                    animate={{opacity:1,transition:{delay:.5}}}
                    exit={{opacity:0}}
                >
                    <IconButton 
                        onClick={() => {
                            setOpen(true);
                        }}
                    >
                        <PersonOutline sx={{color:'primary.font'}} />
                    </IconButton>
                </motion.div>
                }
                
            </AnimatePresence>

        </motion.div>
    )
}







export default Signin;