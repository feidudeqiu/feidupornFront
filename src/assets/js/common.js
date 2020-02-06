import axios from 'axios'
function Login () {

}
Login.prototype.loginControl = function (success) {
    var logged = sessionStorage.getItem("logged");
    if (logged === null || logged === 'false') {
        var token = localStorage.getItem("token");
        if (token !== null) {
            console.info(token);
            axios.post("api/login/login-token", {"token": token})
                .then(function (res) {
                    sessionStorage.setItem("logged", true);
                    success();
                    return true;
                })
                .catch(function (err) {
                    if (err.response.data.code >= 2) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("tokenTTL");
                    }
                    return false;
                })
        }
    }
    if (logged === 'true') {
        success();
        return true;
    }
}
let LoginController = new Login();
export {LoginController};
export default {
    Login
}
