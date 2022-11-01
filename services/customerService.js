class CustomerService {

    async get(page) {
        let requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjY3MzE1ODY4LCJpYXQiOjE2NjcyOTc4NjgsImp0aSI6IjJjZTk2YjU0Njk3NjQ5ZmQ5MmNhOGNkNDcwNzhjNTVhIiwidXNlcl9pZCI6MSwibmFtZSI6IkNocmlzIEhlcnJpbmd0b24iLCJyb2xlIjoiQWRtaW4ifQ.V5fFwZHOPW9Yrn-0XlOYKh-oZnLJBClxlRsNvOO4n3k'
            },
        };

        return await fetch(`http://127.0.0.1:8000/api/v1/customer/` + page, requestOptions).then(response => {
            if (response.status == 403) {
                console.log('not getted')
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
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjY3MzE1ODY4LCJpYXQiOjE2NjcyOTc4NjgsImp0aSI6IjJjZTk2YjU0Njk3NjQ5ZmQ5MmNhOGNkNDcwNzhjNTVhIiwidXNlcl9pZCI6MSwibmFtZSI6IkNocmlzIEhlcnJpbmd0b24iLCJyb2xlIjoiQWRtaW4ifQ.V5fFwZHOPW9Yrn-0XlOYKh-oZnLJBClxlRsNvOO4n3k'

            },
        };
        return await fetch(`http://127.0.0.1:8000/api/v1/customer/` + id, requestOptions).then(response => {
            if (response.status == 403) {
                console.log('not deleted')
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
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjY3MzE1ODY4LCJpYXQiOjE2NjcyOTc4NjgsImp0aSI6IjJjZTk2YjU0Njk3NjQ5ZmQ5MmNhOGNkNDcwNzhjNTVhIiwidXNlcl9pZCI6MSwibmFtZSI6IkNocmlzIEhlcnJpbmd0b24iLCJyb2xlIjoiQWRtaW4ifQ.V5fFwZHOPW9Yrn-0XlOYKh-oZnLJBClxlRsNvOO4n3k'

            },
            body: JSON.stringify(data),
        };
        return await fetch(`http://127.0.0.1:8000/api/v1/customer/`, requestOptions).then(response => {
            if (response.status == 403) {
                // ...
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
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjY3MzE1ODY4LCJpYXQiOjE2NjcyOTc4NjgsImp0aSI6IjJjZTk2YjU0Njk3NjQ5ZmQ5MmNhOGNkNDcwNzhjNTVhIiwidXNlcl9pZCI6MSwibmFtZSI6IkNocmlzIEhlcnJpbmd0b24iLCJyb2xlIjoiQWRtaW4ifQ.V5fFwZHOPW9Yrn-0XlOYKh-oZnLJBClxlRsNvOO4n3k'
            },
            body: JSON.stringify(data),
        };

        return await fetch(`http://127.0.0.1:8000/api/v1/customer/` + id, requestOptions)
            .then(response => {
            if (response.status == 403) {
                //...
            }
            else {
                return response.json();
            }
        });
    }
}

export default new CustomerService();