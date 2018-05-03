const bcrypt = require('bcrypt-nodejs');

let users = {
  lemon: {
    username: "lemon",
    password: "$2a$16$SsR2TGPD24nfBpyRlBzINeGU61AH0Yo/CbgfOlU1ajpjnPuiQaiDm",
    firstName: "Elizabeth",
    lastName: "Lemon",
    profession: "Writer",
    bio: "Elizabeth Miervaldis 'Liz' Lemon is the main character of the American television series 30 Rock. She created and writes for the fictional comedy-sketch show The Girlie Show or TGS with Tracy Jordan."
  }
}

module.exports = {
  getUserByUsername: (username) => {
    return users[username];
  },

  verifyUserPassword: (username, password) => {
    let user = users[username];
    if(!user){
      return {
        status: false,
        message: "Username invalid"
      };
    }
    else if(!bcrypt.compareSync(password, user.password)){
      return {
        status: false,
        message: "Incorrect password"
      };
    }else {
      return {
        status: true,
        message: `${username} ${password}`
      };
    }
  }
}
