import express from 'express';
import expressJwt from 'express-jwt';
import uir from 'users-in-roles';
import { expressJwtOptions } from '../utils.mjs';
import { mongoUrl, collectionName, info, error } from '../config.mjs';


const router = new express.Router();
const manager = new uir.UserInRole(mongoUrl, collectionName);

// 获取用户数据
router.get(
  '/',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    const { appId, userId } = req.query;
    info(`START GetUser: appId=${appId}, userId=${userId}`);
    try {
      const user = await manager.getUser(appId, userId);
      info(`END GetUser: appId=${appId}, userId=${userId}, result: ${JSON.stringify(user)}`);
      res.success(user);
    } catch (e) {
      error(e);
      res.fail('server error', e);
    }
  },
);

// 添加用户
router.put(
  '/',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    try {
      const { appId, userId } = req.body;
      info(`start PUT /user, data: appId=${appId}, userId=${userId}`);
      const user = await manager.insertUser(appId, userId);
      res.success(user);
    } catch (e) {
      error(e);
      res.fail('server error', e);
    }
  },
);

export default router;
