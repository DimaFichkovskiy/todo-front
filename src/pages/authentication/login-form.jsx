import { ReactComponent as EyeOpen } from "../../assets/svg/eye-off.svg";
import { ReactComponent as EyeClosed } from "../../assets/svg/eye-on.svg";
import { FeatherIcons } from "../../assets/svg/feather-icons";
import { Spinner } from "../../components/Spinner";
import { useAuth } from "../../hooks";
import { useState } from "react";
import { Link } from "react-router-dom";
export const LoginForm = () => {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [showDefaultErrorMessage, setShowDefaultErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [authenticating, setAuthenticating] = useState(false);
  const { signinWithEmail } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const onChangeHandler = (event) => {
    event.preventDefault();
    setEmailIsValid(true);
    setShowDefaultErrorMessage(false);

    const value = event.target.value;
    setFormState({
      ...formState,
      [event.target.name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setAuthenticating(true);
    const { email, password } = formState;
    const emailRegex = /\S+@\S+\.\S+/;
    if (emailRegex.test(email)) {
      setEmailIsValid(true);
    } else {
      setErrorMessage("Ви ввели не правильний email");
      setEmailIsValid(false);
      return;
    }

    if (emailIsValid) {
      signinWithEmail(email, password).catch((error) => {
        console.log("ERROR", error);
        if (error.code === "auth/wrong-password") {
          setErrorMessage("Не правильний email або пароль");
          setShowDefaultErrorMessage(true);
        }
        if (error.code === "auth/user-not-found") {
          setErrorMessage("Користувач не знайдений");
          setShowDefaultErrorMessage(true);
        }
      });
    }
    setAuthenticating(false);
  };

  return (
    <>
      <div className="error-block">
        {showDefaultErrorMessage && (
          <div className="error-message">
            <FeatherIcons id="alert-circle" width={20} height={20} fill="#db4c3f" stroke={"#fff"} strokeWidth={2} currentColor={"#fff"} />
            {errorMessage}
          </div>
        )}
        {!emailIsValid && (
          <div className="error-message">
            <FeatherIcons id="alert-circle" width={20} height={20} fill="#db4c3f" stroke={"#fff"} strokeWidth={2} currentColor={"#fff"} />
            {errorMessage}
          </div>
        )}
      </div>
      <form className="login-form">
        <div className="field">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input type="email" name="email" id="email" value={formState.email} onChange={(e) => onChangeHandler(e)} />
        </div>
        <div className="field">
          <label className="label" htmlFor="password">
            Пароль
          </label>
          <div className="toggle_password">
            <input
              className="form_field_control"
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Підтвердити пароль"
              value={formState.password}
              onChange={(e) => onChangeHandler(e)}
            />
            <span className="toggle" role="checkbox" tabIndex="0" aria-checked="false" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOpen /> : <EyeClosed />}
            </span>
          </div>
        </div>
        <button className="auth-button submit-button" onClick={(e) => handleSubmit(e)}>
          Увійти
          {authenticating && <Spinner light />}
        </button>

        <hr />

        <p>
          Ви не маєте аккаунту? <Link to="/signup">Зареєструватися</Link>
        </p>
      </form>
    </>
  );
};
