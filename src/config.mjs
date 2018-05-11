import debug from 'debug';

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
export const secret = process.env.SECRET || 'secret';

export const info = debug('uir-api:info');
export const error = debug('uir-api:error');

export const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/uir';
export const collectionName = process.env.COL_NAME || 'user_in_role';
export const applyCol = process.env.APPLY_COL_NAME || 'uir_apply';
export const appsCol = process.env.APPS_COL_NAME || 'uir_apps';
