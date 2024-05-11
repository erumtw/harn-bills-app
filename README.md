# Harn Bills

easy bill split with your friend, mobile app 
หารบิลกับเพื่อนๆ 

### this project i use https://mockapi.io/ 
### Add your mock api
add `api_endpoints.js` to dir `/home/erumtw/Projects/react native/react-native-plain/HarnBills/src/api/constant/api_endpoints.js`

```js
export const userEndpoint =
  'yourendpoint/users';
  
export const groupEndpoint =
  'yourendpoint/groups';
```

## mock data 
### users
```json
[
  {
    "username": "test",
    "total_paid": 0, // actually not use
    "id": "1"
  },
  {
    "username": "jiff",
    "total_paid": 0, // actually not use
    "id": "2"
  }
]
```
### group
bill data
```json
[
  {
    "id": "1",
    "is_all_paid": true,
    "group_name": "shabu",
    "members": [
      "Alice",
      "Bob",
      "Charlie"
    ],
    "items": [
      {
        "title": "beef",
        "price": 520,
        "divider": [
          "Alice",
          "Bob",
          "Charlie"
        ]
      },
      {
        "title": "ice",
        "price": 15,
        "divider": [
          "Bob"
        ]
      }
    ]
  },
  {
    "id": "2",
    "is_all_paid": true,
    "group_name": "pizza night",
    "members": [
      "Alice",
      "Dave",
      "Eve"
    ],
    "items": [
      {
        "title": "Margherita Pizza",
        "price": 1200,
        "divider": [
          "Alice",
          "Dave",
          "Eve"
        ]
      }
    ]
  }
]
```

