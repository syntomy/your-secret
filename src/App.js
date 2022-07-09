import "./App.css";
import { supabase } from "./supabaseClient";
import React, { useState } from "react";
import ReactLoading from "react-loading";
import ReCAPTCHA from "react-google-recaptcha";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    console.log("Submitting..");
    if (secret.length > 3 && secret.length < 500) {
      console.log("Verifying captcha...");
      setLoading(true);
      const results = await verifyCaptcha(recaptcha);
      if (results === false || results === undefined || results === null) {
        toast.error("Captcha is invalid!");
        setLoading(false);
        return;
      };
      const { error } = await supabase.from("secrets").insert([
        {
          content: secret
        }
      ]);
      if (error) {
        console.log("Something went wrong: " + error.message);
        toast.error("Something went wrong with submitting your secret!");
        setLoading(false);
      }
      else {
        toast.success("Successfully submitted your secret!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        console.log("Submitted the secret: " + secret);
      };
    }
    else {
      toast.error("You can only send a secret that's more than 3 letters and less than 500");
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
          <button className="action-button" onClick={submitSecret}>Send your message</button>
          <ReCAPTCHA
            sitekey="6Lc2VtYgAAAAAIoV5XGzIZq3T5OOnCkrUO0FXTbL"
            onChange={(value) => setRecaptcha(value)}
          />
          <div className="discord-stuff">
            <div className="discord-tag">❤️ syntomy#0007 ❤️</div> | <a href="https://discord.gg/e63S7U9ans" target="_blank">💙 Discord Server 💙</a>
          </div>
        </>}
        <ToastContainer
          position="bottom-left"
        />
    </div>
  );
}

export default App;