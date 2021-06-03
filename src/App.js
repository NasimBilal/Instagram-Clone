import './App.css';
import Post from './post'
import React, {useState, useEffect} from 'react';
import {db, auth} from './firebase'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './imageUpload'

function getModalStyle() {
  const top = 50;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [post, setpost] = useState([]);
  const [open, setopen] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [username, setusername] = useState("");
  const [user, setUser] = useState(null);
  const [opensignin, setOpensignin] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if (authUser) {
        // user has logged in..
        console.log(authUser);
        setUser(authUser);
       if (authUser.displayName) {
        // dont update username
      }else {
        // if we just created someone...
        return authUser.updateProfile({
          displayName: username,
        });
      }
    } else{
      // user has logged out...
      setUser(null);
    }  
  })
  
  return ()=>{
    // perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  const SignUp =(e)=>{
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error)=> alert(error.message));
    setopen(false);
  }
  
  const signin=(e)=>{
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((error)=>alert(error.message));
    setOpensignin(false);
  }

  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot=>{
      setpost(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, []);
  return (
    <div classNasme="App">

      <Modal
        open={open}
        onClose={()=>setopen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <div className="app_header">
                <img src="https://pngimage.net/wp-content/uploads/2018/06/font-instagram-png-2.png" alt="" className="app_header_image" />
              </div>
            </center>
              <Input placeholder="username" type="text" value={username} onChange={(e)=>setusername(e.target.value)}/>
              <Input placeholder="Email" type="text" onChange={(e)=>setemail(e.target.value)} value={email} />
              <Input placeholder="Password" type="password" onChange={(e)=>setpassword(e.target.value)} value={password} />
              <Button onClick={SignUp}>SIGN IN</Button>
          </form>
        </div>
      </Modal>
      
      <Modal
        open={opensignin}
        onClose={()=>setOpensignin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <div className="app_header">
                <img src="https://pngimage.net/wp-content/uploads/2018/06/font-instagram-png-2.png" alt="" className="app_header_image" />
              </div>
            </center>
              <Input placeholder="Email" type="text" onChange={(e)=>setemail(e.target.value)} value={email} />
              <Input placeholder="Password" type="password" onChange={(e)=>setpassword(e.target.value)} value={password} />
              <Button onClick={signin}>SignIn</Button>
          </form>
        </div>
      </Modal>
      
      <div className="app_header">
        <img src="https://pngimage.net/wp-content/uploads/2018/06/font-instagram-png-2.png" alt="" className="app_header_image" />
        { user? ( <div className="logout"><Button onClick={()=> auth.signOut()}>Log Out</Button></div>
          )
          : (<div className="app_login_container">
            <Button onClick={()=>setOpensignin(true)}>Sign In</Button> 
            <Button onClick={()=>setopen(true)}>Sign Up</Button>  
            </div>
          )}
      </div>
      { user?.displayName?  (
          <ImageUpload username={user.displayName}/>
          ):
          (
            <h3>Sorry you need to Login </h3>
        )}
      <div className="app_post_container">
          {
          post.map(({id, post})=>(
            <Post username={post.username} user={user} postId={id} key={id} caption={post.caption} imageUrl={post.imageUrl} />
          ))
          }
      </div>  
 
    </div>
  );
}

export default App;
