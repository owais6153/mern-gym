import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { resetCommonReducerErrorsAction } from "./redux/actions/main";
import Layout from "./layouts/Layout";
import Login from "./views/Login.jsx";
import Dashboard from "./views/Dashboard.js";
// User
import Users2 from "./views/Users";
import Users from "./views/Users/Users";
import UserView from "./views/Users/UserView";
import UserEdit from "./views/Users/UserEdit";
import UserCreate from "./views/Users/UserCreate";
// Customers
import Customers from "./views/Customers/Customers";
import CustomerView from "./views/Customers/CustomerView";
import CustomerEdit from "./views/Customers/CustomerEdit";
import CustomerCreate from "./views/Customers/CustomerCreate";
// ApplicationSettings
import ApplicationSettingsEdit from "./views/ApplicationSettings/ApplicationSettingsEdit";
import ApplicationSettingsCreate from "./views/ApplicationSettings/ApplicationSettingsCreate";
// PromotionBanners
import PromotionBannersEdit from "./views/PromotionBanners/PromotionBannersEdit";
import PromotionBannersCreate from "./views/PromotionBanners/PromotionBannersCreate";
// HelpfulTips
import HelpfulTipsEdit from "./views/HelpfulTips/HelpfulTipsEdit";
import HelpfulTipsCreate from "./views/HelpfulTips/HelpfulTipsCreate";
// HelpfulTips
import HomeCategoriesEdit from "./views/HomeCategories/HomeCategoriesEdit";
import HomeCategoriesCreate from "./views/HomeCategories/HomeCategoriesCreate";
// Questions
import QuestionsEdit from "./views/Questions/QuestionsEdit";
import QuestionsCreate from "./views/Questions/QuestionsCreate";
// Plans
import Plans from "./views/Plans/Plans";
import PlanEdit from "./views/Plans/PlansEdit";
import PlanCreate from "./views/Plans/PlansCreate";
// Meals
import Meals from "./views/Meals/Meals";
import MealEdit from "./views/Meals/MealsEdit";
import MealCreate from "./views/Meals/MealsCreate";
// FoodTypes
import FoodTypes from "./views/FoodTypes/FoodTypes";
import FoodTypeEdit from "./views/FoodTypes/FoodTypesEdit";
import FoodTypeCreate from "./views/FoodTypes/FoodTypesCreate";
// CalorieCalculations
import CalorieCalculations from "./views/CalorieCalculations/CalorieCalculations";
import CalorieCalculationEdit from "./views/CalorieCalculations/CalorieCalculationsEdit";
import CalorieCalculationCreate from "./views/CalorieCalculations/CalorieCalculationsCreate";
// Workouts
import Workouts from "./views/Workouts/Workouts";
import WorkoutEdit from "./views/Workouts/WorkoutsEdit";
import WorkoutCreate from "./views/Workouts/WorkoutsCreate";
// MedicalInstructions
import MedicalInstructions from "./views/MedicalInstructions/MedicalInstructions";
import MedicalInstructionEdit from "./views/MedicalInstructions/MedicalInstructionsEdit";
import MedicalInstructionCreate from "./views/MedicalInstructions/MedicalInstructionsCreate";
// ContentOfTheDays
import ContentOfTheDays from "./views/ContentOfTheDays/ContentOfTheDays";
import ContentOfTheDayEdit from "./views/ContentOfTheDays/ContentOfTheDaysEdit";
import ContentOfTheDayCreate from "./views/ContentOfTheDays/ContentOfTheDaysCreate";
// DailyTasks
import DailyTasks from "./views/DailyTasks/DailyTasks";
import DailyTaskEdit from "./views/DailyTasks/DailyTasksEdit";
import DailyTaskCreate from "./views/DailyTasks/DailyTasksCreate";

import NewGuide from "./views/newGuideVideo.js";
import Workouts2 from "./views/Workouts.js";
import NewWorkouts from "./views/NewWorkouts.js";
import MealPlans from "./views/MealPlans.js";
import DailyTask from "./views/DailyTask.js";
import CalorieCalculations2 from "./views/CalorieCalculations.js";
import PushNotifications from "./views/PushNotifications.js";
import AppContent from "./views/AppContent.js";
import SubscriptionPlans from "./views/SubscriptionPlans.js";
import NewDailyTask from "./views/NewDailyTask.js";
import NewCalorieItem from "./views/newCalorieitem.js";
import NewPushNotifications from "./views/new-push-notifictaion.js";
import UpdateBanner from "./views/update-banner.js";
import NewSubscriptionPlan from "./views/new-subscription-plan.js";
import ChatSupport from "./views/ChatSupport.js";
import Icons from "./views/Icons.js";

import { connect } from "react-redux";

