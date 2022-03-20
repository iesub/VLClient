export const initialState = {
    agree: false,
  }
  
  export function AuthorizationReducer(state = initialState, action) {
    switch (action.type){
        case 'SET_AGREE':
            return {...state, agree: action.payload}
        default:
            return state
    }
  }