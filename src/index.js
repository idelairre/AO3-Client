import axios from 'axios';
import axiosCookieJarSupport from '@3846masa/axios-cookiejar-support';
import cheerio from 'cheerio';
import qs from 'qs';

function strip(string) {
  return string.replace(/\r?\n|\r/, '').trim();
}

function has(object, property) {
  return {}.hasOwnProperty.call(object, property);
}

function defaults(object, defaultObj) {
  for (let key in defaultObj) {
    if (!object[key]) {
      object[key] = defaultObj[key];
    }
  }
  return object;
}

// function isNode() {
//   return Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
// }
//
// function getDefaultAdapter() {
//   let adapter;
//   if (isNode()) {
//     // For node use HTTP adapter
//     adapter = require('axios/lib/adapters/http');
//   } else {
//     // For browsers use XHR adapter
//     adapter = require('axios/lib/adapters/xhr');
//   }
//   return adapter;
// }

axiosCookieJarSupport(axios);

const settings = {
  withCredentials: true,
  jar: true
};

const instance = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  ...settings
});

export default class AO3 {
  static site = 'http://archiveofourown.org';
  static user = null;
  static userId = null;
  static token = null;
  static credentials = {};

  static setCredentials({ user, password }) {
    AO3.credentials = {
      user,
      password
    };
  }

  static async getToken(endpoint) {
    const response = await instance.get(`${AO3.site}/${endpoint ? endpoint : 'login'}`);
    const $ = cheerio.load(response.data);
    const token = $('meta[name="csrf-token"]').attr('content');
    return Promise.resolve(token);
  }

  static getResponseMeta(response) {
    const { status, statusText, headers, config } = response;

    return {
      status, statusText, headers, config
    };
  }

  static async login({ user, password }) {
    const token = await AO3.getToken();
    const credentials = qs.stringify({
      utf8: '✓',
      authenticity_token: token,
      user_session: {
        login: user,
        password
      },
      commit: 'Log In'
    });
    const endpoint = `${AO3.site}/user_sessions`;

    try {
      const response = await instance.post(endpoint, credentials, settings);
      const $ = cheerio.load(response.data);
      const user = strip($('#main').find('div.user').find('div.primary').find('h2.heading').text());

      AO3.user = user;

      return response;
    } catch (err) {
      return err;
    }
  }

  static async userDashboard() {
    if (!AO3.user) {
      await AO3.login(AO3.credentials);
    }

    const endpoint = `${AO3.site}/users/${AO3.user}`;
    const response = await instance.get(endpoint, settings);
    const $ = cheerio.load(response.data);
    const user = strip($('#main').find('div.primary').find('h2.heading').text());
    // TODO: get all list items on page, e.g., works, bookmarks, etc...
    return user;
  }

