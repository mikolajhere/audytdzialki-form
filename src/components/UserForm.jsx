/* eslint-disable react/prop-types */
import { FormWrapper } from "./FormWrapper";

export function UserForm({
  dataPhone,
  serviceDataAddressCity,
  updateFields,
  dataEmail,
}) {
  return (
    <FormWrapper title="Dane kontaktowe">
      <div className="tito-container">
        <label className="tito-label" htmlFor="phone">
          {" "}
          Telefon *
        </label>
        <input
          className="tito-input"
          type="tel"
          name="dataPhone"
          placeholder="512 456 789"
          id="phone"
          required
          minLength={9}
          maxLength={14}
          value={dataPhone}
          onChange={(e) => updateFields({ dataPhone: e.target.value })}
        />
      </div>
      <div className="tito-container">
        <label className="tito-label" htmlFor="city">
          {" "}
          Miejscowość
        </label>
        <input
          className="tito-input"
          type="text"
          id="city"
          name="dataValues[serviceDataAddressCity]"
          placeholder="Kołbiel"
          value={serviceDataAddressCity}
          onChange={(e) =>
            updateFields({ serviceDataAddressCity: e.target.value })
          }
        />
      </div>
      <div className="tito-container">
        <label className="tito-label" htmlFor="email">
          {" "}
          E-mail
        </label>
        <input
          id="email"
          className="tito-input"
          type="text"
          name="dataEmail"
          placeholder="jan@przykladowy.pl"
          value={dataEmail}
          onChange={(e) => updateFields({ dataEmail: e.target.value })}
        />
      </div>
    </FormWrapper>
  );
}
