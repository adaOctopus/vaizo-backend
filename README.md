### AI AGENT BACKEND

This is an AI Crypto agent application that does the following things:
- Fetches onchain data
- Transcribes crypto youtube videos with different searches
- Gets hot crypto narratives and display them

![alt text](https://github.com/adaOctopus/vaizo-backend/blob/main/agentui.png)
![alt text](https://github.com/adaOctopus/vaizo-backend/blob/main/d1.png)



### How to run

1. First clone the repo locally
2. Make sure you `cd` into the directory
3. Run the following command to install dependencies 
```
npm i
```
4. If it gives you error, force it
```
npm i --force
```
5. The above should work.
6. Create a .env file
7. At the root of the project
8. And put the following variables
9. Make sure to add the .env in gitgnore, you dont want to expose the variables
```
PORT=8000
MONGODB_URI=
SECRET_KEY=THIS IS THE KEY FOR JWT KEY SIGN. create your own with a library or simple text password
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
TAVILY_API_KEY=
COIN_MCAP_API_KEY=
COIN_GECKO_API_KEY=
SERPAPI_API_KEY=
ALPHA_VANTAGE=
```
10. You can use the LLM of our choice but you would have to change a lot of code
11. I would recommend using OpenAI for this because I used that.
12. The needed variables are the following (each one explained):
```
MONGO_URI= u need that from MongoDB integration, cause im using that for collections and vectors
SECRET_KEY= this can be whatever you want, i used encryption algorithms to make it strong, is used for JWT authentication
Pick your LLM (OpenAI recommended key)
TAVILY_API_KEY= you need that for the Tavily Search engine
COINMCAP_API_KEY= you need that for fetching metrics from Coinmarket cap
SERPAPI_API_KEY= this is used for transcribing the videos, it is needed.

All these variables are need to run the agent.
```

### Important notes for the code structure

1. Everything regarding the agent tools are under ```/agent``` directory
2. Under controllers you have everything around creating and storing the data in MongoDB
3. I tried to make things as modular as possible, every agent tool is a different file that does 1 thing
4. then everything is in the ```callAgentsTool``` file.
5. Under market-indicators (controllers) you have all the fetching happening from external APIs.
6. under `agent` folder you also have the DataDocs which include all the files that are used for training the agent + the new fetched ones that come from APIs.
7. in the promptLocal file under agent directory you can check all the prompts i made.
8. Under routes and schema are the classic expressJS backend stuff. your routes and your db models.
9. You can search for ```yourlink``` and there you have to replace url based on your localhost or environment variables. That is up to you.
10. Go nuts, I had fun building this <3 I learned a ton of stuff.
