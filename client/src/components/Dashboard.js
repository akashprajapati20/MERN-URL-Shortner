import React, { useContext, useEffect ,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { LoginContext } from './contextProvider/Context';


const Dashboard = () => {

  const { logindata, setLoginData } = useContext(LoginContext);
  
  // console.log(logindata);

  const [data, setData] = useState(false);
  const [newURL,setnewURL]=useState("enter the link to get the short url");
  const [inpval, setInpval] = useState({
    oldurl: "",
    shortId: ""
    
});
  const [ana, setAba] = useState(0);
const setVal=(e)=>{
    const {name,value}=e.target;
    setInpval(() => {
        return {
            ...inpval,
            [name]: value
        }})
}
const getAnalytics=async (e)=>{
    e.preventDefault();
    const { shortId} = inpval;
    const data = await fetch(`http://127.0.0.1:8001/url/analytics/${shortId}`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json"
        }
    });
    const res=await data.json();
    setAba(res.totalClicks);
}
const getNewURL = async (e) => {
    e.preventDefault();

    const { oldurl} = inpval;
    
    const data = await fetch("http://127.0.0.1:8001/url",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            url:oldurl 
        })
    });
    
    const res=await data.json();
    
    //  console.log(res.shortID);
    setnewURL("http://127.0.0.1:8001/"+res.id);
}
  const history = useNavigate();

  const DashboardValid = async () => {
      let token = localStorage.getItem("usersdatatoken");

      const res = await fetch("/validuser", {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": token
          }
      });
      console.log("here print")
      const data = await res.json();
      // console.log(data)
      if (data.status === 401 || !data) {
          history("*");
      } else {
          console.log("user verify");
          setLoginData(data)
          history("/dash");
      }
  }

    useEffect(() => {
      setTimeout(() => {
          DashboardValid();
          setData(true)
      }, 2000)
}, [])

  return (
    <>
      
     
            {
                data ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <img src="https://cdn.pixabay.com/photo/2016/08/31/11/54/icon-1633249_1280.png" style={{ width: "200px", marginTop: 20 }} alt="" />
                    <h1>URL Shortner</h1>
                    <div className='input '   >
                        <input type="text" name="oldurl" id="oldurl" value={inpval.oldurl} onChange={setVal} style={{ borderRadius:"50px" ,width: "500px" }}/>
                        <button type="submit" onClick={getNewURL} style={{ borderRadius:"50px" , marginLeft:"5px" }}>Submit</button>
                    </div>
                    <div className="newURL " style={{ marginTop: "40px"}}>
                      {newURL}
                    </div>
                    <div className="analytics" style={{ marginTop: "40px"}}>
                        To view analytics enter the short ID: 
                        <input type="text" name="shortId" id="shortId" value={inpval.shortId} onChange={setVal} style={{marginLeft:"10px", borderRadius:"50px" ,width: "300px" }}/>
                        <button type="submit" onClick={getAnalytics} style={{ borderRadius:"50px" , marginLeft:"5px" }}>Submit</button>
                    </div>
                    <div className="analyticsbox" style={{ marginTop: "40px"}}>
                        Total clicks:{ana}
                       
                    </div>
                </div> : <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    Loading... &nbsp;
                    <CircularProgress />
                </Box>
            }

    </>
  )
}

export default Dashboard
