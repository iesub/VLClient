export const initialState = {
    pageNumber: 1,
    pageAmount: 0,
    bookName: null,
    checked: false
  }
    
  export function paginationReducer(state = initialState, action) {
    switch(action.type){
      case "SET_INITIAL":
        return {...state, 
            pageNumber: action.payload.pageNumber, 
            pageAmount: action.payload.pageAmount,
            checked: action.payload.checked,
            bookName: action.payload.bookName
        }
      default:
        return state
    }
  }