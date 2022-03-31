import { combineReducers } from 'redux'
import { paginationReducer } from './paginationReducer'
import { userReducer } from './userReducer'

export const rootReducer = combineReducers({
  user: userReducer,
  pagData: paginationReducer
})