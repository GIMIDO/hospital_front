import { getCookie, setCookie } from "cookies-next"

class AuthService {
    getCookieFromServer(name, req, res) {
        var cookie = getCookie(name, {req, res})
        return cookie
    }

    async getRole(req, res) {
        let requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        return await fetch(`http://127.0.0.1:8000/api/v1/login/` + this.getCookieFromServer('Token', req, res), requestOptions)
            .then(response => {
                if (response.status == 403) {
                    return undefined;
                }
                else {
                    return response.json();
                }
            });
    }

    async login(data){
        let requestOptions = {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }

        return await fetch(`http://127.0.0.1:8000/api/v1/login/`, requestOptions)
            .then(response => {
            if (response.status == 403) {
                return null;
            }
            else {
                return response.json()
            }
        });
    }

    getCookie(name) {
        var cookie = getCookie(name)
        return cookie
    }

    setCookie(name, value){
        setCookie(name, value)
    }
}

export default new AuthService();