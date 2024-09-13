## Greenhouse Exporter

Using the Harvest API of Greenhouse, download all resumes attached to the applications. Every application will have its own folder (named after application id) containing all files attached to this application.

## How To Use

Follow the steps here to acquire an API key: https://support.greenhouse.io/hc/en-us/articles/360029266032-Harvest-API-overview?source=search (make sure to enable "List Applications" permission).  
Copy .env.example to .env and paste the API key after the "=" sign.  
NodeJS should be installed: https://nodejs.org/en/download  
Run the commands bellow (in order).

## Commands

```
npm i
npm run start
```
