export const ACCESS_TOKEN_EXPIRE = '3h';
export const REFRESH_TOKEN_EXPIRE = '4w';
export const EMAIL_TOKEN_EXPIRE = '3m';
export const OAUTH_REDIRECT_URI = `https://api.instagram.com/oauth/authorize?client_id=957565182609778&redirect_uri=${process.env.BASE_URL}/auth/oauth/instagram/redirect/&scope=user_profile,user_media&response_type=code`;

//https://api.instagram.com/oauth/authorize?client_id=957565182609778&redirect_uri=https://localhost/auth/oauth/instagram-redirect&scope=user_profile,user_media&response_type=code