  static async updateUserProfile({
    aboutMe, location, title, dateOfBirth: { year, month, day }
  } = {
    aboutMe: '', location: '', title: '', dateOfBirth: { year: '', month: '', day: '' }
  }) {
    if (!AO3.user) {
      await AO3.login(AO3.credentials);
    }

    const token = await AO3.getToken();
    const params = qs.stringify({
      _method: 'put',
      authenticity_token: token,
      commit: 'Update',
      profile_attributes: {
        title,
        location,
        'date_of_birth(1i)': year,
        'date_of_birth(2i)': month,
        'date_of_birth(3i)': day,
        about_me: aboutMe
      }
    });
    const endpoint = `${AO3.site}/users/${AO3.user}`;

    try {
      const response = await instance.post(endpoint, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        ...settings
      });
      return response;
    } catch (err) {
      return err;
    }
  }

  // endpoint: http://archiveofourown.org/users/:user/pseuds/(:user||:pseud)
  // query params:
  // ------WebKitFormBoundary0mgwpDVnU8GZBVxr
  // Content-Disposition: form-data; name="utf8"
  //
  // ✓
  // ------WebKitFormBoundary0mgwpDVnU8GZBVxr
  // Content-Disposition: form-data; name="_method"
  //
  // put
  // ------WebKitFormBoundary0mgwpDVnU8GZBVxr
  // Content-Disposition: form-data; name="authenticity_token"
  //
  // 1nPa04CL7ohTd5CpYabEccdXyHsdMiWtFp02mqM1fVc=
  // ------WebKitFormBoundary0mgwpDVnU8GZBVxr
  // Content-Disposition: form-data; name="pseud[description]"
  //
  //
  // ------WebKitFormBoundary0mgwpDVnU8GZBVxr
  // Content-Disposition: form-data; name="pseud[icon]"; filename="sombra___overwatch___fanart_by_nell_fallcard-daplf8u.jpg"
  // Content-Type: image/jpeg
  //
  //
  // ------WebKitFormBoundary0mgwpDVnU8GZBVxr
  // Content-Disposition: form-data; name="pseud[icon_alt_text]"
  //
  //
  // ------WebKitFormBoundary0mgwpDVnU8GZBVxr
  // Content-Disposition: form-data; name="pseud[icon_comment_text]"
  //
  //
  // ------WebKitFormBoundary0mgwpDVnU8GZBVxr
  // Content-Disposition: form-data; name="commit"
  //
  // Update
  // ------WebKitFormBoundary0mgwpDVnU8GZBVxr--

  static updateUserPseud() { }

  // endpoint:
  static async updateUserName(newUserName) {
    if (!AO3.user) {
      await AO3.login(AO3.credentials);
    }

    const token = await AO3.getToken();
    const params = qs.stringify({
      utf8: '✓',
      authenticity_token: token,
      new_login: newUserName,
      password: AO3.credentials.password,
      commit: 'Change User Name'
    });
    const endpoint = `${AO3.site}/users/${AO3.user}/changed_username`;

    try {
      const response = await instance.post(endpoint, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        ...settings
      });
      return response;
    } catch (err) {
      return err;
    }
  }

  static async updatePassword(password) {
    if (!AO3.user) {
      await AO3.login(AO3.credentials);
    }

    const token = await AO3.getToken();
    const params = qs.stringify({
      utf8: '✓',
      authenticity_token: token,
      password,
      password_confirmation: password,
      password_check: AO3.credentials.password,
      commit: 'Change Password'
    });
    const endpoint = `${AO3.site}/users/${AO3.user}/changed_password`;

    try {
      const response = await instance.post(endpoint, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        ...settings
      });

      return response;
    } catch (err) {
      return err;
    }
  }

  static async updateEmail({ newEmail }) {
    if (!AO3.user) {
      await AO3.login(AO3.credentials);
    }
    const token = await AO3.getToken();
    const params = qs.stringify({
      utf8: '✓',
      authenticity_token: token,
      new_email: newEmail,
      email_confirmation: newEmail,
      password_check: AO3.password,
      commit: 'Change Email'
    });
    const endpoint = `${AO3.site}/users/${AO3.user}/changed_email`;

    try {
      const response = await instance.post(endpoint, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        ...settings
      });

      return response;
    } catch (err) {
      return err;
    }
  }

  static async updatePreferences(preferences) {
    if (!AO3.user) {
      await AO3.login(AO3.credentials);
    }

    const token = await AO3.getToken();
    const { data } = await AO3.getPreferences();

    preferences = defaults(preferences, data);

    const params = qs.stringify({
      utf8: '✓',
      _method: 'put',
      authenticity_token: token,
      preference: preferences,
      commit: 'Update'
    });
    const endpoint = `${AO3.site}/preferences/update?user_id=${AO3.user}`;

    try {
      const response = await instance.post(endpoint, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        ...settings
      });
      return response;
    } catch (err) {
      return err;
    }
  }

  static async getPreferences() {
    if (!AO3.user) {
      await AO3.login(AO3.credentials);
    }
    const endpoint = `${AO3.site}/users/${AO3.user}/preferences`;
    const response = await instance.get(endpoint, settings);
    const $ = cheerio.load(response.data);
    let preferences = $('#main').find('form').find('fieldset').map(function (i, el) {
      const heading = $(this).find('legend').text();
      if (heading && heading !== 'Actions') {
        return $(this).find('ul').find('li').map(function (i, el) {
          const input = $(this).find('input').get(1);
          const item = $(input).attr('id').replace(/preference_/, '');
          const value = $(input).attr('checked') ? 1 : 0;
          return {
            [item]: value
          };
        }).get();
      }
    }).get();

    preferences = preferences.reduce((acc, val) => {
      const [key] = Object.keys(val);
      acc[key] = val[key];
      return acc;
    }, {});

    return {
      meta: AO3.getResponseMeta(response),
      data: preferences
    };
  }

  // endpoint: http://archiveofourown.org/works/(:workId)
  // query params:
  // utf8:✓
  // _method:put
  // authenticity_token:1nPa04CL7ohTd5CpYabEccdXyHsdMiWtFp02mqM1fVc=
  // work[rating_string]:Explicit
  // work[warning_strings][]:Choose Not To Use Archive Warnings
  // work[fandom_string]:Overwatch (Video Game)
  // work[category_string][]:F/F
  // work[category_string][]:F/M
  // work[category_string][]:Multi
  // work[relationship_string]:Lúcio Correia dos Santos/Hana "D.Va" Song/Sombra (Overwatch), Lúcio Correia dos Santos/Hana "D.Va" Song, Lúcio Correia dos Santos/Sombra (Overwatch), Sombra (Overwatch)/Hana "D.Va" Song
  // work[character_string]:Sombra (Overwatch), Lúcio Correia dos Santos, Hana "D.Va" Song
  // work[freeform_string]:Morally Ambiguous Character, Rough Sex, Drunk Sex, Love Triangles, Jealousy, Drugs
  // work[title]:Paramour
  // work[author_attributes][ids][]:2932154
  // pseud[byline]:
  // work[summary]:After a drunk debauched threesome, Hana finds herself in a tenuous but loving relationship with Lúcio and a jealous rivalry with Sombra (Lúcio's friend from his revolutionary days). Much to her chagrin, a failed record deal forces Lúcio into a tight spot financially and he must call in a favor from his unscrupulous friend. Lúcio's renewed contact with Sombra causes Hana to revisit some ambiguous memories and question Lúcio's morality. Trouble ensues.
  // front-notes-options-show:1
  // work[notes]:Just a warning, Sombra is actually a bad person and does some ambiguously non-consensual things to Hana as well as has non-consensual thoughts about her. This is kind of a tie in and elaboration of a <a href="https://www.fanfiction.net/s/12294680/5/The-one-wherein-Sombra-is-a-menace-to-society">brief scene</a> I wrote in another <a href="https://www.fanfiction.net/s/12294680/1/The-one-wherein-Sombra-is-a-menace-to-society">fan fiction</a>. This is also like the first smut I've written for human eyes so I'd love comments and criticism (please be gentle). Written on speed, meant to be read on speed. OK enjoy.
  // work[endnotes]:
  // work[collection_names]:
  // work[recipients]:
  // work[parent_attributes][url]:
  // work[parent_attributes][title]:
  // work[parent_attributes][author]:
  // work[parent_attributes][language_id]:
  // work[parent_attributes][translation]:0
  // work[series_attributes][id]:
  // work[series_attributes][title]:
  // chapters-options-show:1
  // work[wip_length]:6
  // work[chapter_attributes][title]:
  // work[backdate]:0
  // work[chapter_attributes][published_at(3i)]:8
  // work[chapter_attributes][published_at(2i)]:1
  // work[chapter_attributes][published_at(1i)]:2017
  // work[language_id]:1
  // work[work_skin_id]:
  // work[restricted]:0
  // work[anon_commenting_disabled]:0
  // work[moderated_commenting_enabled]:0
  // post_button:Post Without Preview
  static updateWork(id, work) { }

  // endpoint: http://archiveofourown.org/works/(:workId)/chapters/(:chapterId)
  // query params:
  // utf8:✓
  // _method:put
  // authenticity_token:1nPa04CL7ohTd5CpYabEccdXyHsdMiWtFp02mqM1fVc=
  // chapter[title]:
  // chapter[position]:1
  // chapter[wip_length]:6
  // chapter[published_at(3i)]:8
  // chapter[published_at(2i)]:1
  // chapter[published_at(1i)]:2017
  // chapter[author_attributes][ids][]:2932154
  // pseud[byline]:
  // chapter[summary]:
  // chapter[notes]:
  // chapter[endnotes]:
  // chapter[content]:
  static async updateWorkChapter(workId, chapterId, chapter) {
    const token = await AO3.getToken();
    const params = qs.stringify({
      utf8: '✓',
      _method: 'put',
      authenticity_token: token,
      chapter
    });
    const endpoint = `${AO3.site}/works/${workId}/chapters/${chapterId}`;
    try {
      const response = await instance.post(endpoint, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        ...settings
      });
      return response;
    } catch (err) {
      return err;
    }
  }

  static async getNewRelicId() {
    if (!AO3.user) {
      await AO3.login(AO3.credentials);
    }

    const endpoint = `${AO3.site}/users/${AO3.user}`;

    try {
      const response = await instance.get(endpoint);
      const $ = cheerio.load(response.data);
      const scripts = $('head').find('script').map(function (el, i) {
        return $(this).html();
      });
      const newRelicScript = Array.from(scripts).filter(el => {
        if (el.includes('xpid')) {
          return el;
        }
      })[0];
      const xpid = newRelicScript.match(/(xpid)?".*?"/g)[0].replace(/"/g, '');
      return xpid;
    } catch (err) {
      return err;
    }
  }

  static async autocomplete(term, query) {
    if (!AO3.user) {
      await AO3.login(AO3.credentials);
    }

    const token = await AO3.getToken();
    const newRelicId = await AO3.getNewRelicId();

    let endpoint = `${AO3.site}/autocomplete/`;

    const params = {};

    if (has(query, 'type')) {
      endpoint += query.type;
    }

    if (has(query, 'fandom')) {
      params.fandom = [query.fandom];
    }

    params.term = term.toLowerCase();

    try {
      const response = await instance.get(endpoint, {
        params,
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Accept-Encoding': 'gzip deflate, sdch',
          'Accept-Language': 'en-US,en;q=0.8,fr;q=0.6',
          'Connection': 'keep-alive',
          'DNT': 1,
          'X-CSRF-Token': token,
          'X-NewRelic-ID': newRelicId
        },
        xsrfHeaderName: 'X-CSRF-TOKEN',
        responseType: 'json'
      });

      return response;
    } catch (err) {
      return err;
    }
  }

  // endpoint: http://archiveofourown.org/works/(:workId)/bookmarks
  // query params:
  // utf8:✓
  // authenticity_token:1nPa04CL7ohTd5CpYabEccdXyHsdMiWtFp02mqM1fVc=
  // bookmark[pseud_id]:2932154
  // bookmark[bookmarkable_id]:9249503
  // bookmark[bookmarkable_type]:Work
  // bookmark[notes]:
  // bookmark[tag_string]:
  // bookmark[collection_names]:
  // bookmark[private]:0
  // bookmark[rec]:0
  // commit:Create
  static async bookmark(workId, { notes, tags, collections, priv = 0, rec = 0 } = {}) {
    if (!AO3.user) {
      await AO3.login(AO3.credentials);
    }

    const token = await AO3.getToken();
    const pseudId = await AO3.getPseudId(AO3.user);
    const params = qs.stringify({
      utf8: '✓',
      authenticity_token: token,
      commit: 'Create',
      bookmark: {
        pseud_id: pseudId,
        bookmarkable_id: workId,
        bookmarkable_type: 'Work',
        notes,
        tag_string: tags,
        collection_names: collections,
        'private': priv,
        rec
      }
    });
    const endpoint = `${AO3.site}/works/${workId}/bookmarks`;

    try {
      const response = await instance.post(endpoint, params, settings);
      return response;
    } catch (err) {
      return err;
    }
  }

  // endpoint: http://archiveofourown.org/kudos.js
  // query params:
  // utf8:✓
  // authenticity_token:1nPa04CL7ohTd5CpYabEccdXyHsdMiWtFp02mqM1fVc=
  // kudo[commentable_id]:7129859
  // kudo[commentable_type]:Work
  static async giveKudos(workId) {
    if (!AO3.user) {
      await AO3.login(AO3.credentials);
    }

    const token = await AO3.getToken();
    const params = qs.stringify({
      utf8: '✓',
      authenticity_token: token,
      kudo: {
        commentable_id: workId,
        commentable_type: 'Work'
      }
    });
    const endpoint = `${AO3.site}/kudos.js`;

    try {
      return await instance.post(endpoint, params, settings);
    } catch (err) {
      return err;
    }
  }

  // endpoint: http://archiveofourown.org/chapters/(:chapterId)/comments
  // query params:
  // utf8:✓
  // authenticity_token:1nPa04CL7ohTd5CpYabEccdXyHsdMiWtFp02mqM1fVc=
  // comment[pseud_id]:2932154
  // comment[content]:test
  // controller_name:chapters
  // commit:Comment
  static async comment(chapterId, comment) {
    if (!AO3.user) {
      await AO3.login(AO3.credentials);
    }
    const token = await AO3.getToken();
    const pseudId = await AO3.getPseudId(AO3.user);
    const params = qs.stringify({
      utf8: '✓',
      authenticity_token: token,
      commit: 'Comment',
      comment: {
        pseud_id: pseudId,
        content: comment,
        controller_name: 'chapters'
      }
    });
    const endpoint = `${AO3.site}/chapters/${chapterId}/comments`;

    try {
      return await instance.post(endpoint, params, settings);
    } catch (err) {
      return err;
    }
  }

  // comments are fucked

  static async deleteComment() { }

  // endpoint: http://archiveofourown.org/users/nofox/pseuds
  // selector: #main > ul.pseud.index.group > li > ul > li:nth-child(2) > a
  static async getPseudId(user) {
    if (!AO3.user) {
      await AO3.login(AO3.credentials);
    }

    const endpoint = `http://archiveofourown.org/users/${user}/pseuds`;

    try {
      const response = await instance.get(endpoint, settings);
      const $ = cheerio.load(response.data);
      const pseudId = $('#main > ul.pseud.index.group > li > ul').html().match(/(\d+)/g)[0]; // this is hella janky
      return pseudId;
    } catch (err) {
      return err;
    }
  }

  //   utf8:✓
  // authenticity_token:frpvJRGvgGHIx22GBgjiD/5C4/qVKm7PJU7Hrv372uc=
  // subscription[subscribable_id]:8671489
  // subscription[subscribable_type]:Work

  static async subscribeWork(workId) {
    if (!AO3.user) {
      await AO3.login(AO3.credentials);
    }

    const token = await AO3.getToken();
    const preferences = {
      utf8: '✓',
      authenticity_token: token,
      subscription: {
        subscribable_id: workId,
        subscribable_type: 'Work'
      }
    };
    const params = qs.stringify(preferences);
    const endpoint = `${AO3.site}/users/${AO3.user}/subscriptions`;
    try {
      return await instance.post(endpoint, params, settings);
    } catch (err) {
      return err;
    }
  }

  static async getUserSubscribableId(user) {
    const endpoint = `${AO3.site}/users/${user}/`;

    try {
      const response = await instance.get(endpoint, settings);
      const $ = cheerio.load(response.data);
      const userId = $('input#subscription_subscribable_id').attr('value');
      return userId;
    } catch (err) {
      return err;
    }
  }

  // endpoint: http://archiveofourown.org/users/nofox/subscriptions
  // query params:
  // utf8:✓
  // authenticity_token:1nPa04CL7ohTd5CpYabEccdXyHsdMiWtFp02mqM1fVc=
  // subscription[subscribable_id]:2724596
  // subscription[subscribable_type]:User
  // returns: {"item_id":94509707,"item_success_message":"You are now following nofox. If you'd like to stop receiving email updates, you can unsubscribe from <a href=\"http://archiveofourown.org/users/nofox/subscriptions\">your Subscriptions page</a>."}
  static async subscribeUser(user) {
    if (!AO3.user) {
      await AO3.login(AO3.credentials);
    }

    const token = await AO3.getToken();
    const userId = await AO3.getUserSubscribableId(user);
    const endpoint = `${AO3.site}/users/${AO3.user}/subscriptions`;
    const params = qs.stringify({
      utf8: '✓',
      _method: 'put',
      authenticity_token: token,
      subscription: {
        subscribable_id: userId,
        subscribable_type: 'User'
      }
    });

    try {
      const response = await instance.post(endpoint, params, settings);
      return response;
    } catch (err) {
      return err;
    }
  }

  // endpoint: http://archiveofourown.org/users/nofox/subscriptions/94509707
  // query params: utf8:✓
  // authenticity_token:1nPa04CL7ohTd5CpYabEccdXyHsdMiWtFp02mqM1fVc=
  // subscription[subscribable_id]:2724596
  // subscription[subscribable_type]:User
  // _method:delete
  static async unsubscribeUser(user) {
    if (!AO3.user) {
      await AO3.login(AO3.credentials);
    }
    const token = await AO3.getToken();
    const userId = await AO3.getUserSubscribableId(user);
    const endpoint = `${AO3.site}/users/${AO3.user}/subscriptions/${userId}`;
    const params = qs.stringify({
      utf8: '✓',
      _method: 'delete',
      authenticity_token: token,
      subscription: {
        subscribable_id: userId,
        subscribable_type: 'User'
      }
    });

    try {
      const response = await instance.post(endpoint, params, settings);
      return response;
    } catch (err) {
      return err;
    }
  }

  static async profile(user) {
    return await AO3.userDashboard(user);
  }

  // return all tags in a fandom
  // Anime & Manga
  // Books & Literature
  // Cartoons & Comics & Graphic Novels
  // Celebrities & Real People
  // Movies
  // Music & Brands
  // Other Media
  // Theatre
  // TV Shows
  // Video Games
  // Uncategorized Fandoms
  static async media(fandom) {
    const endpoint = `${AO3.site}/media/${escape(fandom)}/fandoms`;
    const response = await instance.get(endpoint);
    const $ = cheerio.load(response.data);
    const index = $('ol.fandom').find('li.letter');
    const fandoms = index.map(function (i, el) {
      const letter = $(this).find('h3.heading').text().replace(/\s/g, '').trim();
      const items = $(this).find('ul.tags').find('li').map(function (i, el) {
        const tag = $(this).find('a.tag').text();
        const number = $(this).text().replace(/\D/g, '').trim();
        return {
          tag: {
            name: tag,
            works: number
          }
        };
      }).get();

      const payload = {
        [letter]: items
      };

      return payload;
    }).get();

    return {
      meta: AO3.getResponseMeta(response),
      data: fandoms
    };
  }

  // returns latest works
  recentWorks() { }

  static async handleRedirect(endpoint) {
    endpoint = `${AO3.site}/${endpoint}`;
    const response = await instance.get(endpoint, settings);

    return response.data;
  }

  static parseChapters($) {
    let work = $('div.wrapper');
    let stats = work.find('dd.stats').find('dl.stats');
    let chapters = stats.find('dd.chapters').text();
    return chapters;
  }

  static async work(id) {
    const permission = qs.stringify({ // NOTE: this is wonky
      view_adult: true,
      view_full_work: true
    });
    const endpoint = `${AO3.site}/works/${id}?${permission}`;
    const response = await instance.get(endpoint, settings);
    let $ = cheerio.load(response.data);
    // const redirect = $('div#inner').find('ul.actions').find('a').attr('href');
    //
    // if (redirect) {
    //   $ = cheerio.load(await AO3.handleRedirect(redirect));
    // }

    // console.log(response.data);

    const chapters = AO3.parseChapters($);
    const stats = AO3.parseStats($('div.wrapper').find('dl.work'));

    if (parseInt(chapters, 10) > 1) {
      const title = strip($('div#workskin').find('div.preface').find('h2.title').text());
      let text = $('div#chapters').children('.chapter').map(function (i, el) {
        const content = $(el).find('div.userstuff').html();
        const chapterTitle = strip($(el).find('h3.title').text());
        return {
          [chapterTitle]: content
        };
      }).get();

      return {
        meta: AO3.getResponseMeta(response),
        data: {
          title,
          text,
          stats
        }
      };
    }

    const title = $('#workskin').find('h2.title').text();
    const text = $('#chapters').find('div.userstuff').html();

    return {
      meta: AO3.getResponseMeta(response),
      data: {
        title,
        text,
        stats
      }
    };
  }

  static async workComments(workId, chapterId) {
    if (!AO3.user) {
      await AO3.login(AO3.credentials);
    }
    const endpoint = chapterId ? `${AO3.site}/works/${workId}/chapters/${chapterId}` : `${AO3.site}/works/${workId}/navigate`;

    try {
      const response = await instance.get(endpoint, settings);
      if (!chapterId) {
        let $ = cheerio.load(response.data);
        const chapterIds = $('ol.chapter').find('li').map(function (i, el) {
          const id = $(this).find('a').attr('href').split('/').pop();
          return id;
        }).get();
        const promises = chapterIds.map(id => {
          return instance.get(`${AO3.site}/comments/show_comments?chapter_id=${id}`, {
            Accept: '*/*;q=0.5, text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
            'Accept-Encoding': 'gzip deflate, sdch',
            'Content-Type': 'text/javascript; charset=utf-8'
          });
        });
        const comments = await Promise.all(promises);
        // const comments = await instance.get(`${AO3.site}/comments/show_comments?chapter_id=21083225`, {
        //     Accept: '*/*;q=0.5, text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
        //     'Accept-Encoding': 'gzip deflate, sdch',
        //     'Content-Type': 'text/javascript; charset=utf-8',
        //     ...settings
        //   });
        return comments;
      }
    } catch (err) {
      return err;
    }
  }

  // returns latest bookmarks
  bookmarks() { }

  // most popular and random
  // tags/:fandom/works?{query}
  static async tags(fandom, query = {}) {
    const page = has(query, 'page') ? query.page : 0;
    const endpoint = `${AO3.site}/tags/${fandom}/works?${qs.stringify(query)}`;
    const response = await instance.get(endpoint);
    const $ = cheerio.load(response.data);
    const data = AO3.parseWorks($);
    const found = $('div#main').find('h2.heading').text().match(/([^of])+(?=Works)/, '')[0].trim();

    return {
      meta: AO3.getResponseMeta(response),
      data: {
        page,
        found,
        items: data,
        length: data.length
      }
    };
  }

  // shows all collections
  collections() { }

  // all challenges or gift exchange challenges
  challenges() { }

  // applies collections filters
  collectionsSearch() { }

  static formatWorksFilterEndpoint(query) {
    let endpoint = `${AO3.site}/works?utf8=%E2%9C%93`;
    const { tag_id } = query;
    delete query.tag_id;
    query = qs.stringify({ commit: 'Sort and Filter', work_search: query, tag_id });
    return `${endpoint}&${query}`;
  }

  // work_search:
  //  { sort_column: 'revised_at',
  //    rating_ids: [ '11' ],
  //    warning_ids: [ '14', '17' ],
  //    category_ids: [ '22', '2246', '116', '23', '21', '24' ],
  //    fandom_ids: [ '3406514' ],
  //    character_ids:
  //     [ '9278740',
  //       '9604117',
  //       '7266476',
  //       '7970758',
  //       '7266473',
  //       '7970863',
  //       '9860302',
  //       '9860098',
  //       '10270348',
  //       '9860329' ],
  //    relationship_ids: [ '10117940', '8940589' ],
  //    freeform_ids: [ '98700' ],
  //    other_tag_names: '',
  //    query: '',
  //    language_id: '1',
  //    complete: [ '0', '1' ] }

  static async worksFilter(tag, query = {}) {
    try {
      Object.assign(query, { tag_id: tag });
      const endpoint = AO3.formatWorksFilterEndpoint(query);

      const response = await instance.get(endpoint, {
        timeout: 3000
      });

      const $ = cheerio.load(response.data);
      const page = has(query, 'page') ? query.page : 0;
      const found = $('div#main').find('h2.heading').text().match(/([^of])+(?=Works)/, '')[0].trim();

      const data = AO3.parseWorks($);

      return {
        meta: AO3.getResponseMeta(response),
        data: {
          page,
          found,
          items: data,
          length: data.length
        }
      };
    } catch (err) {
      return err;
    }
  }

  static formatWorksSearchEndpoint(query, page) {
    query = qs.stringify({ work_search: query });
    let endpoint = `${AO3.site}/works/search`;
    if (page === 0) {
      endpoint = `${endpoint}?utf8=%E2%9C%93&${query}`;
    } else {
      endpoint = `${endpoint}?page=${page}?utf8=%E2%9C%93&${query}`;
    }
    return endpoint;
  }

  // query, title, creator, revised_at, complete, single_chapter, word_count, language_id, fandom_names, rating_ids, warning_ids, category_ids, character_names, relationship_names, freeform_names, hits, kudos_count, comments_count, bookmarks_count, sort_column, sort_direction
  static async worksSearch(query) {
    const page = has(query, 'page') ? query.page : 0;

    if (page !== 0) {
      delete query.page;
    }

    const endpoint = AO3.formatWorksSearchEndpoint(query, page);
    try {
      const response = await instance.get(endpoint);
      const $ = cheerio.load(response.data);
      const found = parseInt($('#main').find('h3.heading').text(), 10);
      const data = AO3.parseWorks($);
      return {
        meta: AO3.getResponseMeta(response),
        data: {
          page,
          found,
          items: data,
          length: data.length
        }
      };
    } catch (err) {
      return err;
    }
  }

  static parseWorks($) {
    try {
      return $('ol.work').find('li.work').map(function (i, el) {
        const heading = $(this).find('h4.heading').find('a');
        const title = heading.first().text();
        const author = heading.last().text();
        if (title) {
          const id = $(this).attr('id').replace(/work_/, '');
          const fandom = $(this).find('h5').find('a').text();
          const summary = strip($(this).find('.summary').text());
          const updated = $(this).find('p.datetime').text();

          const stats = AO3.parseStats($(this));
          const tags = AO3.parseTags($, $(el).find('ul.tags'));
          const required_tags = AO3.parseRequiredTags($, this);

          return {
            id, title, author, fandom, updated, required_tags, tags, summary, stats
          };
        }
      }).get();
    } catch (err) {
      return err;
    }
  }

  // content rating, relationships, content warnings, finished?
  static parseRequiredTags($, el) {
    const [content_rating, relationships, content_warnings, finished] = $(el).find('ul.required-tags').find('li').map((i, el) => {
      return $(el).find('span').attr('title');
    }).get();

    return {
      content_rating, relationships, content_warnings, finished
    };
  }

  static parseStats(workHeading) {
    const statsElem = workHeading.find('dl.stats');
    const updated = workHeading.find('div.module').find('p.datetime').text() || statsElem.find('dd.status').text();
    const language = strip(workHeading.find('dd.language').text());
    const words = statsElem.find('dd.words').text();
    const chapters = statsElem.find('dd.chapters').text();
    const kudos = statsElem.find('dd.kudos').text() || 0;
    const bookmarks = statsElem.find('dd.bookmarks').text();
    const hits = statsElem.find('dd.hits').text();

    return {
      language, words, chapters, kudos, bookmarks, hits, updated
    };
  }

  static parseTags($, tagElem) {
    const warnings = tagElem.find('li.warnings').text();
    const relationships = tagElem.find('li.relationships').find('a').map((i, el) => {
      return $(el).text();
    }).get();
    const freeforms = tagElem.find('li.freeforms').find('a').map((i, el) => {
      return $(el).text();
    }).get();
    const characters = tagElem.find('li.characters').find('a').map((i, el) => {
      return $(el).text();
    }).get();

    return {
      warnings, relationships, characters, freeforms
    };
  }

  peopleSearch() { }

  bookmarkSearch() { }

  tagSearch() { }

  // returns tweets and news items on the front page
  // TODO: this isn't done
  mainPage() {
    const payload = {};
    instance.get(AO3.site).then(response => {
      const { data } = response;
      const $ = cheerio.load(data);
      const li = $('ul.news').children();
      payload.data = new Array(li.length);
      li.each(function (i, child) {
        const meta = $(this).find('p.meta');
        const comments = meta.find('span.comments').find('a').text();
        const published = meta.find('span.published');
        payload.data[i] = {
          text: $(this).find('blockquote').text(),
          meta: {
            comments,
            published
          }
        };
      });
    });
  }
}
