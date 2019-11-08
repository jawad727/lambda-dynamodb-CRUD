# lambda-dynamodb-CRUD
Full CRUD with lambda and dynamoDB (more practice)


GET all -> https://hiffvl9nb9.execute-api.us-east-1.amazonaws.com/dev/posts

GET by id -> https://hiffvl9nb9.execute-api.us-east-1.amazonaws.com/dev/post/{id}

GET by number -> https://hiffvl9nb9.execute-api.us-east-1.amazonaws.com/dev/posts/{number}

DEL by id -> https://hiffvl9nb9.execute-api.us-east-1.amazonaws.com/dev/post/{id}

POST {
	"title": "Example Text",
	"body": "Example Text" } ->  https://hiffvl9nb9.execute-api.us-east-1.amazonaws.com/dev/post

PUT {
	"paramName": "changed",
	"paramValue": "The second post" } -> https://hiffvl9nb9.execute-api.us-east-1.amazonaws.com/dev/post/{id}