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
    case "INIT":
      return {
        ...state,
        checked: action.payload.checked,
        isAuthenticated: action.payload.isAuthenticated,
        mail: action.payload.mail,
        nickname: action.payload.nickname,
        authorities: action.payload.authorities
      }
    default:
      return state
  }
}