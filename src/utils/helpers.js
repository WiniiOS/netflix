export const calcTime = time => {
    const hours = Math.floor(time/60)
    const mins = time % 60
    return `${hours}h ${mins}m`
}

export const convertMoney = money =>{
    let formatter = new Intl.NumberFormat("en-US",{
        style:'currency',
        currency:"USD",
        minimumFractionDigits:0
    })
    return formatter.format(money)
}

export const CODEFLIX_APP_LOGGEDIN = "CODEFLIX_APP_LOGGEDIN"

// codeflix_app_loggedin est une var definie a true lorsqu'un user se connecte

export const renderLogin = () => {
    const flag = !!localStorage.getItem(CODEFLIX_APP_LOGGEDIN)
    console.log('flag',flag)
    return flag
}