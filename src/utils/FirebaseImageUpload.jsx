import React, { useEffect, useState } from "react";

import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

import { imageDb } from './Config';

function FirebaseImageUpload(){
    const [img,setImg] =useState('')
    const [imgUrl,setImgUrl] =useState([])

    const handleClick = () =>{
     if(img !==null){
        const imgRef =  ref(imageDb,`files/${v4()}`)
        uploadBytes(imgRef,img).then(value=>{
            console.log(value)
            getDownloadURL(value.ref).then(url=>{
                setImgUrl(data=>[...data,url])
            })
        })
     }
    }

    useEffect(()=>{
        listAll(ref(imageDb,"files")).then(imgs=>{
            console.log(imgs)
            imgs.items.forEach(val=>{
                getDownloadURL(val).then(url=>{
                    setImgUrl(data=>[...data,url])
                })
            })
        })
    },[])


    return (
        <>
            <input type="file" onChange={(e) => setImg(e.target.files[0])} />
            <button type="button" onClick={handleClick}>Upload</button>
            <br />
            {imgUrl.map(dataVal => (
                <div key={dataVal}>
                    <img src={dataVal} height="200px" width="200px" alt="uploaded" />
                    <br />
                </div>
            ))}
        </>
    );
}
export default FirebaseImageUpload;