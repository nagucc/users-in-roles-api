import express from 'express';
import expressJwt from 'express-jwt';
import uir from 'users-in-roles';
import { expressJwtOptions } from '../utils.mjs';
import { mongoUrl, collectionName, appsCol, info, error } from '../config.mjs';

const router = new express.Router();
const manager = new uir.UserInRole(mongoUrl, collectionName);
const appsManager = new uir.Apps(mongoUrl, appsCol);

// 获取应用列表
router.get(
  '/',
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

export default router;
