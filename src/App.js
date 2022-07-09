import "./App.css";
import { supabase } from "./supabaseClient";
import React, { useState } from "react";
import ReactLoading from "react-loading";
import ReCAPTCHA from "react-google-recaptcha";

const verifyCaptcha = async (value) => {
  const verifierPath = "https://your-secrets-recaptcha-verification-system.glitch.me/";
  return await fetch(verifierPath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      captchaValue: value
    })
  }).then(async (res) => {
    const results = await res.json();
    if (results !== undefined) {
      return results;
    }
    else {
      return false;
    };
  });
};

function App() {
  const [secret, setSecret] = useState("");
  const [recaptcha, setRecaptcha] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitSecret = async (e) => {
    console.log("Verifying captcha...");
    setLoading(true);
    const results = await verifyCaptcha(recaptcha);
    if (results === false || results === undefined || results === null) {
      alert("Captcha is invalid retry again!");
      setLoading(false);
      return;
    };

    console.log("Submitting..");
    if (secret.length > 3 && secret.length < 500) {
      setLoading(true);
      const { error } = await supabase.from("secrets").insert([
        {
          content: secret
        }
      ]);
      if (error) {
        console.log("Something went wrong: " + error.message);
        alert("Something went wrong with submitting your secret!");
        setLoading(false);
      }
      else {
        alert("Successfully submitted your secret!");
        console.log("Submitted the secret: " + secret);
        window.location.reload();
      };
    }
    else {
      alert("Sorry! The secret can only be more than 3 characters and less than 500 characters");
      setLoading(false);
      console.log("Invalid entry");
    }
  };

  return (
    <div className="app">
      {loading ?
        <ReactLoading type="balls" color="#FF1E56" />
        :
        <>
          <div className="typography">
            <h1>Your <span className="header-emphasis">Secret</span></h1>
            <p>Everything you say here is sent anonymously and only <span className="name-emphasis">syntomy</span> can read it</p>
          </div>
          <textarea id="secret-input" placeholder="What do you want to say to syntomy..." value={secret} onChange={(e) => setSecret(e.target.value)}></textarea>
          <ReCAPTCHA
            sitekey="6Lc2VtYgAAAAAIoV5XGzIZq3T5OOnCkrUO0FXTbL"
            onChange={(value) => setRecaptcha(value)}
          />
          <button className="action-button" onClick={submitSecret}>Send your message</button>
        </>}
    </div>
  );
}

export default App;