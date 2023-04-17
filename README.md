## Lex Machina API Alerting Example

This sample "starter pack" application uses the Lex Machina API to gather a list of cases where your firm represents the defendant.

Starting the server will retrieve a case list and for each include judge and counsel data. 

The setup instructions below assume you have an account at [Lex Machina Developer Portal](https://developer.lexmachina.com/),
you have registered this app and have received and activated an app ID and secret.

 - [My Apps: Developer Portal](https://developer.lexmachina.com/my-apps) to register and enable your app.
 - Select API "Lex Machina API Beta".
 - Generate an API key and secret.

Steps to get started:

1. Make a copy of `config/config-sample.json` to `config/config.json` and replace `client.id` and `client.secret` with your API key and secret.

    ```
   {
        "client": {
            "id": "YOUR-32-CHARACTER-API-KEY",
            "secret": "YOUR-32-CHARACTER-SECRET"
        },
         "auth": {
            "tokenHost": "https://api.beta.lexmachina.com",
            "tokenPath": "/oauth2/token"
         }
    }
    ```
   **Note**: Do not share the API secret with anyone or add it to a code repository.

2. Make a copy of `config/main-sample.json` to `config/main.json`. This is where your customizations will be stored:

    ``` 
   {
        "lawFirmId": 12345 [or the Lex Machina law firm ID number of your firm],
        "rollingDays": 90 [number of days in the past to search],
        "myFirmName": "Your Law Firm Name",
        "defaultEmail": "test@example.com [a default email address to send alerts to, useful for testing]"
    }
   ```
   
3. At the root of the project directory run `yarn install`

4. Then run `yarn start` to run the application on http://localhost:4200