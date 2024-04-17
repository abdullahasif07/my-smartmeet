// Import necessary functions and libraries
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import authReducer from "@/features/auth/authSlice";
import { userApiSlice } from "@/services/user/userApiSlice";
import { messageApiSlice } from "@/services/message/messageApiSlice";
// Configuration for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};
// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  [userApiSlice.reducerPath]: userApiSlice.reducer,
  [messageApiSlice.reducerPath]: messageApiSlice.reducer,
});
// Create a persisted reducer using the persistConfig and the rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure and create the redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(userApiSlice.middleware)
      .concat(messageApiSlice.middleware),
});

export const persistor = persistStore(store);

// Define RootState type for use in useSelector hook
export type RootState = ReturnType<typeof store.getState>;
// Define AppDispatch type for use in useDispatch hook
export type AppDispatch = typeof store.dispatch;
