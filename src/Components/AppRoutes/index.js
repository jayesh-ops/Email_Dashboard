import { Container, Row, Col } from "react-bootstrap";
import "../../App.css";
import {  Route, Routes } from "react-router-dom";
import Dashboard from "../../Pages/Dashbaord";
import Login from "../../Pages/Login";
import Signup from "../../Pages/Signup";
import { UserAuthContextProvider, useUserAuth } from "../../Pages/context";
import ProtectedRoute from "../../Pages/ProtectedRoute";


import SideMenu from '../SideMenu'; // Import your SideMenu component

function App() {
  const user  = useUserAuth(); // Get the user's authentication status

  return (
    <Container style={{ width: "500px" }}>
      <Row>
        <Col>
          {user && <SideMenu />} {/* Render the SideMenu if the user is logged in */}
          <UserAuthContextProvider>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </UserAuthContextProvider>
        </Col>
      </Row>
    </Container>
  );
}

export default App;