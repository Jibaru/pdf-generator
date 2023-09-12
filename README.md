# PDF Generator

PDF generator

## Installation

1. Install docker and docker-compose.
2. Clone `.env.example` to `.env`.
3. Run a terminal on the current folder, then execute:

```
docker-compose up
```

3. Open another terminal and run (replace `https://my-valid-url.com` with your valid url):

```
curl --location 'localhost:3005' \
--header 'Content-Type: application/json' \
--data '{
    "data": "https://my-valid-url.com"
}'
```
