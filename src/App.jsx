import { useEffect, useState } from "react";
import { UseMultistepForm } from "./components/UseMultistepForm";
import { UserForm } from "./components/UserForm";
import { ThankYouForm } from "./components/ThankYouForm";
import "../src/styles/App.css";
import { useAddHiddenInputs } from "./scripts/Hidden";
import axios from "axios";

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

  // Callback function to update data state
  const updateData = (newData) => {
    setData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  useAddHiddenInputs("my-form", updateData);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hash = urlParams.get("hash");
    if (hash) {
      setData((prevData) => ({
        ...prevData,
        clientHash: hash,
      }));
      next(); // Move to the next step if hash is present
    }
  }, []);

  function updateFields(fields) {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  }

  const { isFirstStep, step, isLastStep, next } = UseMultistepForm([
    <UserForm key={1} {...data} updateFields={updateFields} />,
    <ThankYouForm key={2} {...data} updateFields={updateFields} />,
  ]);

  function onSubmit(e) {
    e.preventDefault();

    if (isFirstStep) {
      const formData = { ...data };
      axios
        .post(
          "https://system.pewnylokal.pl/crm/api/newEndpoint.php?format=json",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setData((prevData) => ({
            ...prevData,
            clientHash: response.data.hash,
          }));
          console.log("Endpoint Success: ", response.data);
        })
        .catch((error) => {
          console.error("Endpoint Error: ", error);
        });
      next();
    } else if (!isLastStep) {
      next();
    }
  }

  return (
    <>
      <img
        src="audyt-dzialki-brand.svg"
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
