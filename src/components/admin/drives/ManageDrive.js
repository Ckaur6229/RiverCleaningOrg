import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../Firebase";
import moment from "moment";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";
export default function ManageDrive() {
  const [Drives, setDrives] = useState([]);
  const [Loader, setLoader] = useState(false)
  const getAllDrives = async () => {
    const Query = query(collection(db, "Drives"), orderBy("createdAt", "desc"));
    onSnapshot(Query, (doc) => {
      setDrives(
        doc.docs.map((elem, index) => {
          return { id: elem.id, data: elem.data() };
        })
      );
    });
  };

  useEffect(() => {
    setLoader(true)
    getAllDrives();
    setTimeout(()=>{
      setLoader(false)
    },1000)
  }, []);

  const getDate = (date) => {
    let date1 = date?.toDate();
    return moment(date1).format("MMMM Do, YYYY");
  };
  const updateStatus = async (id, status) => {
    if(status==true){
      if(window.confirm("Do you want to enable the cleaning drive")){
        try {
          const docRef = doc(db, "Drives", id);
          let data = {
            status: status,
          };
          await updateDoc(docRef, data);
          toast.success("Status updated");
        } catch (err) {
          console.log(err);
          toast.error("Internal server error");
        }
      }
    }
    else{
      if(window.confirm("Do you want to disable the cleaning drive")){
        try {
          const docRef = doc(db, "Drives", id);
          let data = {
            status: status,
          };
          await updateDoc(docRef, data);
          toast.success("Status updated");
        } catch (err) {
          console.log(err);
          toast.error("Internal server error");
        }
      }
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
  } else {
  return (
    <>
      {/* Header Start */}
      <div className="container-fluid bg-breadcrumb">
        <div className="container text-center py-5" style={{ maxWidth: 900 }}>
          <h3 className="text-white display-3 mb-4">Manage Drives</h3>
          <p className="fs-5 text-white mb-4">
            Let's make the rivers pure and beautiful!
          </p>
        </div>
      </div>
      {/* Header End */}
      <div className="container-fluid my-5 table-responsive">
      {Drives.length===0?
      (<div className='text-center'>
        <h1>No Data Available</h1>
      </div>):
         (
        <table className="table table-custom">
          <thead style={{ textAlign: "center" }}>
            <tr>
              <th scope="col">S no.</th>
              <th scope="col">Date</th>
              <th scope="col">Title</th>
              <th scope="col">Image</th>
              <th scope="col">Members</th>
              <th scope="col">Area</th>
              <th scope="col">Available Slots</th>
              <th scope="col">Location</th>
              <th scope="col">Status</th>
              <th scope="col">CreatedAt</th>
              <th scope="col">Edit</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {Drives.map((current, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{current?.data?.date}</td>
                <td>{current?.data?.title}</td>
                <td>
                  <img src={current?.data?.image} width="70px" height="70px" />
                </td>
                <td>{current?.data?.members}</td>
                <td>{current?.data?.area}</td>
                <td>{current?.data?.availableSlots}</td>
                <td>{current?.data?.location}</td>
                <td>{current?.data?.status?.toString()}</td>
                <td>{getDate(current?.data?.createdAt)}</td>
                <td>
                  <Link
                    to={"/admin/editdrive/" + current.id}
                    className="btn btn-outline-primary me-2 d-flex align-items-center justify-content-center"
                    style={{ height: "100%" }}
                  >
                    <i className="fa fa-edit"></i>
                  </Link>
                </td>

                <td>
                  {current?.data?.status == true ? (
                    <button
                      className="enableDisable btn btn-primary btn-sm me-2 text-white rounded"
                      onClick={() => {
                        updateStatus(current.id, false);
                      }}
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      className="btn btn-danger btn-sm me-2 text-white rounded"
                      onClick={() => {
                        updateStatus(current.id, true);
                      }}
                    >
                      Enable
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
         )}
      </div>
    </>
  );
}}
