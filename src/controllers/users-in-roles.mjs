import express from 'express';
import expressJwt from 'express-jwt';
import MongoUserInRole from 'users-in-roles';
import { expressJwtOptions } from '../utils.mjs';
import { mongoUrl } from '../config.mjs';

const router = new express.Router();

// 根据appId获取用户列表
router.get(
  '/users-by-appId/:appId',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    const manager = new MongoUserInRole(mongoUrl);
    const { appId } = req.params;
    try {
      const users = await manager.usersByAppId(appId);
      res.success(users);
    } catch (e) {
      res.fail('server error', e);
    }
  },
);

// 获取用户数据
router.get(
  '/users/:appId/:userId',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    const manager = new MongoUserInRole(mongoUrl);
    const { appId, userId } = req.params;
    try {
      const user = await manager.getUser(appId, userId);
      res.success(user);
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
    const manager = new MongoUserInRole(mongoUrl);
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
router.put(
  '/roles/:appId/:userId/:role',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    const manager = new MongoUserInRole(mongoUrl);
    try {
      const { appId, userId, role } = req.params;
      const result = await manager.addRole(appId, userId, role);
      res.success(result);
    } catch (e) {
      res.fail('server error', e);
    }
  },
);

export default router;
