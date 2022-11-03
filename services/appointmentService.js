import authService from "./authService";


class AppointmentService {

    async get(page, req, res) {
        let requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authService.getCookieFromServer('Token', req, res)
            },
        };

        return await fetch(`http://127.0.0.1:8000/api/v1/appointment/` + page, requestOptions).then(response => {
            if (response.status == 403) {
                return {isRedirect: true}
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
                'Authorization': 'Bearer ' + authService.getCookie('Token')

            },
        };
        return await fetch(`http://127.0.0.1:8000/api/v1/appointment/` + id, requestOptions).then(response => {
            if (response.status == 403) {
                return {isRedirect: true}
            }
            else {
                return response.json();
            }
        });
    }

    async put(id, data) {
        let requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authService.getCookie('Token')
            },
            body: JSON.stringify(data),
        };

        return await fetch(`http://127.0.0.1:8000/api/v1/appointment/` + id, requestOptions)
            .then(response => {
            if (response.status == 403) {
                return {isRedirect: true}
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
                'Authorization': 'Bearer ' + authService.getCookie('Token')

            },
            body: JSON.stringify(data),
        };
        return await fetch(`http://127.0.0.1:8000/api/v1/appointment/`, requestOptions).then(response => {
            if (response.status == 403) {
                return {isRedirect: true}
            }
            else {
                return response.json();
            }
        });
    }


}

export default new AppointmentService();