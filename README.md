<div align="center" id="top"> 
  <img src="./.github/app.gif" alt="Server_proj_bio" />

  &#xa0;

  <!-- <a href="https://server_proj_bio.netlify.app">Demo</a> -->
</div>

<h1 align="center">Server_proj_bio</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/Heur-a/server_proj_bio?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/Heur-a/server_proj_bio?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/Heur-a/server_proj_bio?color=56BEB8">

  <img alt="License" src="https://img.shields.io/github/license/Heur-a/server_proj_bio?color=56BEB8">

  <!-- <img alt="Github issues" src="https://img.shields.io/github/issues/Heur-a/server_proj_bio?color=56BEB8" /> -->

  <!-- <img alt="Github forks" src="https://img.shields.io/github/forks/Heur-a/server_proj_bio?color=56BEB8" /> -->

  <!-- <img alt="Github stars" src="https://img.shields.io/github/stars/Heur-a/server_proj_bio?color=56BEB8" /> -->
</p>

<!-- Status -->

<!-- <h4 align="center"> 
	🚧  Server_proj_bio 🚀 Under construction...  🚧
</h4> 

<hr> -->

<p align="center">
  <a href="#dart-about">About</a> &#xa0; | &#xa0; 
  <a href="#sparkles-features">Features</a> &#xa0; | &#xa0;
  <a href="#rocket-technologies">Technologies</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-starting">Starting</a> &#xa0; | &#xa0;
  <a href="#memo-license">License</a> &#xa0; | &#xa0;
  <a href="https://github.com/Heur-a" target="_blank">Author</a>
</p>

<br>

## :dart: About ##

This is an API REST server intended to get readings from a mobile gas detector and store them in a MySQL database

This project includes a barebones web server only intended to show the container is running

This repository is part of a project form the GTI 3A course

## :memo: Documentation 

The api documentation can be viewed either on the doc folder or when running the application under the <https://localhost:PORT/api-docs>

## :rocket: Technologies 

The following tools were used in this project:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/en/)
- [MySQL](https://www.mysql.com/)

## :white_check_mark: Requirements 

Before starting :checkered_flag:, you need to have [Git](https://git-scm.com) and [Docker](https://www.docker.com/) installed.

A ``` .env ``` needs to be created in on the root folder of the project in order to get the container running, with these variables set:

```MYSQLDB_ROOT_PASSWORD``` Password for the root user for mysql
```MYSQLDB_USER```          Database user used by the node server
```MYSQLDB_PASSWORD```       Database user password
````MYSQLDB_PORT```` Port where mysql will be listening externally 
```MYSQLDB_HOST``` The name of the myql host. Should be ```mysql```
```MYSQLDB_DATABASE``` Name of the database the node server will connect to
```PORT``` Port where the API REST and Web server will be listening to

An example .env file named as ```.env.example``` can be found on the root folder of the project. If you want to use this file, rename the file as ```.env``` and the project will be able to run



## :checkered_flag: Starting 

```bash
# Clone this project
$ git clone https://github.com/Heur-a/server_proj_bio

# Access
$ cd server_proj_bio

# We create the .env file with the required parameters
$ <text-editor> .env

# Build project
$ docker compose build

# Run the project
$ docker compose up

# The API REST server will initialize in the <http://localhost:PORT>
```

The mysql instance will start with a database, mock entries and user priviliges set in the ```src/mysql-init/``` folder

If changed, the API container won't be able to comunicate to the MySQL database. The SQL scripts containing each API request can be found on the ```src/sql/``` folder

## :memo: License 

This project is under license from MIT. For more details, see the [LICENSE](LICENSE.md) file.


Made with :heart: by <a href="https://github.com/Heur-a" target="_blank">Heura</a>

&#xa0;

<a href="#top">Back to top</a>
