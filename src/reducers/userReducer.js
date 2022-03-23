export const initialState = {
  isAuthenticated: false,
  mail: "",
  nickname: "",
  authorities: [],
  checked: false
}
  
export function userReducer(state = initialState, action) {
  switch(action.type){
    case "SET_IF_AUTHENTICATED":
      return {...state, isAuthenticated: action.payload}
    case "SET_MAIL":
      return {...state, mail: action.payload}
    case "SET_NICKNAME":
      return {...state, nickname: action.payload}
    case "SET_AUTHORITIES":
      return {...state, authorities: action.payload}
    case "SET_IF_CHECKED":
      return {...state, checked: action.payload}
    default:
      return state
  }
}