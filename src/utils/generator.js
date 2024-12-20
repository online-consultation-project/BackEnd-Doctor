const passwordGenerator = (length) => {
  const characters =
    "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890@#$&";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  console.log(password);
  
  return password;
};

module.exports = { passwordGenerator };
