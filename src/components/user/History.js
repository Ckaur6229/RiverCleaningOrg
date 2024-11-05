import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../Firebase";
import moment from "moment";
import { BeatLoader } from 'react-spinners';


export default function History() {
  const [request, setRequest] = useState([]);
  const [Loader, setLoader] = useState(true)




  useEffect(() => {
    getAllRequests();
    setTimeout(()=>{
      setLoader(false)
    },2000)
  }, []);

  const getAllRequests = async () => {
    const userId = sessionStorage.getItem("userId");
    const Query = query(
      collection(db, "Requests"),
      orderBy("createdAt", "desc"),
      where("userId", "==", userId)
    );
    onSnapshot(Query, (doc) => {
      setRequest(
        doc.docs.map((elem, index) => {
          return { id: elem.id, data: elem.data() };
        })
      );
    });
  };
  const getDate = (date) => {
    let date1 = date?.toDate();
    return moment(date1).format("YYYY-MM-DD");
  };

  if(Loader===true){
    return(
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
            zIndex: 9999
          }}
        >
          <BeatLoader color="rgb(7, 137, 177)" loading={Loader} size={20} />
        </div>
      </>
    )
  }
  else{
  return (
    <>
      {/* Header Start */}
      <div className="container-fluid bg-breadcrumb">
        <div className="container text-center py-5" style={{ maxWidth: 900 }}>
          <h3 className="text-white display-3 mb-4">Your History</h3>
          <p className="fs-5 text-white mb-4">
            Let's make the rivers pure and beautiful!
          </p>
        </div>
      </div>
      {/* Header End */}
      <div className="container my-5">
        {request.length === 0 ? (
          <div className="text-center">
            <h1>No Data Available</h1>
          </div>
        ) : (
          <div className="row my-5 ">
            {request?.map((current, index) => (
             
              <div
                className="col-lg-6 col-md-6 col-sm-9 col-11 mx-auto"
                key={index}
              >
                <div
                  className="card my-2"
                  style={{ boxShadow: "5px 5px 5px", borderRadius: "8px" }}
                >
                  <div className="card-body">
                    <div class="row text-center">
                    <div class="col-lg-3 text-center">
                    <img src={current?.data?.image} width="130px" height="130px" />
                      </div>
                      <div class="col-sm-7 col-lg-9 col-md-12">
                        <div className="row pt-2">
                        <h3 className="card-title text-primary text-center">
                      {current?.data?.driveTitle} ( {current?.data?.location} )
                    </h3>
                        </div>
                        <div class="row">
                          <div class="col">Drive Date - {current?.data?.driveDate}</div>
                        </div>
                        <div class="row">
                          <div class="col">Applied Date - {getDate(current?.data?.createdAt)}</div>
                        </div>
                        <div class="row pt-2">
                          <h4 class="col"> 
                      {current?.data?.status == 2 ? (
                        <span className="text-success">Request Appoved</span>
                      ) : current.data.status == 3 ? (
                        <span className="text-danger">Request Declined</span>
                      ) : (
                        "Pending Request"
                      )}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
}
