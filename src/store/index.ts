import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import appReducer from './slices/appSlice';
import userReducer from './slices/userSlice';
import gameReducer from './slices/gameSlice';
import themeReducer from './slices/themeSlice';
import authReducer from './slices/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'theme'], // Only persist user and theme data
};

const rootReducer = {
  app: appReducer,
  user: persistReducer(persistConfig, userReducer),
  game: gameReducer,
  theme: persistReducer(persistConfig, themeReducer),
  auth: authReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
