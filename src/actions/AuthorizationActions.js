export const setIsAuthenticated = (value) => {
    return {
        type: "SET_IF_AUTHENTICATED",
        payload: value
    }
}

export const setMail = (value) => {
    return{
        type: "SET_MAIL",
        payload: value
    }
}

export const setNickname = (value) => {
    return{
        type: "SET_NICKNAME",
        payload: value
    }
}

export const setAuthorities = (value) => {
    return{
        type: "SET_AUTHORITIES",
        payload: value
    }
}

export const setIfChecked = (value) => {
    return{
        type: "SET_IF_CHECKED",
        payload: value
    }
}

export const initUser = (value) => {
    return{
        type: "INIT",
        payload: value
    }
}