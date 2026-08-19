import { sign, verify } from "./token.js";

const [, , command, ...args] = process.argv;

switch (command) {
  case "sign": {
    const [sub, role] = args;
    const payload = {
      sub,
      role,
    };

    const token = sign(payload);
    console.log(`Token: ${token}`);
    break;
  }
  case "verify": {
    const [token] = args;
    try {
      const payload = verify(token);
      console.log(`Valid token: ${JSON.stringify(payload)}`);
    } catch (err) {
      console.log("Invalid token");
      console.log(err.message);
    }

    break;
  }
  default: {
    console.log("Enter valid command and arguments.");
  }
}