function App(props) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location) props.resetCommonReducerErrorsAction();
  }, [location]);
  useEffect(() => {
    if (!props.token) {
      navigate("/");
    }
  }, [props.token]);

  return (
    <Routes>
      {!props.token ? (
        <Route path="/" element={<Login />} />
      ) : (
        <>
          <Route path="/admin" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            {/* user routes */}
            <Route path="users" element={<Users />} />
            <Route path="user/:id" element={<UserView />} />
            <Route path="user/edit/:id" element={<UserEdit />} />
            <Route path="user/create" element={<UserCreate />} />

            {/* customer routes */}
            <Route path="customers" element={<Customers />} />
            <Route path="customer/:id" element={<CustomerView />} />
            <Route path="customer/edit/:id" element={<CustomerEdit />} />
            <Route path="customer/create" element={<CustomerCreate />} />

            {/* applicationSettings routes */}
            <Route
              path="applicationSettings/edit/:id"
              element={<ApplicationSettingsEdit />}
            />
            <Route
              path="applicationSettings/create"
              element={<ApplicationSettingsCreate />}
            />

            {/* applicationSettings routes */}
            <Route
              path="promotionBanners/edit/:id"
              element={<PromotionBannersEdit />}
            />
            <Route
              path="promotionBanners/create"
              element={<PromotionBannersCreate />}
            />

            {/* helpfulTips routes */}
            <Route path="helpfulTips/edit/:id" element={<HelpfulTipsEdit />} />
            <Route path="helpfulTips/create" element={<HelpfulTipsCreate />} />

            {/* homeCategories routes */}
            <Route
              path="homeCategories/edit/:id"
              element={<HomeCategoriesEdit />}
            />
            <Route
              path="homeCategories/create"
              element={<HomeCategoriesCreate />}
            />

            {/* questions routes */}
            <Route path="questions/edit/:id" element={<QuestionsEdit />} />
            <Route path="questions/create" element={<QuestionsCreate />} />

            {/* plans routes */}
            <Route path="plans" element={<Plans />} />
            <Route path="plan/edit/:id" element={<PlanEdit />} />
            <Route path="plan/create" element={<PlanCreate />} />

            {/* Meals routes */}
            <Route path="meals" element={<Meals />} />
            <Route path="meal/edit/:id" element={<MealEdit />} />
            <Route path="meal/create" element={<MealCreate />} />

            {/* FoodTypes routes */}
            <Route path="foodTypes" element={<FoodTypes />} />
            <Route path="foodType/edit/:id" element={<FoodTypeEdit />} />
            <Route path="foodType/create" element={<FoodTypeCreate />} />

            {/* CalorieCalculations routes */}
            <Route
              path="calorieCalculations"
              element={<CalorieCalculations />}
            />
            <Route
              path="calorieCalculation/edit/:id"
              element={<CalorieCalculationEdit />}
            />
            <Route
              path="calorieCalculation/create"
              element={<CalorieCalculationCreate />}
            />

            {/* Workouts routes */}
            <Route path="workouts" element={<Workouts />} />
            <Route path="workout/edit/:id" element={<WorkoutEdit />} />
            <Route path="workout/create" element={<WorkoutCreate />} />

            {/* MedicalInstructions routes */}
            <Route
              path="medicalInstructions"
              element={<MedicalInstructions />}
            />
            <Route
              path="medicalInstruction/edit/:id"
              element={<MedicalInstructionEdit />}
            />
            <Route
              path="medicalInstruction/create"
              element={<MedicalInstructionCreate />}
            />

            {/* ContentOfTheDays routes */}
            <Route path="contentOfTheDays" element={<ContentOfTheDays />} />
            <Route
              path="contentOfTheDay/edit/:id"
              element={<ContentOfTheDayEdit />}
            />
            <Route
              path="contentOfTheDay/create"
              element={<ContentOfTheDayCreate />}
            />

            {/* DailyTasks routes */}
            <Route path="dailyTasks" element={<DailyTasks />} />
            <Route path="dailyTask/edit/:id" element={<DailyTaskEdit />} />
            <Route path="dailyTask/create" element={<DailyTaskCreate />} />

            <Route path="workouts2" element={<Workouts2 />} />
            <Route path="meal-plans" element={<MealPlans />} />
            <Route path="daily-tasks" element={<DailyTask />} />
            <Route
              path="calorie-calculations"
              element={<CalorieCalculations2 />}
            />
            <Route path="push-notifications" element={<PushNotifications />} />
            <Route path="chat-support" element={<ChatSupport />} />
            <Route path="app-content" element={<AppContent />} />
            <Route path="subscription-plans" element={<SubscriptionPlans />} />
            {/* inner pages */}
            <Route path="new-guide" element={<NewGuide />} />
            <Route path="new-workouts" element={<NewWorkouts />} />
            <Route path="new-daily-task" element={<NewDailyTask />} />
            <Route path="new-calorie-item" element={<NewCalorieItem />} />
            <Route path="new-notification" element={<NewPushNotifications />} />
            <Route path="update-banner" element={<UpdateBanner />} />
            <Route path="new-subscription" element={<NewSubscriptionPlan />} />
            <Route path="Users2" element={<Users2 />} />
            <Route path="Icons" element={<Icons />} />
          </Route>
          <Route
            path="*"
            element={<Navigate replace to="/admin/dashboard" />}
          />
        </>
      )}
    </Routes>
  );
}

const mapStateToProps = (state) => ({
  token: state.userReducer.token,
});

const mapDispatchToProps = (dispatch) => ({
  resetCommonReducerErrorsAction: (data) =>
    dispatch(resetCommonReducerErrorsAction(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
