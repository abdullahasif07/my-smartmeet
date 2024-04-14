import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { persistor, store } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import SigninScreen from "./screens/public/SigninScreen";
import SignupScreen from "./screens/public/SignupScreen";
import SettingScreen from "./screens/private/SettingScreen";
import DashboardScreen from "./screens/private/DashboardScreen";
import MeetingScreen from "./screens/private/MeetingScreen";
import LiveVideoScreen from "./components/LiveVideo";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* public routes */}
      <Route path="" element={<PublicRoute />}>
        <Route path="sign-up" element={<SignupScreen />} />
        <Route path="sign-in" element={<SigninScreen />} />
      </Route>

      {/* private routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path='/via/:channelName' element={<LiveVideoScreen />} />
        <Route index element={<DashboardScreen />} />
        <Route path="settings" element={<SettingScreen />} />
        <Route path="lobby" element={<MeetingScreen />} />
      </Route>
    </Route>
  ),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <HelmetProvider>
          <RouterProvider router={router} />
        </HelmetProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
