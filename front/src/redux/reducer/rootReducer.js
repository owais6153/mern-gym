import { combineReducers } from "redux"
import userReducer from "./userReducer"
import commonReducer from "./commonReducer"
import usersReducer from "./usersReducer"
import customersReducer from "./customersReducer"
import helpfulTipsReducer from "./helpfulTipsReducer"
import homeCategoriesReducer from "./homeCategoriesReducer"
import applicationSettingsReducer from "./applicationSettingsReducer"
import promotionBannersReducer from "./promotionBannersReducer"
import questionsReducer from "./questionsReducer"
import entityAndAttributesReducer from "./entityAndAttributesReducer"
import plansReducer from "./plansReducer"
import mealsReducer from "./mealsReducer"
import foodTypesReducer from "./foodTypesReducer"
import calorieCalculationsReducer from "./calorieCalculationsReducer"
import workoutsReducer from "./workoutsReducer"
import medicalInstructionsReducer from "./medicalInstructionsReducer"
import contentOfTheDaysReducer from "./contentOfTheDaysReducer"
import dailyTasksReducer from "./dailyTasksReducer"

const rootReducer = combineReducers({
    userReducer: userReducer,
    customersReducer: customersReducer,
    commonReducer: commonReducer,
    usersReducer: usersReducer,
    helpfulTipsReducer: helpfulTipsReducer,
    homeCategoriesReducer: homeCategoriesReducer,
    applicationSettingsReducer: applicationSettingsReducer,
    promotionBannersReducer: promotionBannersReducer,
    questionsReducer: questionsReducer,
    entityAndAttributesReducer: entityAndAttributesReducer,
    plansReducer: plansReducer,
    mealsReducer: mealsReducer,
    foodTypesReducer: foodTypesReducer,
    calorieCalculationsReducer: calorieCalculationsReducer,
    workoutsReducer: workoutsReducer,
    medicalInstructionsReducer: medicalInstructionsReducer,
    contentOfTheDaysReducer: contentOfTheDaysReducer,
    dailyTasksReducer: dailyTasksReducer,
})

export default rootReducer;