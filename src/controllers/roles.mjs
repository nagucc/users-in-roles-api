import express from 'express';
import expressJwt from 'express-jwt';
import uir from 'users-in-roles';
import { expressJwtOptions } from '../utils.mjs';
import { mongoUrl, collectionName, info, error } from '../config.mjs';

const router = new express.Router();
const manager = new uir.UserInRole(mongoUrl, collectionName);


// 为用户添加角色
router.post(
  '/',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    try {
      const { appId, userId, role } = req.body;
      info(`AddRole: appId=${appId}, userId=${userId}, role=${role}`);
      const result = await manager.addRole(appId, userId, role);
      res.success(result);
    } catch (e) {
      error('POST /roles/ :', e);
      res.fail('server error', e);
    }
  },
);

// 删除用户的角色
router.delete(
  '/',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    try {
      const { appId, userId, role } = req.body;
      const result = await manager.removeRole(appId, userId, role);
      res.success(result);
    } catch (e) {
      error('DELETE /roles/ :', e);
      res.fail('server error', e);
    }
  },
);

export default router;
