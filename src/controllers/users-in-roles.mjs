import express from 'express';
import expressJwt from 'express-jwt';
import uir from 'users-in-roles';
import { expressJwtOptions } from '../utils.mjs';
import { mongoUrl, collectionName, applyCol, info, error } from '../config.mjs';

const router = new express.Router();
const manager = new uir.UserInRole(mongoUrl, collectionName);
const apply = new uir.Apply(mongoUrl, applyCol);
const appsManager = new uir.Apps(mongoUrl, applyCol);

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

// 获取用户数据
router.get(
  '/users/:appId/:userId',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    const { appId, userId } = req.params;
    info(`START GetUser: appId=${appId}, userId=${userId}`);
    try {
      const user = await manager.getUser(appId, userId);
      res.success(user);
    } catch (e) {
      res.fail('server error', e);
    }
  },
);

// 获取应用列表
router.get(
  '/apps',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    try {
      const appIds = await manager.apps();
      const apps = await appsManager.list();
      res.success(appIds.map((appId) => {
        const app = apps.find(app => app.appId === appId) || {};
        let name = appId;
        if (app.name) name = app.name;
        return {
          appId,
          name,
        };
      }));
    } catch (e) {
      res.fail('server error', e);
    }
  },
);

// 添加用户
router.put(
  '/users/:appId/:userId',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    try {
      const { appId, userId } = req.params;
      const user = await manager.insertUser(appId, userId);
      res.success(user);
    } catch (e) {
      res.fail('server error', e);
    }
  },
);

// 为用户添加角色
router.post(
  '/roles/:appId/:userId/:role',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    try {
      const { appId, userId, role } = req.params;
      info(`AddRole: appId=${appId}, userId=${userId}, role=${role}`);
      const result = await manager.addRole(appId, userId, role);
      res.success(result);
    } catch (e) {
      res.fail('server error', e);
    }
  },
);

// 删除用户的角色
router.delete(
  '/roles/:appId/:userId/:role',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    try {
      const { appId, userId, role } = req.params;
      const result = await manager.removeRole(appId, userId, role);
      res.success(result);
    } catch (e) {
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
  '/detach/:appId/:userId',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    try {
      const { appId, userId } = req.params;
      const result = await manager.detachUser(appId, userId);
      res.success(result);
    } catch (e) {
      error('/detach/:appId:/userId:', e);
      res.fail('server error', e);
    }
  },
);

// 添加申请记录
router.put(
  '/apply/:appId/:userId',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    try {
      const { appId, userId } = req.params;
      const result = await apply.insertApply(appId, userId, req.body);
      res.success(result);
    } catch (e) {
      error('/apply/:appId:', e);
      res.fail('server error', e);
    }
  },
);

// 获取app列表
router.get(
  '/apps',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    try {
      const result = await appsManager.list();
      res.success(result);
    } catch (e) {
      error('/apps:', e);
      res.fail('server error', e);
    }
  },
);

export default router;
