import React, { useEffect, useState } from "react";
import { addDoc, collection, doc, getCountFromServer, onSnapshot, orderBy, query, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function ViewDrives() {
  const [Drives, setDrives] = useState([]);
  const [Loader, setLoader] = useState(false);

  const getAllDrives = () => {
    setLoader(true);

    const Query = query(collection(db, "Drives"), orderBy("createdAt", "desc"));
    onSnapshot(Query, (doc) => {
        const today = new Date().toISOString().split("T")[0]; 
        const filteredDrives = doc.docs
          .filter(
            (elem) => elem.data().status === true && elem.data().date >= today
          )
          .map((elem) => ({ id: elem.id, data: elem.data() }));
        setDrives(filteredDrives)
    }, (error) => {
      console.error("Error fetching drives:", error);

        setLoader(false)
      }
  );
      setLoader(false)
      
  };

  useEffect(() => {
    getAllDrives();
  }, []);
  const nav=useNavigate()
  const participate=async(id, title, date,Slots, location,image)=>{
    setLoader(true)
    let userId=sessionStorage.getItem("userId")
    let email=sessionStorage.getItem("email")
    let name=sessionStorage.getItem("name")
    // const docRef = doc(db, "Drives", id);
    //     let data = {
    //       availableSlots: Slots >= 0 ? Slots-1 : 0,
    //     };
    //     await updateDoc(docRef, data);
    if(!userId){
      toast.error("Please login")
      nav("/login")
    }else{
      try{
        let data={
          driveId:id,
          driveTitle:title,
          driveDate:date,
          availableSlots:Slots,
          location:location,
          image:image,
          userId:userId,
          userEmail:email,
          userName:name,
          status:1,
          createdAt:Timestamp.now()
        }
        await addDoc(collection(db, "Requests"), data);
        toast.success("Request is sent!")
      }catch(err){
         toast.error(err.message)
          setLoader(false)
        
    }
     
    }
    setTimeout(()=>{
      setLoader(false)
    },1000)
    
  }
  return (
    <>
      {/* Header Start */}
      <div className="container-fluid bg-breadcrumb">
        <div className="container text-center py-5" style={{ maxWidth: 900 }}>
          <h3 className="text-white display-3 mb-4">
            Upcoming Cleaning Drives
          </h3>
          <p className="fs-5 text-white mb-4">
            Let's make the rivers pure and beautiful!
          </p>
        </div>
      </div>
      {/* Header End */}

      {Loader ? (
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
      ) : (
        <div className="container">
          {
            Drives.length<=0?(
              <h2 className="text-center my-4">No data available</h2>
            ):(
              <div className="row my-5 text-center">
              {Drives?.map((current, index) => (
                <div
                  className="col-lg-4 col-md-6 col-sm-9 col-11 mx-auto"
                  key={index}
                >
                  <div
                    className="card my-2"
                    style={{ boxShadow: "5px 5px 5px", borderRadius: "8px" }}
                  >
                    <img
                      src={current?.data?.image}
                      className="card-img-top"
                      style={{ borderRadius: "8px" }}
                      height="200px"
                    />
                    <div className="card-body">
                      <h5 className="card-title text-primary ">
                        {current?.data?.title}
                      </h5>
                      <p className="card-text ">Date : {current?.data?.date}</p>
                      <p className="card-text">
                        Members Required : {current?.data?.members}
                      </p>
                      <p className="card-text">
                        Area Occupied : {current?.data?.area}
                      </p>
                      <p className="card-text">
                        Available Slots : {current?.data?.availableSlots}
                      </p>
                      <p className="card-text">
                        Location : {current?.data?.location}
                      </p>
                    </div>
                    <div>
                      <a
                        onClick={()=>{participate(current?.id, current?.data?.title, current?.data?.date, current?.data?.availableSlots,current?.data?.location, current?.data?.image)}}
                        className="btn btn-primary btn-sm mx-5 mb-2 text-white rounded"
                      >
                        Participate
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )
          }
        </div>
      )}
    </>
  );
}
