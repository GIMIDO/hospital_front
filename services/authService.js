import Cookies from 'universal-cookie';

class AuthService {
    async getRole() {
        let requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        return await fetch(`http://127.0.0.1:8000/api/v1/login/` + this.getCookie('Token'), requestOptions)
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
        const cookies = new Cookies();
        var cookie = cookies.get(name);
        return cookie;
    }

    setCookie(name, value){
        const cookies = new Cookies();
        cookies.set(name, value);
    }
}

export default new AuthService();