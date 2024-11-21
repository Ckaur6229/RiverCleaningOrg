import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../../Firebase';
import moment from 'moment';
import { BeatLoader } from 'react-spinners';

export default function ViewEnquiry() {
  const [Enquiry, setEnquiry] = useState([]);
  const [Loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    getAllEnqueries();
  }, []);

  const getAllEnqueries = async () => {
    const Query = query(collection(db, "Enquiry"), orderBy("createdAt", "desc"));
    onSnapshot(Query, doc => {
      setEnquiry(
        doc.docs.map((elem, index) => {
          return { id: elem.id, data: elem.data() };
        })
      );
      setTimeout(()=>{
        setLoader(false); 
      },1000)
    });
  };

  const getDate = (date) => {
    let date1 = date?.toDate();
    return moment(date1).format("MMMM Do, YYYY");
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
            <h3 className="text-white display-3 mb-4">User Enquiries</h3>
            <p className="fs-5 text-white mb-4">
              Let's make the rivers pure and beautiful!
            </p>
          </div>
        </div>
        {/* Header End */}
        <div className="container my-5 table-responsive">
          {Enquiry.length === 0 ? (
            <div className="text-center">
              <h1>No Data Available</h1>
            </div>
          ) : (
            <table className="table table-custom">
              <thead style={{ textAlign: "center" }}>
                <tr>
                  <th scope="col">S no.</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Subject</th>
                  <th scope="col">Message</th>
                  <th scope="col">Status</th>
                  <th scope="col">CreatedAt</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody style={{ textAlign: "center" }}>
                {Enquiry?.map((current, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{current?.data?.name}</td>
                    <td>{current?.data?.email}</td>
                    <td>{current?.data?.subject}</td>
                    <td>{current?.data?.message}</td>
                    <td>{current?.data?.status?.toString()}</td>
                    <td>{getDate(current?.data?.createdAt)}</td>
                    <td>
                      <a
                        href={`mailto:${current?.data?.email}`}
                        className="btn btn-primary btn-sm me-2 text-white rounded"
                      >
                        Reply
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </>
    );
  }
}
