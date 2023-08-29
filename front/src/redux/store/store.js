// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import rootReducer from "../reducer/rootReducer";

const persistConfig = {
  key: 'tpf',
  storage,
  blacklist: [
    'customersReducer',
    'commonReducer',
    'usersReducer',
    'helpfulTipsReducer',
    'homeCategoriesReducer',
    'applicationSettingsReducer',
    'promotionBannersReducer',
    'questionsReducer',
    // 'entityAndAttributesReducer',
    'plansReducer',
    'mealsReducer',
    'foodTypesReducer',
    'calorieCalculationsReducer',
    'workoutsReducer',
    'medicalInstructionsReducer',
    'contentOfTheDaysReducer',
    'dailyTasksReducer',
  ]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.REACT_APP_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)