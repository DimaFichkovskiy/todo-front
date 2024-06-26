import {useState} from "react";
import {Link} from "react-router-dom";
import {Spinner} from "../../components/Spinner";
import {useAuth} from "../../hooks";
import {LoginSignupForm} from "./login-signup-form";
import { ReactComponent as EyeOpen } from "../../assets/svg/eye-off.svg";
import { ReactComponent as EyeClosed } from "../../assets/svg/eye-on.svg";
import featherIcon from "../../assets/svg/feather-sprite.svg";

export const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: ""
  });
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [nameHasError, setNameHasError] = useState(false);
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [globalErrorMessage, setGlobalErrorMessage] = useState("");

  const {signupWithEmail} = useAuth();

  const onChangeHandler = (event) => {
    event.preventDefault();
    setEmailIsValid(true);
    if (event.target.name === "password" || event.target.name === "confirm_password") {
      setPasswordHasError(false);
    } else {
      setNameHasError(false);
    }
    const value = event.target.value;
    setFormState({
      ...formState,
      [event.target.name]: value,
    });
  };

  const verifyEmailAndSignup = async (event) => {
    event.preventDefault();
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formState.email)) {
      setEmailIsValid(false);
      setErrorMessage("Поле email не може бути порожнє або містити невірний формат");
      setGlobalErrorMessage("Поле email не може бути порожнє або містити невірний формат");
      return;
    }

    if (!formState.first_name || !formState.last_name) {
      setNameHasError(true);
      setErrorMessage("Поля ім'я та прізвище не можуть бути порожніми");
      setGlobalErrorMessage("Поля ім'я та прізвище не можуть бути порожніми");
      return;
    }

    if (formState.password.length < 8 || formState.password !== formState.confirm_password) {
      setPasswordHasError(true);
      setErrorMessage("Пароль має містити щонайменше 8 символів і збігатися з підтвердженням");
      setGlobalErrorMessage("Пароль має містити щонайменше 8 символів і збігатися з підтвердженням");
      return;
    }

    setLoading(true);
    try {
      await signupWithEmail(formState);
      // Додаткова логіка, яку ви хочете виконати після успішної реєстрації
    } catch (error) {
      console.error('Signup failed:', error);
      setGlobalErrorMessage("Помилка реєстрації. Спробуйте ще раз пізніше.");
    } finally {
      setLoading(false);
    }
  };

  return (
      // <div className="signup">
      //   <div className="signup__wrapper">
      <>
          <LoginSignupForm/>

          <div className="separator">
            <div className="middle_separator">або</div>
          </div>

          <form className="signup-form">
            <div className="field">
              <label htmlFor="email" className="label">
                Email
              </label>
              {!emailIsValid && (
                  <div className="error-message">
                    <svg className="feather-icon" width="20" height="20" fill="#db4c3f" stroke="#fff" strokeWidth="2"
                         strokeLinecap="round" strokeLinejoin="round">
                      <use xlinkHref={`${featherIcon}#alert-circle`}/>
                    </svg>
                    {errorMessage}
                  </div>
              )}
              <input
                  type="email"
                  value={formState.email}
                  name="email"
                  id="email"
                  autoComplete="off"
                  className={!emailIsValid ? "has-error" : ""}
                  onChange={(event) => onChangeHandler(event)}
              />
            </div>

            <div className="field">
              <label htmlFor="first_name" className="label">
                Ім’я
              </label>
              {nameHasError && (
                  <div className="error-message">
                    <svg className="feather-icon" width="20" height="20" fill="#db4c3f" stroke="#fff" strokeWidth="2"
                         strokeLinecap="round" strokeLinejoin="round">
                      <use xlinkHref={`${featherIcon}#alert-circle`}/>
                    </svg>
                    Ім'я та прізвище не можуть бути порожніми
                  </div>
              )}
              <input
                  value={formState.first_name}
                  autoComplete="off"
                  type="text"
                  name="first_name"
                  id="first_name"
                  className={`${nameHasError ? "has-error" : ""}`}
                  onChange={(event) => onChangeHandler(event)}
              />
            </div>

            <div className="field">
              <label htmlFor="last_name" className="label">
                Прізвище
              </label>
              {nameHasError && (
                  <div className="error-message">
                    <svg className="feather-icon" width="20" height="20" fill="#db4c3f" stroke="#fff" strokeWidth="2"
                         strokeLinecap="round" strokeLinejoin="round">
                      <use xlinkHref={`${featherIcon}#alert-circle`}/>
                    </svg>
                    Ім'я та прізвище не можуть бути порожніми
                  </div>
              )}
              <input
                  value={formState.last_name}
                  autoComplete="off"
                  type="text"
                  name="last_name"
                  id="last_name"
                  className={`${nameHasError ? "has-error" : ""}`}
                  onChange={(event) => onChangeHandler(event)}
              />
            </div>

            <div className="field">
              <label htmlFor="password" className="label">
                Пароль
              </label>
              {passwordHasError && (
                  <div className="error-message">
                    <svg className="feather-icon" width="20" height="20" fill="#db4c3f" stroke="#fff" strokeWidth="2"
                         strokeLinecap="round" strokeLinejoin="round">
                      <use xlinkHref={`${featherIcon}#alert-circle`}/>
                    </svg>
                    Пароль має містити щонайменше 8 символів і збігатися з підтвердженням
                  </div>
              )}
              <div className="toggle_password">
                <input
                    className={` form_field_control ${passwordHasError ? "has-error" : ""}`}
                    value={formState.password}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    onChange={(event) => onChangeHandler(event)}
                />
                <span className="toggle" role="checkbox" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOpen/> : <EyeClosed/>}
              </span>
              </div>
            </div>

            <div className="field">
              <label htmlFor="confirm_password" className="label">
                Підтвердження пароля
              </label>
              <div className="toggle_password">
                <input
                    className={` form_field_control ${passwordHasError ? "has-error" : ""}`}
                    value={formState.confirm_password}
                    type={showPassword ? "text" : "password"}
                    name="confirm_password"
                    id="confirm_password"
                    onChange={(event) => onChangeHandler(event)}
                />
                <span className="toggle" role="checkbox" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOpen/> : <EyeClosed/>}
              </span>
              </div>
            </div>

            <div className="hint-text">Ваш пароль має містити щонайменше 8 символів. Уникайте поширених слів або шаблонів.</div>
              <button className="auth-button submit-button" disabled={loading}
                      onClick={(event) => verifyEmailAndSignup(event)}>
                Зареєструватися
                {loading && <Spinner light/>}
              </button>

              <hr/>

              <p>
                Вже зареєстровані? <Link to="/signin">Перейти до входу</Link>
              </p>

              {globalErrorMessage && (
                  <div className="error-message global-error">
                    <svg className="feather-icon" width="20" height="20" fill="#db4c3f" stroke="#fff" strokeWidth="2"
                         strokeLinecap="round" strokeLinejoin="round">
                      <use xlinkHref={`${featherIcon}#alert-circle`}/>
                    </svg>
                    {globalErrorMessage}
                  </div>
              )}
          </form>
      </>
        // </div>
      // </div>
);
};
