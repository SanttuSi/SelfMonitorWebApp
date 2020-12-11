


## About The Project


This project was done during the the course "web software development" in Aalto University. This application is a tool for self monitoring and summarizing data. The project github can be found at https://github.com/SanttuSi/SelfMonitorWebApp 

### Built With

This project was built with Deno and some frameworks within deno that are listed in the deps.js file. The application has HTML and js.

## Getting Started

The application is deployed to https://deno-self-monitor-application.herokuapp.com/. If you want to run the server locally, you will need deno and a database that uses postgreSQL.


### Server installation

1. Install Deno (instructions can be found online)
3. Create databases in postgreSQL with these commands:
```SQL
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password CHAR(60) NOT NULL
);
CREATE TABLE evenings (
	id bigint PRIMARY KEY,
	user_id INTEGER REFERENCES users(id),
	date DATE,
	sports NUMERIC(5,2),
	reqularity INT,
	food  INT,
	mood INT,
	study INT
);
CREATE TABLE mornings (
	id bigint PRIMARY KEY,
	user_id INTEGER REFERENCES users(id),	
	date DATE,
	sleep NUMERIC(5,2),
	sleepQuality  INT,
	mood INT
);
ALTER TABLE mornings
ADD CONSTRAINT U_ID UNIQUE (id);
ALTER TABLE evenings
ADD CONSTRAINT U_IDD UNIQUE (id);
   ```
3. Clone the repo
 ```sh
 git clone https://https://github.com/SanttuSi/SelfMonitorWebApp.git
 ```
4. Set the database's maximum concurrent connections (e.g 4) and input the required database parameters in the file config/config.js
 ```js
const CONCURRENT_CONNECTIONS = 4;
if (Deno.env.get('TEST_ENVIRONMENT')) {
    config.database= new Pool({
      hostname: Deno.env.get('PGHOST'),
      database: Deno.env.get('PGDATABASE'),
      user: Deno.env.get('PGDATABASE'),
      password: Deno.env.get('PGPASSWORD'),
      port: 5432  
     },CONCURRENT_CONNECTIONS);
} else {
  config.database = new Pool ({
    hostname: "some-address",
    database: "some-database",
    user: "some-database",
    password: "my-password",
    port: 5432},CONCURRENT_CONNECTIONS);
}
  
 ```
5. Start the server from the root with
 ```sh
 deno run --allow-read --allow-net --allow-env --unstable app.js
 ```
## Running unit tests 
1. Run the tests by navigating into the root folder of the server and then run the command (with a valid DB) or by manually entering the test DB into the test database.
```sh
 PGHOST='some-address' PGDATABASE='some-database' PGPASSWORD='my-password' deno test --allow-read --allow-net --allow-env --unstable 
 ```
2. If all tests succeed, you have to manually quit testing by pressing CTRL+C.

## Usage

Now that the server is up, you can connect to the locally ran server at http://localhost:7777/.
From here on the UI explains a lot of the functionality.




## License

Distributed under the MIT License. See `LICENSE` for more information.




## Creators

 Santeri Sipilä - santeri.sipila@aalto.fi  






