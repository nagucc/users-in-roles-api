import express from 'express';
import expressJwt from 'express-jwt';
import uir from 'users-in-roles';
import { expressJwtOptions } from '../utils.mjs';
import { mongoUrl, applyCol, info, error } from '../config.mjs';

const router = new express.Router();
const apply = new uir.Apply(mongoUrl, applyCol);

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

// 获取申请列表
router.get(
  '/apply',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    try {
      const result = await apply.list();
      res.success(result);
    } catch (e) {
      error('/apply', e);
      res.fail('server error', e);
    }
  },
);

// 删除申请
router.delete(
  '/apply/:appId/:userId',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    try {
      const { appId, userId } = req.params;
      const result = await apply.remove(appId, userId);
      res.success(result);
    } catch (e) {
      error('DELETE /apply/:appId/:userId ', e);
      res.fail('server error', e);
    }
  },
);

export default router;
