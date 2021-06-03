import React,{useState} from 'react'
import Button from '@material-ui/core/Button'
import {db, storage} from "./firebase"
import firebase from 'firebase';
import './imageUpload.css'


function ImageUpload({username}) {
    const [caption, setCaption] = useState("");
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);

    const handleChange=(e)=>{
        if (e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes)* 100
                );
                setProgress(progress);   
            },
            (error) => {
                // Error function ...
                console.log(error);
                alert(error.message);
            },
            () => {
                // completion function
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // posting the image on db ...
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        })
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
            }
        )
    }
    return (
        <div className="image_Upload">
            <progress className="progress" value={progress} max="100"/>
            <br />
            <input type="text" placeholder="Enter a Caption...." value={caption} onChange={(e)=>setCaption(e.target.value)}/>
            <br />
            <input type="file" onChange={handleChange}/>
            <br />
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
