module.exports = {
    apps: [
        {
            name: 'fastapi-app',  
            script: 'uvicorn',   
            args: 'server:app --reload', 
            interpreter: 'python3',
            env: {
                PORT: 8000,
            },
            instances: 1, 
            autorestart: true, 
            watch: false,
        },
    ],
};
