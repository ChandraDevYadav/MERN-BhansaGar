import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(onSubmitHandler);
  };

  return (
    <div className="reset-password">
      <h2>Enter New Password</h2>
      <form onSubmit={onSubmitHandler}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
