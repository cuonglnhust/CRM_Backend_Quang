import { check_permission } from '../helpers/check_permission';
import { MidUser } from '../models/middle';
import { checkToken } from '../libs/token';

export const checkPermission = (action) => {
  return async (req, res, next) => {        
      try {
          let { token } = req.headers;            
          if (!token) {
              token = req.query.token;
          }          
          if (!token) {
              return res.send({
                  signal: 0,
                  code: 400,
                  message: 'Require Authen'
              });
          }
          
          if (!action) {
              return res.send({
                  signal: 0,
                  code: 400,
                  message: 'Require key permission'
              });
          }

          const dataToken = await checkToken(token)
          if (!dataToken.userid) {
              return res.send({
                  signal: 0,
                  code: 400,
                  message: 'Require Authen 1'
              });
          }
          const getData = await MidUser.getArrayPermissionOfUser(dataToken.userid)
          const {arrayPermissions,user} = getData
          const check = check_permission(action,arrayPermissions,user.role_id)
          if(check){
              next();
          }else{
              return res.send({
                  signal: 0,
                  code: 400,
                  message: 'No Permission'
              }); 
          }
      } catch(err) {
          return res.send({
              signal: 0,
              code: 400,
              message: err
          });
      }
  }
}