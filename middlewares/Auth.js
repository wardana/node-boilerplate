import jwtDecode from 'jwt-decode';
import Settings from 'settings';

const constant = new Settings(`${__dirname}/../config/constant`);
const config = new Settings(`${__dirname}/../config/config`);


class Auth {

  /**
   * auth handler
   * @param {string} req.headers['Authorization']  
   */
  ensureAuth (req, res, next) {
    const token = req.headers['x-access-token'];

    if(token){
      const user = jwtDecode(token);
      let dateNow = Date.now();
      if(user){
        if(user.exp < dateNow){
          res.status(401).json({ "message" : "Can't Process Your Request Because The token is invalid, expired or not found" });
        }else {
          req.pipa.user = JSON.parse(user.jti);
          next();
        }
      }else{
        res.status(401).json({ "message" : "Can't Process Your Request Because The token is invalid, expired or not found" });
      }
    }else {
      res.status(401).json({ "message" : "Can't Process Your Request Because The token is invalid, expired or not found" });
    }
  }

}
module.exports = new Auth();
