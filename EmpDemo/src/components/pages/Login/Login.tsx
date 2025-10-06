import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Spinner, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from '../../redux/store/store';
import { fetchLoginData, setLoginDetails } from '../../redux/reducer/loginSlice.ts';
import LoginImg from '../../assets/images/login.jpg';
import { encryptAES } from '../../utils/utils.tsx';
import "../../assets/styles/login.css";
import { AppName } from '../../data/Data.ts';
import { setActiveModule, setCurrentUserId } from '../../redux/reducer/combinedSlice.ts';
import { ModulesList } from '../../data/AppData.ts';
import { useTranslation } from 'react-i18next';
import Cookies from "js-cookie";

interface LoginFormData {
  email: string;
  password: string;
}

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const LoginText = `To keep connected with us please login with your personal information by email and password.`;

const Login: React.FC = () => {

  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; emailPassword?: string }>({});
  const [showPassword, setShowPassword] = useState(false); // Add state for password visibility
  const navigate = useNavigate();

  const {
    loginDetailsData,
    errorMsg
  } = useSelector((state: RootState) => ({
    loginDetailsData: state.login.loginDetailsData as {
      IsSuccessful: boolean;
      Data: any;
      // add other properties if needed
    } | null,
    errorMsg: state.error.errorMsg,
  }));


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear the specific field's error if it's been updated
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }

    // Also clear the emailPassword error when typing
    if (errors.emailPassword) {
      setErrors({
        ...errors,
        emailPassword: undefined
      });
    }
  };


  useEffect(() => {
  if (loginDetailsData && loginDetailsData?.IsSuccessful && loginDetailsData?.Data !== null) {
    toast.success(t('LOGIN.LOGIN_SUCCESS'));

    dispatch(setActiveModule(loginDetailsData.Data.SelectedModuleID as any));

    const defaultRoute = ModulesList.find(
      (item) => item.Id === loginDetailsData.Data.SelectedModuleID
    )?.Route;
    if (defaultRoute) {
      navigate(defaultRoute);
    }

    dispatch(setCurrentUserId(loginDetailsData.Data.UserID));

    // Set token and refreshToken in cookies
    Cookies.set("Token", loginDetailsData.Data.Token, { path: "/" });
    Cookies.set("RefreshToken", loginDetailsData.Data.RefreshToken, { path: "/" });

    // Store login and language data in Cache
    caches.open("login-cache").then(cache => {
      const loginResponse = new Response(JSON.stringify(loginDetailsData.Data), {
        headers: { "Content-Type": "application/json" }
      });
      cache.put("/loginDetails", loginResponse);

      const languageResponse = new Response(JSON.stringify({
        SelectedLanguageId: loginDetailsData.Data.SelectedLanguageId
      }), {
        headers: { "Content-Type": "application/json" }
      });
      cache.put("/selectedLanguage", languageResponse);
    }).finally(() => {
      // Now clear loginDetailsData after everything is done clearing the data in the loginDetailsData to logout without issue
      dispatch(setLoginDetails(null));
    });
  }
}, [loginDetailsData]);



  useEffect(() => {
    if (errorMsg) {
      setErrors({});
    }
  }, [errorMsg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string; emailPassword?: string } = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const loginInfo = `${formData.email},${formData.password}`

    const encryptedToken = encryptAES(loginInfo, SECRET_KEY || "");

    const token = {
      LoginToken: `${encryptedToken}`
    };
    dispatch(fetchLoginData(token));
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="login-header">
          <h1 className="text-primary fw-bold m-0">{AppName}</h1>
        </div>

        <div className="login-content">
          <Container fluid className="h-100 ct-container">
            <Row className="h-100 w-100 flex-column flex-md-row justify-content-center align-items-center m-0">
              {/* Image Column */}
              <Col xs={12} md={6} className="d-flex justify-content-center align-items-center mb-4 mb-md-0">
                <img src={LoginImg} alt="login" className="img-fluid d-block" />
              </Col>

              {/* Login Form Column */}
              <Col xs={12} md={6} className="ct-login-form-box">
                <h2 className="mb-3 ct-login-form-text">Login</h2>
                <p className="mb-4 d-none d-md-block" style={{ fontSize: '1rem' }}>{LoginText}</p>

                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Username</Form.Label>
                    <InputGroup className="mb-3 ct-input-group">
                      <InputGroup.Text className="ct-login-input-text"><FaEnvelope /></InputGroup.Text>
                      <Form.Control
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter Username"
                        isInvalid={!!errors.email}
                        className="ct-login-input"
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <InputGroup className="mb-3 ct-input-group">
                      <InputGroup.Text className="ct-login-input-text"><FaLock /></InputGroup.Text>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter Password"
                        isInvalid={!!errors.password}
                        className="ct-login-input"
                      />
                      <InputGroup.Text
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: 'pointer' }}
                        className="ct-login-input-text"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100" >
                   Login
                  </Button>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Login;