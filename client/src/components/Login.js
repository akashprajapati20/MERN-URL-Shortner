import React, { useState } from 'react'
import { NavLink ,useNavigate} from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import "./mix.css"
const Login = () => {
  const [showpass,setShowpass]=useState(false);
  const [passShow, setPassShow] = useState(false);

    const [inpval, setInpval] = useState({
        email: "",
        password: "",
    });
    const history =useNavigate();
    
    const setVal = (e) => {
      // console.log(e.target.value);
      const { name, value } = e.target;

      setInpval(() => {
          return {
              ...inpval,
              [name]: value
          }
      })
  };


  const loginuser = async(e) => {
      e.preventDefault();

      const { email, password } = inpval;

      if (email === "") {
          toast.error("email is required!", {
              position: "top-center"
          });
      } else if (!email.includes("@")) {
          toast.warning("includes @ in your email!", {
              position: "top-center"
          });
      } else if (password === "") {
          toast.error("password is required!", {
              position: "top-center"
          });
      } else if (password.length < 6) {
          toast.error("password must be 6 char!", {
              position: "top-center"
          });
      } else {
          // console.log("user login succesfully done");
          const data = await fetch("http://localhost:8001/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email, password
            })
        });
        const res=await data.json();
        console.log(res);

        if (res.status === 201) {
            // toast.success("Registration Successfully done 😃!", {
            //     position: "top-center"
            // });
            localStorage.setItem("usersdatatoken",res.result.token);
            setInpval({ ...inpval, email: "", password: "" });
            history("/dash");
        }
      }}
  return (
    <>
      <section>
        <div className="form_data">
            <div className="form_heading">
                <h1>Welcome Back,login</h1>
                <p>We are glad to see you back</p>
            </div>
        

        <form >
         <div className="form_input">
          <label htmlFor="email">Email</label>
          <input type="email" name='email' value={inpval.email} onChange={setVal} id='email' placeholder='Enter your email' />
         </div>

         <div className="form_input">
          <label htmlFor="password">Password</label>
          <div className="two">

          <input type={!showpass?"password":"text"} name='password' onChange={setVal} value={inpval.password} id='password' placeholder='Enter your password' />
          <div className="showpass" onClick={()=>{setShowpass(!showpass)}}>
            {showpass?"Hide":"show"}
          </div>
          </div>
         </div>
          <button className="btn"onClick={loginuser}>Login</button>
          <p>Don't have an account? <NavLink to="/register">  Sign up</NavLink></p>
        </form>
        </div>
      </section>
    </>
  )
}

export default Login
