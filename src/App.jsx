import React, { useState, useEffect, useContext } from "react";
import "./views/style/dashboard.css";
import Loader from "./components/Loader";
import MainService from "./services/main-service";
import { useNavigate } from "react-router-dom";
import { UserStateContext } from "./context/UserContext";

function App() {
  const [pageLoading, setPageLoading] = useState(false);
  const [applicationList, setApplicationList] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const navigate = useNavigate();
  const { setApplicationId } = useContext(UserStateContext);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setPageLoading(true);
    try {
      const { data } = await MainService.getAllApplications();
      setAllApplications(data.items);
      const temp = data.items.map((ele) => {
        ele.text = ele.name;
        ele.value = ele._id;
        ele.image = ele.logo;
        ele.logo = ele.image && ele.image.secure_url;
        return ele;
      });
      setApplicationList(temp);
      setPageLoading(false);
    } catch (e) {
      setPageLoading(false);
    }
  };

  const clickApplication = async (id) => {
    console.log("🚀 -----------🚀")
    console.log("🚀 ~ id:", id)
    console.log("🚀 -----------🚀")
    setApplicationId(id);
    navigate(`/auth`);
  }

  return (
    <>
      {pageLoading ? (
        <Loader />
      ) : (

        <div className="m-5">
          <div className="application-container p-12 mt-6 relative">
            <h1 className="font-semibold text-[38px] mb-3" style={{ textAlign: "center" }}>Select Application</h1>

            <div className="grid grid-cols-4 gap-6">
              {applicationList.map((application, index) => (
                <div
                  className="border border-[#e4e5e6] p-6 rounded-xl cursor-pointer"
                  key={index}
                  onClick={() => clickApplication(application._id)}
                >
                  <div className="text-center">
                    <img
                      className="max-w-100 mx-auto"
                      src={application.logo ? application.logo : "https://platform.fynd.com/public/admin/assets/pngs/fynd-store.png"}
                      alt="logo"
                    />
                    <h2 className="line-1 font-semibold text-xl">{application.name}</h2>
                    <p className="text-sm font-normal">{application.domain.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
