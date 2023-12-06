# Backend

## Setup

First install the dependencies. To do this, execute the following command:

```shell 
pip install -r requirements.txt
```

## Start

To start the backend, execute first the following command:

```shell 
flask --app src/main_socket run --host localhost --port 9001 --debug
```

And then the following command:

```shell 
flask --app src/main_http run --host localhost --port 9000 --debug
```

<em>Please note that the starting order must be strictly complied to.</em>

The http backend can then be accessed at http://localhost:9000 via Postman or directly with PyCharm.

The http directory contains http requests to test the endpoints with PyCharm.

State: 05.12.2023
