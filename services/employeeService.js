import AuthService from "./authService";

class EmployeeService {
    async put(id, data) {
        let requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + AuthService.getCookie('Token')
            },
            body: JSON.stringify(data),
        };

        return await fetch(`http://127.0.0.1:8000/api/v1/employee/` + id, requestOptions)
            .then(response => {
            if (response.status == 403) {
                window.location.assign("http://localhost:3000/");
            }
            else {
                return response.json();
            }
        });
    }

    async get() {
        let requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + AuthService.getCookie('Token')
            },
        };

        return await fetch(`http://127.0.0.1:8000/api/v1/employee/`, requestOptions).then(response => {
            if (response.status == 403) {
                window.location.assign("http://localhost:3000/");
            }
            else {
                return response.json();
            }
        });
    }

    async post(data) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + AuthService.getCookie('Token')

            },
            body: JSON.stringify(data),
        };
        return await fetch(`http://127.0.0.1:8000/api/v1/employee/`, requestOptions).then(response => {
            if (response.status == 403) {
                window.location.assign("http://localhost:3000/");
            }
            else {
                return response.json();
            }
        });
    }

    async delete(id) {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + AuthService.getCookie('Token')

            },
        };
        return await fetch(`http://127.0.0.1:8000/api/v1/employee/` + id, requestOptions).then(response => {
            if (response.status == 403) {
                window.location.assign("http://localhost:3000/");
            }
            else {
                return response.json();
            }
        });
    }
}

export default new EmployeeService();