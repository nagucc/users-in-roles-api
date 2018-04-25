export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
export const secret = process.env.SECRET || 'secret';

export const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/uir';
export const collectionName = process.env.COL_NAME || 'user-in-role';
