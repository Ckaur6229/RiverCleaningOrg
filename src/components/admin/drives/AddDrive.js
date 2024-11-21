import { addDoc, collection, doc, Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db, storage } from "../../../Firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { BeatLoader } from "react-spinners";

export default function Drive() {
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [members, setMembers] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState({});
  const [fileName, setFileName] = useState("");
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [Loader, setLoader] = useState(true)
  const changeImage=(e)=>{
    setFileName(e.target.value)
    setFile(e.target.files[0])
}


useEffect(() => {
  setTimeout(() => {
    setLoader(false);
  }, 2000);
}, []); 

const handleDrives = (e) => {
  e.preventDefault();
  setLoader(true); // Start loader when form is submitted

  if (members <= 0) {
    document.getElementById("mem").innerText = "Invalid value";
    setLoader(false); // Stop loader if validation fails
    return;
  } else {
    document.getElementById("mem").innerText = "";
  }

  if (!fileName) {
    toast.error("Please upload image");
    setLoader(false); // Stop loader if no image is uploaded
    return;
  }

  const storageRef = ref(storage, "driveImages/" + fileName);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      setProgress(progress);
    },
    (error) => {
      console.log(error);
      setLoader(false); // Stop loader if upload fails
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
        setUrl(downloadURL);
      });
    }
  );
};

useEffect(() => {
  if (!!url) {
    saveData();
  }
}, [url]);

const saveData = async () => {
  try {
    let data = {
      date: date,
      title: title,
      members: members,
      area: area,
      availableSlots: members,
      location: location,
      status: true,
      createdAt: Timestamp.now(),
      image: url,
    };

    await addDoc(collection(db, "Drives"), data);
    toast.success("Drive created successfully");
    setArea("");
    setDate("");
    setLocation("");
    setMembers("");
    setTitle("");
    setFile({});
    setFileName("");
    setUrl("");

    setLoader(false); // Stop loader after successful save
  } catch (err) {
    toast.error(err.message);
    setLoader(false); // Stop loader if an error occurs during save
  }
};

if (Loader) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <BeatLoader color="rgb(7, 137, 177)" loading={Loader} size={20} />
    </div>
  );
}

  else{
  return (
    <>
      {/* Header Start */}
      <div className="container-fluid bg-breadcrumb">
        <div className="container text-center py-5" style={{ maxWidth: 900 }}>
          <h3 className="text-white display-3 mb-4">Cleaning Drives</h3>
          <p className="fs-5 text-white mb-4">
            Let's make the rivers pure and beautiful!
          </p>
        </div>
      </div>
      {/* Header End */}
      <div className="container-fluid bg-light py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-xl-8">
              <div className="form p-5">
                <h1 className="text-center text-primary">Create Drive</h1>
                <form onSubmit={handleDrives}>
                  <div className="row gx-4 gy-3">
                    <label>Date</label>
                    <div className="col-xl-12">
                      <input
                        type="date"
                        className="form-control bg-white border-0 py-3 px-4"
                        placeholder="date"
                        value={date}
                        onChange={(event) => {
                          setDate(event.target.value);
                        }}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <label>Title</label>
                    <div className="col-xl-12">
                      <input
                        type="text"
                        className="form-control bg-white border-0 py-3 px-4"
                        placeholder="title"
                        value={title}
                        onChange={(event) => {
                          setTitle(event.target.value);
                        }}
                        required
                      />
                    </div>
                    <label>Image</label>
                    <div className="col-xl-12">
                      <input
                        type="file"
                        className="form-control bg-white border-0 py-3 px-4"
                        // value={fileName}
                        onChange={changeImage}
                      />
                      {/* <p>{progress}</p> */}
                    </div>
                    <label>Memebers</label>
                    <div className="col-xl-12">
                      <input
                        type="number"
                        className="form-control bg-white border-0 py-3 px-4"
                        placeholder="memebers"
                        value={members}
                        onChange={(event) => {
                          setMembers(event.target.value);
                        }}
                        required
                        min={1}
                      />
                      <p id="mem" className="text-danger"></p>
                    </div>
                    <label>Area</label>
                    <div className="col-xl-12">
                      <input
                        type="text"
                        className="form-control bg-white border-0 py-3 px-4"
                        placeholder="area"
                        value={area}
                        onChange={(event) => {
                          setArea(event.target.value);
                        }}
                        required
                      />
                    </div>
                    <label>Location</label>
                    <div className="col-xl-12">
                      <input
                        type="text"
                        className="form-control bg-white border-0 py-3 px-4"
                        placeholder="location"
                        value={location}
                        onChange={(event) => {
                          setLocation(event.target.value);
                        }}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <button
                        className="btn-hover-bg btn btn-primary w-100 text-light py-3 px-5"
                        type="submit"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}}
