export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
export const secret = process.env.SECRET || 'secret';

export const mongoUrl = 'mongodb://localhost/uir';
