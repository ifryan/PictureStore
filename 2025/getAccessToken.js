const express = require('express');
const axios = require('axios');
const qs = require('querystring');
const app = express();

const clientID = 'fgJ79Z66fr7wMXhP2J';
const clientSecret = '$j)lS^q*m9VsT0_cao8ARdKkf77L9+5#';
const redirectURI = 'http://127.0.0.1:8080/callback';

let token = '';

app.get('/', (req, res) => {
    const authURL = `https://dida365.com/oauth/authorize?scope=tasks:write tasks:read&client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&state=state`;
    res.redirect(authURL);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).json({ error: 'code not found' });
    }

    try {
        const data = qs.stringify({
            client_id: clientID,
            client_secret: clientSecret,
            redirect_uri: redirectURI,
            grant_type: 'authorization_code',
            scope: 'tasks:write tasks:read',
            code,
        });

        const response = await axios.post('https://dida365.com/oauth/token', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const accessToken = response.data.access_token;
        if (!accessToken) {
            return res.status(500).json({ error: 'access_token not found in response' });
        }

        token = accessToken;

        res.json({ message: 'Authorization successful', token });
        console.log(token)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to exchange code for token' });
    }
});

// app.get('/create-task', async (req, res) => {
//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   const task = {
//     title: 'New Task',
//     content: 'This is the content of the task.',
//     desc: 'This is a new task.',
//     dueDate: '2024-06-6',
//   };

//   try {
//     const response = await axios.post('https://api.dida365.com/open/v1/task', task, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     const createResponse = response.data;

//     if (response.status !== 200 || createResponse.errorCode) {
//       return res.status(response.status).json({
//         message: 'Failed to create task',
//         errorCode: createResponse.errorCode,
//         errorId: createResponse.errorId,
//         errorMsg: createResponse.errorMessage,
//         data: createResponse.data,
//       });
//     }

//     res.json({ message: 'Task created successfully', response: createResponse });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to create task' });
//   }
// });

app.listen(8080, () => {
    console.log('Server is running on http://127.0.0.1:8080');
});