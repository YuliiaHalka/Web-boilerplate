import {
  getFormattedUsers,
  validateUser,
  filterUsers,
  sortUsers,
  findUser,
  getSearchPercentage
} from "./data.js";

const users = getFormattedUsers();

console.log(users);

users.forEach((user, index) => {
  console.log(index, validateUser(user));
});

const country = "Germany";
const age = 65;
const gender = "male";
const favorite = false;

const filteredUsers = filterUsers(
  users,
  country,
  age,
  gender,
  favorite
);

console.log("Filtered users:", filteredUsers);

const sortField = "age";
const sortOrder = "asc";

const sortedUsers = sortUsers(
  users,
  sortField,
  sortOrder
);

console.log("Sorted users:", sortedUsers);

const searchField = "full_name";
const searchValue = "Norbert";

const foundUser = findUser(
  users,
  searchField,
  searchValue
);

console.log("Found user:", foundUser);

const percentage = getSearchPercentage(
  users,
  user => user.age > 30
);

console.log(percentage);