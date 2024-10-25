import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, storage } from "../../../Firebase";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
export default function EditDrive() {
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [members, setMembers] = useState("");
  const [area, setArea] = useState("");
  const [availableSlots, setAvailableSlots] = useState("")
  const [location, setLocation] = useState("");
  const [file, setFile] = useState({});
  const [fileName, setFileName] = useState("");
  const [url, setUrl] = useState("");
  const [Loader, setLoader] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    getData();
  }, []);
  const [previousImage, setPreviousImage] = useState("");
  const getData = async () => {
    const driveRef = doc(db, "Drives", id);
    const driveDoc = await getDoc(driveRef);
    if (driveDoc.exists()) {
      let driveData = driveDoc.data();
      setDate(driveData.date);
      setTitle(driveData.title);
      setMembers(driveData.members);
      setArea(driveData.area);
      setAvailableSlots(driveData.availableSlots)
      setLocation(driveData.location);
      setPreviousImage(driveData.image);
    } else {
      toast.error("Data doesn't exist");
    }
  };

  const changeImage = (e) => {
    setFileName(e.target.value);
    setFile(e.target.files[0]);
  };
  const handleDrives = (e) => {
    e.preventDefault();
    setLoader(true);
    if (!fileName) {
      saveData();
    } else {
      const storageRef = ref(storage, "driveImages/" + fileName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(error);
          setLoader(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setUrl(downloadURL);
          });
        }
      );
    }
  };
  useEffect(() => {
    if (!!url) {
      saveData();
    }
  }, [url]);
  const nav = useNavigate();
  const saveData = async () => {
    try {
      let data = {
        date: date,
        title: title,
        members: members,
        area: area,
        availableSlots:members,
        location: location,
        status: true,
        createdAt: Timestamp.now(),
      };
      if (!!url) {
        data.image = url;
      }
      console.log(data);
      let productRef = doc(db, "Drives", id);
      await updateDoc(productRef, data);
      toast.success("Data updated");
      nav("/admin/managedrive");
    } catch (err) {
      toast.error("Something went wrong!!");
    } 
      setLoader(false);
  };
  if (Loader == true) {
    return (
      <>
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
      </>
    );
  } else {
    return (
      <>
        {/* Header Start */}
        <div className="container-fluid bg-breadcrumb">
          <div className="container text-center py-5" style={{ maxWidth: 900 }}>
            <h3 className="text-white display-3 mb-4">Edit Drive</h3>
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
                  <h1 className="text-center text-primary">Edit Drive</h1>
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
                          value={fileName}
                          onChange={changeImage}
                        />
                      </div>
                      <img
                        src={previousImage}
                        style={{ height: "100px", width: "100px" }}
                      />
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
                        />
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
                      <label>Available slots</label>
                    <div className="col-xl-12">
                      <input
                        type="number"
                        className="form-control bg-white border-0 py-3 px-4"
                        placeholder="Available slots"
                        value={availableSlots}
                        onChange={(event) => {
                          setAvailableSlots(event.target.value);
                        }}
                        required
                      />
                      <p id="mem" className="text-danger"></p>
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
                          Edit
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
  }
}
