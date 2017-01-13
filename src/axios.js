import axios from 'axios';
import axiosCookieJarSupport from '@3846masa/axios-cookiejar-support';

axiosCookieJarSupport(axios);

const instance = axios.create({
  jar: true
});

export default instance;
