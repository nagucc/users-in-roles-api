import express from 'express';
import expressJwt from 'express-jwt';
import uir from 'users-in-roles';
import { expressJwtOptions } from '../utils.mjs';
import { mongoUrl, collectionName, info, error } from '../config.mjs';

const router = new express.Router();
const manager = new uir.UserInRole(mongoUrl, collectionName);

// 根据appId获取用户列表
router.get(
  '/by-appid/:appId',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    const { appId } = req.params;
    try {
      const users = await manager.usersByAppId(appId);
      res.success(users);
    } catch (e) {
      error('/by-appid/:', e);
      res.fail('server error', e);
    }
  },
);

export default router;
