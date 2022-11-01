class AppointmentService {

    async get(page) {
        let requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjY3MzE1ODY4LCJpYXQiOjE2NjcyOTc4NjgsImp0aSI6IjJjZTk2YjU0Njk3NjQ5ZmQ5MmNhOGNkNDcwNzhjNTVhIiwidXNlcl9pZCI6MSwibmFtZSI6IkNocmlzIEhlcnJpbmd0b24iLCJyb2xlIjoiQWRtaW4ifQ.V5fFwZHOPW9Yrn-0XlOYKh-oZnLJBClxlRsNvOO4n3k'
            },
        };

        return await fetch(`http://127.0.0.1:8000/api/v1/appointment/` + page, requestOptions).then(response => {
            if (response.status == 403) {
                return None
            }
            else {
                return response.json();
            }
        });
    }
}

export default new AppointmentService();