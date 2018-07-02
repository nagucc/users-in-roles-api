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

// 附加userId到已存在的帐号中
router.post(
  '/attach/:newAppId/:newUserId/to/:oldAppId/:oldUserId',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    try {
      const {
        oldAppId, oldUserId, newAppId, newUserId,
      } = req.params;
      const result = await manager.attachUser({
        appId: oldAppId,
        userId: oldUserId,
      }, {
        appId: newAppId,
        userId: newUserId,
      });
      res.success(result);
    } catch (e) {
      console.log(e);
      res.fail('server error', e);
    }
  },
);

// 从已存在的帐号中移除userId
router.delete(
  '/detach',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    try {
      const { appId, userId } = req.body;
      info(`START DELETE /detach?appId=${appId}&userId=${userId}`);
      const result = await manager.detachUser(appId, userId);
      res.success(result);
    } catch (e) {
      error('DELETE /detach?appId=&userId=', e);
      res.fail('server error', e);
    }
  },
);

export default router;
