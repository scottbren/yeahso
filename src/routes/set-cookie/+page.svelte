<script context="module">
    export function load({ query, cookies }) {
        const userId = query.get('userId');
        if (userId) {
            cookies.set('userID', userId, { path: '/', expires: new Date(Date.now() + 86400000) });
            
            return {
                status: 302, // HTTP status for redirect
                headers: {
                    'Location': '/swipe' // Redirect to the dashboard or another route after setting the cookie
                }
            };
        } else {
            return {
                status: 400,
                body: 'Missing user data'
            };
        }
    }
    </script>
    