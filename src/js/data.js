import { randomUserMock, additionalUsers } from "./FE4U-Lab2-mock.js";

const courses = [
  "Mathematics",
  "Physics",
  "English",
  "Computer Science",
  "Dancing",
  "Chess",
  "Biology",
  "Chemistry",
  "Law",
  "Art",
  "Medicine",
  "Statistics"
];

function getRandomCourse() {
  const index = Math.floor(Math.random() * courses.length);
  return courses[index];
}

function createId() {
  return crypto.randomUUID();
}

function formatRandomUser(user) {
  return {
    gender: user.gender,
    title: user.name.title,
    full_name: `${user.name.first} ${user.name.last}`,
    city: user.location.city,
    state: user.location.state,
    country: user.location.country,
    postcode: user.location.postcode,
    coordinates: user.location.coordinates,
    timezone: user.location.timezone,
    email: user.email,
    b_date: user.dob.date,
    age: user.dob.age,
    phone: user.phone,
    picture_large: user.picture.large,
    picture_thumbnail: user.picture.thumbnail,

    id: createId(),
    favorite: false,
    course: getRandomCourse(),
    bg_color: "#ffffff",
    note: ""
  };
}

function formatAdditionalUser(user) {
  return {
    gender: user.gender ?? null,
    title: user.title ?? null,
    full_name: user.full_name ?? null,
    city: user.city ?? null,
    state: user.state ?? null,
    country: user.country ?? null,
    postcode: user.postcode ?? null,
    coordinates: user.coordinates ?? null,
    timezone: user.timezone ?? null,
    email: user.email ?? null,
    b_date: user.b_date ?? user.b_day ?? null,
    age: user.age ?? null,
    phone: user.phone ?? null,
    picture_large: user.picture_large ?? null,
    picture_thumbnail: user.picture_thumbnail ?? null,

    id: user.id ?? createId(),
    favorite:
      typeof user.favorite === "boolean"
        ? user.favorite
        : false,
    course: user.course
      ? normalizeCourse(user.course)
      : getRandomCourse(),
    bg_color: user.bg_color ?? "#ffffff",
    note: user.note ?? ""
  };
}

function normalizeCourse(course) {
  const foundCourse = courses.find(
    item => item.toLowerCase() === course.toLowerCase()
  );

  return foundCourse ?? getRandomCourse();
}

function removeDuplicates(users) {
  const uniqueUsers = new Map();

  users.forEach(user => {
    const key =
      user.email ??
      `${user.full_name}-${user.phone}`;

    if (!uniqueUsers.has(key)) {
      uniqueUsers.set(key, user);
    }
  });

  return Array.from(uniqueUsers.values());
}

export function getFormattedUsers() {
  const formattedRandomUsers =
    randomUserMock.map(formatRandomUser);

  const formattedAdditionalUsers =
    additionalUsers.map(formatAdditionalUser);

  const allUsers = [
    ...formattedRandomUsers,
    ...formattedAdditionalUsers
  ];

  return removeDuplicates(allUsers);
}

export function validateUser(user) {
  const startsWithCapital = value => {
    return typeof value === "string" &&
      (value === "" || value[0] === value[0].toUpperCase());
  };

  const isValidEmail = email => {
    return typeof email === "string" && email.includes("@");
  };

  const phonePatterns = {
  Germany: /^\d{4}-\d{7}$/,
  Ireland: /^\d{3}-\d{3}-\d{4}$/,
  Australia: /^\d{2}-\d{4}-\d{4}$/,
  "United States": /^\(\d{3}\)-\d{3}-\d{4}$/,
  Finland: /^\d{2}-\d{3}-\d{3}$/,
  Turkey: /^\(\d{3}\)-\d{3}-\d{4}$/,
  Switzerland: /^\d{3} \d{3} \d{2} \d{2}$/,
  "New Zealand": /^\(\d{3}\)-\d{3}-\d{4}$/,
  Spain: /^\d{3}-\d{3}-\d{3}$/,
  Norway: /^\d{8}$/,
  Denmark: /^\d{8}$/,
  Iran: /^\d{3}-\d{8}$/,
  Canada: /^\d{3}-\d{3}-\d{4}$/,
  France: /^\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/,
  Netherlands: /^\(\d{3}\)-\d{3}-\d{4}$/
  };

  const isValidPhone = (phone, country) => {
  if (typeof phone !== "string") {
    return false;
  }

  if (!phonePatterns[country]) {
    return null;
  }

  return phonePatterns[country].test(phone);
  };

  return {
    name: user.full_name,
    full_name: startsWithCapital(user.full_name),
    gender: startsWithCapital(user.gender),
    note: startsWithCapital(user.note),
    state: startsWithCapital(user.state),
    city: startsWithCapital(user.city),
    country: startsWithCapital(user.country),
    age: typeof user.age === "number",
    phone: isValidPhone(user.phone, user.country),
    email: isValidEmail(user.email)
  };
}

export function filterUsers(users, country, age, gender, favorite) {
  return users.filter(user => {
    return (
      user.country === country &&
      user.age === age &&
      user.gender === gender &&
      user.favorite === favorite
    );
  });
}

export function sortUsers(users, field, order) {
  const sortedUsers = [...users];

  sortedUsers.sort((a, b) => {
    let result;

    if (field === "age") {
      result = a.age - b.age;
    } else if (field === "b_date") {
      result = new Date(a.b_date) - new Date(b.b_date);
    } else {
      result = String(a[field]).localeCompare(String(b[field]));
    }

    return order === "desc" ? -result : result;
  });

  return sortedUsers;
}

export function findUser(users, field, value) {
  return users.find(user => {
    if (field === "age") {
      return user.age === Number(value);
    }

    if (field === "full_name" || field === "note") {
      return String(user[field])
        .toLowerCase()
        .includes(String(value).toLowerCase());
    }

    return false;
  });
}

export function getSearchPercentage(users, comparator) {
  if (users.length === 0) {
    return 0;
  }

  const matchedUsers = users.filter(comparator);

  return Math.round((matchedUsers.length / users.length) * 100);
}