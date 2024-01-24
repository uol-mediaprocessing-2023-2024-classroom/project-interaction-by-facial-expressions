# Backend

## Requirements

Python 3.11.7 must be installed to ensure that the dependencies of the application are installed without any problems.<br/> You can find the installation files for Mac or Windows [here](https://www.python.org/downloads/release/python-3117/).

## Setup

To install the dependencies, execute the following command:

```shell 
pip install -r requirements.txt
```

## Start

To start the backend, first execute the following command for the socket server:

```shell 
flask --app src/main_socket run --host localhost --port 9001 --debug
```

Then the following command for the http server:

```shell 
flask --app src/main_http run --host localhost --port 9000 --debug
```

<em>Make sure that you start the servers in the order listed.</em>

The http endpoints can then be accessed at http://localhost:9000 via Postman or directly with PyCharm.<br/> To test the http endpoints, you will find an [http directory](./http) that contains predefined http requests. These can be executed with PyCharm, for example.

State: 24.01.2024
