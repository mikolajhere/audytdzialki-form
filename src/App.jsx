import { useState } from "react";
import { UseMultistepForm } from "./components/UseMultistepForm";
import { UserForm } from "./components/UserForm";
import { ThankYouForm } from "./components/ThankYouForm";
import "../src/styles/App.css";
import { useAddHiddenInputs } from "./scripts/Hidden";

const INITIAL_DATA = {
  dataLog: "",
  dataPhone: "",
  dataEmailTemplate: "audytdzialki.pl.php",
  dataSMSTemplate: "audytdzialki.pl.php",
  "dataValues[serviceDataType]": 344,
  "dataValues[serviceClientChannel]": 39,
  "dataValues[serviceDataAddressCityText]": "",
  "dataValues[serviceDataAddress]": "",
  "dataValues[serviceDataCity]": "",
  "dataValues[serviceDataArea]": "",
  "dataValues[serviceHomeType]": "",
  "dataValues[serviceDataServiceDate]": "",
  dataUpdateEmail: "",
  docs: "",
  submit: 1,
  tips: "",
  street: "",
};

export const App = () => {
  const [data, setData] = useState(INITIAL_DATA);

  useAddHiddenInputs("my-form", []);

  const hiddensObj = {};

  setTimeout(() => {
    const hiddens = document.querySelectorAll("input[type='hidden']");
    hiddens.forEach((hidden) => {
      hiddensObj[hidden.name] = hidden.value;
    });
  }, 1);

  function updateFields(fields) {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  }

  const { isFirstStep, step, isSecondStep, isLastStep, next } =
    UseMultistepForm([
      <UserForm {...data} updateFields={updateFields} />,
      <ThankYouForm {...data} updateFields={updateFields} />,
    ]);

  function onSubmit(e) {
    e.preventDefault();

    if (isFirstStep) {
      const formData = { ...data, ...hiddensObj };
      console.log({ formData });
      fetch(
        "https://system.pewnylokal.pl/crm/api/newEndpoint.php?format=json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setData({
            clientHash: data.hash,
            submit: 1,
            dataEmailTemplate: "audytdzialki.pl.php",
          });
          console.log("Endpoint Success: ", data);
          gtag("event", "conversion", {
            send_to: "AW-303136934/fX6FCObqqbMDEKaBxpAB",
          });
        })
        .catch((error) => {
          console.error("Endpoint Error: ", error);
        });
      next();
      setData({
        dataEmailTemplate: "audytdzialki.pl.php",
        clientHash: data.clientHash,
        submit: 1,
      });
    } else if (!isLastStep) {
      console.log(data);
      fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          response.json();
        })
        .then((data) => {
          console.log("UpdateClientData Success: ", data);
        })
        .catch((error) => {
          console.error("UpdateClientData Error: ", error);
        });
      next();
      setData({
        dataEmailTemplate: "audytdzialki.pl.php",
        clientHash: data.clientHash,
        submit: 1,
      });
    }
  }

  return (
    <>
      <img
        src="/img/audyt-dzialki-brand.svg"
        height={30}
        className="logo"
        alt="logo"
        draggable={false}
      />
      <div className="form-container">
        <div className="tito-header">
          <h1>Formularz zgłoszeniowy</h1>
        </div>
        <form onSubmit={onSubmit} id="my-form">
          {step}
          {isLastStep ? (
            <></>
          ) : (
            <div className="tito-container">
              <button className="btn-main" type="submit">
                Wyślij
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

// test