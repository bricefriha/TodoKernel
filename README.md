# TodoKernel 
You want to create a todolist app without bothering too much with a backend code. Here's how TodoKernel can help you! 😃

TodoKernel is an API ready to go allowing you to create todolists. Then all you have to do  is to create a sweat little UI that fit your need! 😊 ("have to do", "todo" you get it? 😅)

---
## Index 📖
- [Todo Kernel](#todo-kernel)
- [Installation](#installation)
- [Api methods](#api-methods)
  - [Index 📖](#index-)
  - [Registration 🔑](#registration-)
  - [Authentification 🙋🏽‍♂️🙋🏽‍♀️](#authentification-️️)
  - [Update user's informations 🙍🏽‍♂️🙍🏽‍♀️✍🏽](#update-users-informations-️️)
  - [Get user's informations 🙍🏽‍♂️🙍🏽‍♀️](#get-users-informations-️️)
  - [Delete current user 🗑🙍🏽‍♂️🙍🏽‍♀️](#delete-current-user-️️)
  - [Create a todolist 📝](#create-a-todolist-)
  - [Add an item to a todolist ✏](#add-an-item-to-a-todolist-)
  - [Delete an item from a todolist 🗑✏](#delete-an-item-from-a-todolist-)
  - [Get all your todolists 📚](#get-all-your-todolists-)
  - [Check or uncheck a todolist item ✅❎📄](#check-or-uncheck-a-todolist-item-)
  - [Rename a todolist item ✍🏽📄](#rename-a-todolist-item-)
  - [Delete a todolist item 🗑📚](#delete-a-todolist-item-)
  - [Rename a todolist item ✍🏽📚](#rename-a-todolist-item--1)
  - [Delete a todolist 🗑📚](#delete-a-todolist-)
  - [Delete all current's user todolists 🗑📚📚📚📚](#delete-all-currents-user-todolists-)

---
## Installation

> **Make sure that node is installed on your machine/server** 😉

1. The very first step is to install is to fetch the TodoKernel project. To do so, you can:

	Clone the project via git, by running the following command:
	
	```  git clone https://github.com/bricefriha/TodoKernel.git ```
	
	If you don't have git installed you can still [download](https://github.com/bricefriha/TodoKernel/archive/master.zip) the project.
	
2. Next you'll have to install all the required npm packages. Thus, move to the TodoKernel folder an run this command:

	``` npm install ```
	
3. Now all you have to do is starting your app
	
	``` npm start ```

4. Finally, the most important part: Enjoy! 😀


## Api methods

### Registration 🔑

**Request type**: POST

**route**: ``  "/users/register" ``

**body**:
```
{
    "firstName": "BriceFriha",
    "lastName": "BriceFriha",
    "username": "BriceFriha",
    "password": "pwd"
}
```

**response**: 
```
{
    "user": "BriceFriha",
    "firstName": "BriceFriha",
    "lastName": "BriceFriha",
    "todolists": [
        // user's todolists
    ],
    "token": "<your token>"
}
```
---

### Authentification 🙋🏽‍♂️🙋🏽‍♀️

**Request type**: POST

**route**: ``"/users/authenticate"``

**body**: 
``` 
{
    "username": "BriceFriha",
    "password": "pwd"
}
```

**response**: 
```
{
    "user": "BriceFriha",
    "firstName": "BriceFriha",
    "lastName": "BriceFriha",
    "todolists": [
        // user's todolists
    ],
    "token": "<your token>"
}
```
---

### Update user's informations 🙍🏽‍♂️🙍🏽‍♀️✍🏽

> ⚠ **You must use a bearer token to perform this action**

**Request type**: PUT

**route**: ``  "/users/register" ``

**body**:
```
{
	"username": "JustinC",
	"firstName": "Justin",
	"lastName": "Case",
    	"newPassword": "TheNewPassword",
	"password": "TheOldPassword"
	
}
```
> ℹ  If you don't want to modify the password, just don't fill the "newPassword" field

**response**: 
```
{
    "status": "OK",
    "result": "Changes saved"
}
```
---
### Get user's informations 🙍🏽‍♂️🙍🏽‍♀️

> ⚠ **You must use a bearer token to perform this action**

**Request type**: GET

**route**: ``  "/users/current" ``

**body**:
```
{
	"username": "JustinC",
	"firstName": "Justin",
	"lastName": "Case",
	"password": "pass"
	
}
```

### Delete current user 🗑🙍🏽‍♂️🙍🏽‍♀️

> ⚠ **You must use a bearer token to perform this action**

**Request type**: DELETE

**route**: ``"/users/current"``

**response**: 
```
{
    "status": "OK",
    "result": " deleted"
}
```
---
### Create a todolist 📝

> ⚠ **You must use a bearer token to perform this action**

**Request type**: POST

**route**: ``"/todolists/create"``

**body**: 
``` 
{
	"title":"Shopping list"
}
```

**response**: 
```
{
    "items": [],
    "_id": "5ed7f3d335670f2f348c8cbc",
    "title": "Shopping list",
    "user": "5ecd5cb5048a7231d8ddbb15",
    "__v": 0
}
```
---
### Add an item to a todolist ✏

> ⚠ **You must use a bearer token to perform this action**

**Request type**: POST

**route**: ``"/todolists/create"``

**body**: 
``` 
{
	"name":"Eggs",
	"todolistId": "5ed7f3d335670f2f348c8cbc"
}
```

**response**: 
```
{
    "_id": "5ed7f43f35670f2f348c8cbd",
    "name": "Eggs",
    "done": false,
    "todolist": "5ed7f3d335670f2f348c8cbc",
    "user": "5ecd5cb5048a7231d8ddbb15",
    "__v": 0
}
```
---
### Delete an item from a todolist 🗑✏

> ⚠ **You must use a bearer token to perform this action**

**Request type**: DELETE

**route**: ``"/todos/[item id]"``

**response**: 
```
{
    "status": "OK",
    "result": " deleted"
}
```
---
### Get all your todolists 📚

> ⚠ **You must use a bearer token to perform this action**

**Request type**: GET

**route**: ``"/todolists/"``

**response**: 
```
[
    {
        "items": [
            {
                "_id": "5ed3861f5151de45f4b637e3",
                "name": "Fries",
                "done": false,
                "todolist": "5ed385135151de45f4b637df",
                "user": "5ecd5cb5048a7231d8ddbb15",
                "__v": 0
            }
        ],
        "_id": "5ed385135151de45f4b637df",
        "title": "Shopping list",
        "user": "5ecd5cb5048a7231d8ddbb15",
        "__v": 2
    },
    {
        "items": [
            {
                "_id": "5ed7f43f35670f2f348c8cbd",
                "name": "Eggs",
                "done": false,
                "todolist": "5ed7f3d335670f2f348c8cbc",
                "user": "5ecd5cb5048a7231d8ddbb15",
                "__v": 0
            }
        ],
        "_id": "5ed7f3d335670f2f348c8cbc",
        "title": "Shopping list",
        "user": "5ecd5cb5048a7231d8ddbb15",
        "__v": 1
    }
]
```
---
### Check or uncheck a todolist item ✅❎📄

> ⚠ **You must use a bearer token to perform this action**

**Request type**: PUT

**route**: ``"/todos/rename/[Todolist id]"``

**response**: 
```
{
    "status": "OK"
}
```
---
### Rename a todolist item ✍🏽📄

> ⚠ **You must use a bearer token to perform this action**

**Request type**: PUT

**Route**: ``"/todos/rename/[Todolist id]"``

**Body**: 
```
{
	"name": "Fries"
}
```

**Response**: 
```
{
	"name": "Fries"	
}
```
---
### Delete a todolist item 🗑📚

> ⚠ **You must use a bearer token to perform this action**

**Request type**: DELETE

**route**: ``"/todos/[Todolist id]"``

**response**: 
```
{
    "status": "OK",
    "result": " deleted"
}
```
---
### Rename a todolist item ✍🏽📚

> ⚠ **You must use a bearer token to perform this action**

**Request type**: PUT

**Route**: ``"/todolists/rename/[Todolist id]"``

**Body**: 
```
{
	"title": "Workout"
	
}
```

**Response**: 
```
{
    "items": [
        
    ],
    "_id": "5ed7f3d335670f2f348c8cbc",
    "title": "Workout",
    "user": "5ecd5cb5048a7231d8ddbb15",
    "__v": 2
}
```
---
### Delete a todolist 🗑📚

> ⚠ **You must use a bearer token to perform this action**

**Request type**: DELETE

**route**: ``"/todolists/[Todolist id]"``

**response**: 
```
{
    "status": "OK",
    "result": " deleted"
}
```
---
### Delete all current's user todolists 🗑📚📚📚📚

> ⚠ **You must use a bearer token to perform this action**

**Request type**: DELETE

**route**: ``"/users/cleanup"``

**response**: 
```
{
    "status": "OK",
    "result": " deleted"
}
```




