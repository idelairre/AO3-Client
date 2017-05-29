'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _axiosCookiejarSupport = require('@3846masa/axios-cookiejar-support');

var _axiosCookiejarSupport2 = _interopRequireDefault(_axiosCookiejarSupport);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// let cheerio;

function isNode() {
  return Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
}

function strip(string) {
  return string.replace(/\r?\n|\r/, '').trim();
}

function has(object, property) {
  return {}.hasOwnProperty.call(object, property);
}

function defaults(object, defaultObj) {
  for (var key in defaultObj) {
    if (!object[key]) {
      object[key] = defaultObj[key];
    }
  }
  return object;
}

// if (isNode()) {
//   cheerio = require('cheerio');
// } else {
//   // use jquery
// }

(0, _axiosCookiejarSupport2.default)(_axios2.default);

var settings = {
  withCredentials: true,
  jar: true
};

var instance = _axios2.default.create((0, _extends3.default)({
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
}, settings));

var AO3 = function () {
  function AO3() {
    (0, _classCallCheck3.default)(this, AO3);
  }

  (0, _createClass3.default)(AO3, [{
    key: 'recentWorks',


    // returns latest works
    value: function recentWorks() {}
  }, {
    key: 'bookmarks',


    // returns latest bookmarks
    value: function bookmarks() {}

    // most popular and random
    // tags/:fandom/works?{query}

  }, {
    key: 'collections',


    // shows all collections
    value: function collections() {}

    // all challenges or gift exchange challenges

  }, {
    key: 'challenges',
    value: function challenges() {}

    // applies collections filters

  }, {
    key: 'collectionsSearch',
    value: function collectionsSearch() {}
  }, {
    key: 'peopleSearch',
    value: function peopleSearch() {}
  }, {
    key: 'bookmarkSearch',
    value: function bookmarkSearch() {}
  }, {
    key: 'tagSearch',
    value: function tagSearch() {}

    // returns tweets and news items on the front page
    // TODO: this isn't done

  }, {
    key: 'mainPage',
    value: function mainPage() {
      var payload = {};
      instance.get(AO3.site).then(function (response) {
        var data = response.data;

        var $ = _cheerio2.default.load(data);
        var li = $('ul.news').children();
        payload.data = new Array(li.length);
        li.each(function (i, child) {
          var meta = $(this).find('p.meta');
          var comments = meta.find('span.comments').find('a').text();
          var published = meta.find('span.published');
          payload.data[i] = {
            text: $(this).find('blockquote').text(),
            meta: {
              comments: comments,
              published: published
            }
          };
        });
      });
    }
  }], [{
    key: 'setCredentials',
    value: function setCredentials(_ref) {
      var user = _ref.user,
          password = _ref.password;

      AO3.credentials = {
        user: user,
        password: password
      };
    }
  }, {
    key: 'getToken',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(endpoint) {
        var response, $, token;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return instance.get(AO3.site + '/' + (endpoint ? endpoint : 'login'));

              case 2:
                response = _context.sent;
                $ = _cheerio2.default.load(response.data);
                token = $('meta[name="csrf-token"]').attr('content');
                return _context.abrupt('return', _promise2.default.resolve(token));

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getToken(_x) {
        return _ref2.apply(this, arguments);
      }

      return getToken;
    }()
  }, {
    key: 'getResponseMeta',
    value: function getResponseMeta(response) {
      var status = response.status,
          statusText = response.statusText,
          headers = response.headers,
          config = response.config;


      return {
        status: status, statusText: statusText, headers: headers, config: config
      };
    }
  }, {
    key: 'login',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref4) {
        var user = _ref4.user,
            password = _ref4.password;

        var token, credentials, endpoint, response, $, _user;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return AO3.getToken();

              case 2:
                token = _context2.sent;
                credentials = _qs2.default.stringify({
                  utf8: '✓',
                  authenticity_token: token,
                  user_session: {
                    login: user,
                    password: password
                  },
                  commit: 'Log In'
                });
                endpoint = AO3.site + '/user_sessions';
                _context2.prev = 5;
                _context2.next = 8;
                return instance.post(endpoint, credentials, settings);

              case 8:
                response = _context2.sent;
                $ = _cheerio2.default.load(response.data);
                _user = strip($('#main').find('div.user').find('div.primary').find('h2.heading').text());


                AO3.user = _user;

                return _context2.abrupt('return', response);

              case 15:
                _context2.prev = 15;
                _context2.t0 = _context2['catch'](5);
                return _context2.abrupt('return', _context2.t0);

              case 18:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[5, 15]]);
      }));

      function login(_x2) {
        return _ref3.apply(this, arguments);
      }

      return login;
    }()
  }, {
    key: 'userDashboard',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        var endpoint, response, $, user;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (AO3.user) {
                  _context3.next = 3;
                  break;
                }

                _context3.next = 3;
                return AO3.login(AO3.credentials);

              case 3:
                endpoint = AO3.site + '/users/' + AO3.user;
                _context3.next = 6;
                return instance.get(endpoint, settings);

              case 6:
                response = _context3.sent;
                $ = _cheerio2.default.load(response.data);
                user = strip($('#main').find('div.primary').find('h2.heading').text());
                // TODO: get all list items on page, e.g., works, bookmarks, etc...

                return _context3.abrupt('return', user);

              case 10:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function userDashboard() {
        return _ref5.apply(this, arguments);
      }

      return userDashboard;
    }()
  }, {
    key: 'updateUserProfile',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
          aboutMe: '', location: '', title: '', dateOfBirth: { year: '', month: '', day: '' }
        },
            aboutMe = _ref7.aboutMe,
            location = _ref7.location,
            title = _ref7.title,
            _ref7$dateOfBirth = _ref7.dateOfBirth,
            year = _ref7$dateOfBirth.year,
            month = _ref7$dateOfBirth.month,
            day = _ref7$dateOfBirth.day;

        var token, params, endpoint, response;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (AO3.user) {
                  _context4.next = 3;
                  break;
                }

                _context4.next = 3;
                return AO3.login(AO3.credentials);

              case 3:
                _context4.next = 5;
                return AO3.getToken();

              case 5:
                token = _context4.sent;
                params = _qs2.default.stringify({
                  _method: 'put',
                  authenticity_token: token,
                  commit: 'Update',
                  profile_attributes: {
                    title: title,
                    location: location,
                    'date_of_birth(1i)': year,
                    'date_of_birth(2i)': month,
                    'date_of_birth(3i)': day,
                    about_me: aboutMe
                  }
                });
                endpoint = AO3.site + '/users/' + AO3.user;
                _context4.prev = 8;
                _context4.next = 11;
                return instance.post(endpoint, params, (0, _extends3.default)({
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }, settings));

              case 11:
                response = _context4.sent;
                return _context4.abrupt('return', response);

              case 15:
                _context4.prev = 15;
                _context4.t0 = _context4['catch'](8);
                return _context4.abrupt('return', _context4.t0);

              case 18:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[8, 15]]);
      }));

      function updateUserProfile() {
        return _ref6.apply(this, arguments);
      }

      return updateUserProfile;
    }()

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

  }, {
    key: 'updateUserPseud',
    value: function updateUserPseud() {}

    // endpoint:

  }, {
    key: 'updateUserName',
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(newUserName) {
        var token, params, endpoint, response;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (AO3.user) {
                  _context5.next = 3;
                  break;
                }

                _context5.next = 3;
                return AO3.login(AO3.credentials);

              case 3:
                _context5.next = 5;
                return AO3.getToken();

              case 5:
                token = _context5.sent;
                params = _qs2.default.stringify({
                  utf8: '✓',
                  authenticity_token: token,
                  new_login: newUserName,
                  password: AO3.credentials.password,
                  commit: 'Change User Name'
                });
                endpoint = AO3.site + '/users/' + AO3.user + '/changed_username';
                _context5.prev = 8;
                _context5.next = 11;
                return instance.post(endpoint, params, (0, _extends3.default)({
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }, settings));

              case 11:
                response = _context5.sent;
                return _context5.abrupt('return', response);

              case 15:
                _context5.prev = 15;
                _context5.t0 = _context5['catch'](8);
                return _context5.abrupt('return', _context5.t0);

              case 18:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[8, 15]]);
      }));

      function updateUserName(_x4) {
        return _ref8.apply(this, arguments);
      }

      return updateUserName;
    }()
  }, {
    key: 'updatePassword',
    value: function () {
      var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(password) {
        var token, params, endpoint, response;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (AO3.user) {
                  _context6.next = 3;
                  break;
                }

                _context6.next = 3;
                return AO3.login(AO3.credentials);

              case 3:
                _context6.next = 5;
                return AO3.getToken();

              case 5:
                token = _context6.sent;
                params = _qs2.default.stringify({
                  utf8: '✓',
                  authenticity_token: token,
                  password: password,
                  password_confirmation: password,
                  password_check: AO3.credentials.password,
                  commit: 'Change Password'
                });
                endpoint = AO3.site + '/users/' + AO3.user + '/changed_password';
                _context6.prev = 8;
                _context6.next = 11;
                return instance.post(endpoint, params, (0, _extends3.default)({
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }, settings));

              case 11:
                response = _context6.sent;
                return _context6.abrupt('return', response);

              case 15:
                _context6.prev = 15;
                _context6.t0 = _context6['catch'](8);
                return _context6.abrupt('return', _context6.t0);

              case 18:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[8, 15]]);
      }));

      function updatePassword(_x5) {
        return _ref9.apply(this, arguments);
      }

      return updatePassword;
    }()
  }, {
    key: 'updateEmail',
    value: function () {
      var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(_ref11) {
        var newEmail = _ref11.newEmail;
        var token, params, endpoint, response;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (AO3.user) {
                  _context7.next = 3;
                  break;
                }

                _context7.next = 3;
                return AO3.login(AO3.credentials);

              case 3:
                _context7.next = 5;
                return AO3.getToken();

              case 5:
                token = _context7.sent;
                params = _qs2.default.stringify({
                  utf8: '✓',
                  authenticity_token: token,
                  new_email: newEmail,
                  email_confirmation: newEmail,
                  password_check: AO3.password,
                  commit: 'Change Email'
                });
                endpoint = AO3.site + '/users/' + AO3.user + '/changed_email';
                _context7.prev = 8;
                _context7.next = 11;
                return instance.post(endpoint, params, (0, _extends3.default)({
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }, settings));

              case 11:
                response = _context7.sent;
                return _context7.abrupt('return', response);

              case 15:
                _context7.prev = 15;
                _context7.t0 = _context7['catch'](8);
                return _context7.abrupt('return', _context7.t0);

              case 18:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this, [[8, 15]]);
      }));

      function updateEmail(_x6) {
        return _ref10.apply(this, arguments);
      }

      return updateEmail;
    }()
  }, {
    key: 'updatePreferences',
    value: function () {
      var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(preferences) {
        var token, _ref13, data, params, endpoint, response;

        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (AO3.user) {
                  _context8.next = 3;
                  break;
                }

                _context8.next = 3;
                return AO3.login(AO3.credentials);

              case 3:
                _context8.next = 5;
                return AO3.getToken();

              case 5:
                token = _context8.sent;
                _context8.next = 8;
                return AO3.getPreferences();

              case 8:
                _ref13 = _context8.sent;
                data = _ref13.data;


                preferences = defaults(preferences, data);

                params = _qs2.default.stringify({
                  utf8: '✓',
                  _method: 'put',
                  authenticity_token: token,
                  preference: preferences,
                  commit: 'Update'
                });
                endpoint = AO3.site + '/preferences/update?user_id=' + AO3.user;
                _context8.prev = 13;
                _context8.next = 16;
                return instance.post(endpoint, params, (0, _extends3.default)({
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }, settings));

              case 16:
                response = _context8.sent;
                return _context8.abrupt('return', response);

              case 20:
                _context8.prev = 20;
                _context8.t0 = _context8['catch'](13);
                return _context8.abrupt('return', _context8.t0);

              case 23:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this, [[13, 20]]);
      }));

      function updatePreferences(_x7) {
        return _ref12.apply(this, arguments);
      }

      return updatePreferences;
    }()
  }, {
    key: 'getPreferences',
    value: function () {
      var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9() {
        var endpoint, response, $, preferences;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (AO3.user) {
                  _context9.next = 3;
                  break;
                }

                _context9.next = 3;
                return AO3.login(AO3.credentials);

              case 3:
                endpoint = AO3.site + '/users/' + AO3.user + '/preferences';
                _context9.next = 6;
                return instance.get(endpoint, settings);

              case 6:
                response = _context9.sent;
                $ = _cheerio2.default.load(response.data);
                preferences = $('#main').find('form').find('fieldset').map(function (i, el) {
                  var heading = $(this).find('legend').text();
                  if (heading && heading !== 'Actions') {
                    return $(this).find('ul').find('li').map(function (i, el) {
                      var input = $(this).find('input').get(1);
                      var item = $(input).attr('id').replace(/preference_/, '');
                      var value = $(input).attr('checked') ? 1 : 0;
                      return (0, _defineProperty3.default)({}, item, value);
                    }).get();
                  }
                }).get();


                preferences = preferences.reduce(function (acc, val) {
                  var _Object$keys = (0, _keys2.default)(val),
                      _Object$keys2 = (0, _slicedToArray3.default)(_Object$keys, 1),
                      key = _Object$keys2[0];

                  acc[key] = val[key];
                  return acc;
                }, {});

                return _context9.abrupt('return', {
                  meta: AO3.getResponseMeta(response),
                  data: preferences
                });

              case 11:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function getPreferences() {
        return _ref14.apply(this, arguments);
      }

      return getPreferences;
    }()

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

  }, {
    key: 'updateWork',
    value: function updateWork(id, work) {}

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

  }, {
    key: 'updateWorkChapter',
    value: function () {
      var _ref16 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(workId, chapterId, chapter) {
        var token, params, endpoint, response;
        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return AO3.getToken();

              case 2:
                token = _context10.sent;
                params = _qs2.default.stringify({
                  utf8: '✓',
                  _method: 'put',
                  authenticity_token: token,
                  chapter: chapter
                });
                endpoint = AO3.site + '/works/' + workId + '/chapters/' + chapterId;
                _context10.prev = 5;
                _context10.next = 8;
                return instance.post(endpoint, params, (0, _extends3.default)({
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }, settings));

              case 8:
                response = _context10.sent;
                return _context10.abrupt('return', response);

              case 12:
                _context10.prev = 12;
                _context10.t0 = _context10['catch'](5);
                return _context10.abrupt('return', _context10.t0);

              case 15:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this, [[5, 12]]);
      }));

      function updateWorkChapter(_x8, _x9, _x10) {
        return _ref16.apply(this, arguments);
      }

      return updateWorkChapter;
    }()
  }, {
    key: 'getNewRelicId',
    value: function () {
      var _ref17 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11() {
        var endpoint, response, $, scripts, newRelicScript, xpid;
        return _regenerator2.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                if (AO3.user) {
                  _context11.next = 3;
                  break;
                }

                _context11.next = 3;
                return AO3.login(AO3.credentials);

              case 3:
                endpoint = AO3.site + '/users/' + AO3.user;
                _context11.prev = 4;
                _context11.next = 7;
                return instance.get(endpoint);

              case 7:
                response = _context11.sent;
                $ = _cheerio2.default.load(response.data);
                scripts = $('head').find('script').map(function (el, i) {
                  return $(this).html();
                });
                newRelicScript = (0, _from2.default)(scripts).filter(function (el) {
                  if (el.includes('xpid')) {
                    return el;
                  }
                })[0];
                xpid = newRelicScript.match(/(xpid)?".*?"/g)[0].replace(/"/g, '');
                return _context11.abrupt('return', xpid);

              case 15:
                _context11.prev = 15;
                _context11.t0 = _context11['catch'](4);
                return _context11.abrupt('return', _context11.t0);

              case 18:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this, [[4, 15]]);
      }));

      function getNewRelicId() {
        return _ref17.apply(this, arguments);
      }

      return getNewRelicId;
    }()
  }, {
    key: 'autocomplete',
    value: function () {
      var _ref18 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(term, query) {
        var token, newRelicId, endpoint, params, response;
        return _regenerator2.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                if (AO3.user) {
                  _context12.next = 3;
                  break;
                }

                _context12.next = 3;
                return AO3.login(AO3.credentials);

              case 3:
                _context12.next = 5;
                return AO3.getToken();

              case 5:
                token = _context12.sent;
                _context12.next = 8;
                return AO3.getNewRelicId();

              case 8:
                newRelicId = _context12.sent;
                endpoint = AO3.site + '/autocomplete/';
                params = {};


                if (has(query, 'type')) {
                  endpoint += query.type;
                }

                if (has(query, 'fandom')) {
                  params.fandom = [query.fandom];
                }

                params.term = term.toLowerCase();

                _context12.prev = 14;
                _context12.next = 17;
                return instance.get(endpoint, {
                  params: params,
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

              case 17:
                response = _context12.sent;
                return _context12.abrupt('return', response);

              case 21:
                _context12.prev = 21;
                _context12.t0 = _context12['catch'](14);
                return _context12.abrupt('return', _context12.t0);

              case 24:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this, [[14, 21]]);
      }));

      function autocomplete(_x11, _x12) {
        return _ref18.apply(this, arguments);
      }

      return autocomplete;
    }()

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

  }, {
    key: 'bookmark',
    value: function () {
      var _ref19 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(workId) {
        var _ref20 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            notes = _ref20.notes,
            tags = _ref20.tags,
            collections = _ref20.collections,
            _ref20$priv = _ref20.priv,
            priv = _ref20$priv === undefined ? 0 : _ref20$priv,
            _ref20$rec = _ref20.rec,
            rec = _ref20$rec === undefined ? 0 : _ref20$rec;

        var token, pseudId, params, endpoint, response;
        return _regenerator2.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                if (AO3.user) {
                  _context13.next = 3;
                  break;
                }

                _context13.next = 3;
                return AO3.login(AO3.credentials);

              case 3:
                _context13.next = 5;
                return AO3.getToken();

              case 5:
                token = _context13.sent;
                _context13.next = 8;
                return AO3.getPseudId(AO3.user);

              case 8:
                pseudId = _context13.sent;
                params = _qs2.default.stringify({
                  utf8: '✓',
                  authenticity_token: token,
                  commit: 'Create',
                  bookmark: {
                    pseud_id: pseudId,
                    bookmarkable_id: workId,
                    bookmarkable_type: 'Work',
                    notes: notes,
                    tag_string: tags,
                    collection_names: collections,
                    'private': priv,
                    rec: rec
                  }
                });
                endpoint = AO3.site + '/works/' + workId + '/bookmarks';
                _context13.prev = 11;
                _context13.next = 14;
                return instance.post(endpoint, params, settings);

              case 14:
                response = _context13.sent;
                return _context13.abrupt('return', response);

              case 18:
                _context13.prev = 18;
                _context13.t0 = _context13['catch'](11);
                return _context13.abrupt('return', _context13.t0);

              case 21:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this, [[11, 18]]);
      }));

      function bookmark(_x13) {
        return _ref19.apply(this, arguments);
      }

      return bookmark;
    }()

    // endpoint: http://archiveofourown.org/kudos.js
    // query params:
    // utf8:✓
    // authenticity_token:1nPa04CL7ohTd5CpYabEccdXyHsdMiWtFp02mqM1fVc=
    // kudo[commentable_id]:7129859
    // kudo[commentable_type]:Work

  }, {
    key: 'giveKudos',
    value: function () {
      var _ref21 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(workId) {
        var token, params, endpoint;
        return _regenerator2.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                if (AO3.user) {
                  _context14.next = 3;
                  break;
                }

                _context14.next = 3;
                return AO3.login(AO3.credentials);

              case 3:
                _context14.next = 5;
                return AO3.getToken();

              case 5:
                token = _context14.sent;
                params = _qs2.default.stringify({
                  utf8: '✓',
                  authenticity_token: token,
                  kudo: {
                    commentable_id: workId,
                    commentable_type: 'Work'
                  }
                });
                endpoint = AO3.site + '/kudos.js';
                _context14.prev = 8;
                _context14.next = 11;
                return instance.post(endpoint, params, settings);

              case 11:
                return _context14.abrupt('return', _context14.sent);

              case 14:
                _context14.prev = 14;
                _context14.t0 = _context14['catch'](8);
                return _context14.abrupt('return', _context14.t0);

              case 17:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this, [[8, 14]]);
      }));

      function giveKudos(_x15) {
        return _ref21.apply(this, arguments);
      }

      return giveKudos;
    }()

    // endpoint: http://archiveofourown.org/chapters/(:chapterId)/comments
    // query params:
    // utf8:✓
    // authenticity_token:1nPa04CL7ohTd5CpYabEccdXyHsdMiWtFp02mqM1fVc=
    // comment[pseud_id]:2932154
    // comment[content]:test
    // controller_name:chapters
    // commit:Comment

  }, {
    key: 'comment',
    value: function () {
      var _ref22 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(chapterId, _comment) {
        var token, pseudId, params, endpoint;
        return _regenerator2.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                if (AO3.user) {
                  _context15.next = 3;
                  break;
                }

                _context15.next = 3;
                return AO3.login(AO3.credentials);

              case 3:
                _context15.next = 5;
                return AO3.getToken();

              case 5:
                token = _context15.sent;
                _context15.next = 8;
                return AO3.getPseudId(AO3.user);

              case 8:
                pseudId = _context15.sent;
                params = _qs2.default.stringify({
                  utf8: '✓',
                  authenticity_token: token,
                  commit: 'Comment',
                  comment: {
                    pseud_id: pseudId,
                    content: _comment,
                    controller_name: 'chapters'
                  }
                });
                endpoint = AO3.site + '/chapters/' + chapterId + '/comments';
                _context15.prev = 11;
                _context15.next = 14;
                return instance.post(endpoint, params, settings);

              case 14:
                return _context15.abrupt('return', _context15.sent);

              case 17:
                _context15.prev = 17;
                _context15.t0 = _context15['catch'](11);
                return _context15.abrupt('return', _context15.t0);

              case 20:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, this, [[11, 17]]);
      }));

      function comment(_x16, _x17) {
        return _ref22.apply(this, arguments);
      }

      return comment;
    }()

    // comments are fucked

  }, {
    key: 'deleteComment',
    value: function () {
      var _ref23 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16() {
        return _regenerator2.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function deleteComment() {
        return _ref23.apply(this, arguments);
      }

      return deleteComment;
    }()

    // endpoint: http://archiveofourown.org/users/nofox/pseuds
    // selector: #main > ul.pseud.index.group > li > ul > li:nth-child(2) > a

  }, {
    key: 'getPseudId',
    value: function () {
      var _ref24 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17(user) {
        var endpoint, response, $, pseudId;
        return _regenerator2.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                if (AO3.user) {
                  _context17.next = 3;
                  break;
                }

                _context17.next = 3;
                return AO3.login(AO3.credentials);

              case 3:
                endpoint = 'http://archiveofourown.org/users/' + user + '/pseuds';
                _context17.prev = 4;
                _context17.next = 7;
                return instance.get(endpoint, settings);

              case 7:
                response = _context17.sent;
                $ = _cheerio2.default.load(response.data);
                pseudId = $('#main > ul.pseud.index.group > li > ul').html().match(/(\d+)/g)[0]; // this is hella janky

                return _context17.abrupt('return', pseudId);

              case 13:
                _context17.prev = 13;
                _context17.t0 = _context17['catch'](4);
                return _context17.abrupt('return', _context17.t0);

              case 16:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, this, [[4, 13]]);
      }));

      function getPseudId(_x18) {
        return _ref24.apply(this, arguments);
      }

      return getPseudId;
    }()

    //   utf8:✓
    // authenticity_token:frpvJRGvgGHIx22GBgjiD/5C4/qVKm7PJU7Hrv372uc=
    // subscription[subscribable_id]:8671489
    // subscription[subscribable_type]:Work

  }, {
    key: 'subscribeWork',
    value: function () {
      var _ref25 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee18(workId) {
        var token, params, endpoint;
        return _regenerator2.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                if (AO3.user) {
                  _context18.next = 3;
                  break;
                }

                _context18.next = 3;
                return AO3.login(AO3.credentials);

              case 3:
                _context18.next = 5;
                return AO3.getToken();

              case 5:
                token = _context18.sent;
                params = _qs2.default.stringify({
                  utf8: '✓',
                  authenticity_token: token,
                  subscription: {
                    subscribable_id: workId,
                    subscribable_type: 'Work'
                  }
                });
                endpoint = AO3.site + '/users/' + AO3.user + '/subscriptions';
                _context18.prev = 8;
                _context18.next = 11;
                return instance.post(endpoint, params, settings);

              case 11:
                return _context18.abrupt('return', _context18.sent);

              case 14:
                _context18.prev = 14;
                _context18.t0 = _context18['catch'](8);
                return _context18.abrupt('return', _context18.t0);

              case 17:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this, [[8, 14]]);
      }));

      function subscribeWork(_x19) {
        return _ref25.apply(this, arguments);
      }

      return subscribeWork;
    }()
  }, {
    key: 'getUserSubscribableId',
    value: function () {
      var _ref26 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee19(user) {
        var endpoint, response, $, userId;
        return _regenerator2.default.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                endpoint = AO3.site + '/users/' + user + '/';
                _context19.prev = 1;
                _context19.next = 4;
                return instance.get(endpoint, settings);

              case 4:
                response = _context19.sent;
                $ = _cheerio2.default.load(response.data);
                userId = $('input#subscription_subscribable_id').attr('value');
                return _context19.abrupt('return', userId);

              case 10:
                _context19.prev = 10;
                _context19.t0 = _context19['catch'](1);
                return _context19.abrupt('return', _context19.t0);

              case 13:
              case 'end':
                return _context19.stop();
            }
          }
        }, _callee19, this, [[1, 10]]);
      }));

      function getUserSubscribableId(_x20) {
        return _ref26.apply(this, arguments);
      }

      return getUserSubscribableId;
    }()

    // endpoint: http://archiveofourown.org/users/nofox/subscriptions
    // query params:
    // utf8:✓
    // authenticity_token:1nPa04CL7ohTd5CpYabEccdXyHsdMiWtFp02mqM1fVc=
    // subscription[subscribable_id]:2724596
    // subscription[subscribable_type]:User
    // returns: {"item_id":94509707,"item_success_message":"You are now following nofox. If you'd like to stop receiving email updates, you can unsubscribe from <a href=\"http://archiveofourown.org/users/nofox/subscriptions\">your Subscriptions page</a>."}

  }, {
    key: 'subscribeUser',
    value: function () {
      var _ref27 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee20(user) {
        var token, userId, endpoint, params, response;
        return _regenerator2.default.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                if (AO3.user) {
                  _context20.next = 3;
                  break;
                }

                _context20.next = 3;
                return AO3.login(AO3.credentials);

              case 3:
                _context20.next = 5;
                return AO3.getToken();

              case 5:
                token = _context20.sent;
                _context20.next = 8;
                return AO3.getUserSubscribableId(user);

              case 8:
                userId = _context20.sent;
                endpoint = AO3.site + '/users/' + AO3.user + '/subscriptions';
                params = _qs2.default.stringify({
                  utf8: '✓',
                  _method: 'put',
                  authenticity_token: token,
                  subscription: {
                    subscribable_id: userId,
                    subscribable_type: 'User'
                  }
                });
                _context20.prev = 11;
                _context20.next = 14;
                return instance.post(endpoint, params, settings);

              case 14:
                response = _context20.sent;
                return _context20.abrupt('return', response);

              case 18:
                _context20.prev = 18;
                _context20.t0 = _context20['catch'](11);
                return _context20.abrupt('return', _context20.t0);

              case 21:
              case 'end':
                return _context20.stop();
            }
          }
        }, _callee20, this, [[11, 18]]);
      }));

      function subscribeUser(_x21) {
        return _ref27.apply(this, arguments);
      }

      return subscribeUser;
    }()

    // endpoint: http://archiveofourown.org/users/nofox/subscriptions/94509707
    // query params: utf8:✓
    // authenticity_token:1nPa04CL7ohTd5CpYabEccdXyHsdMiWtFp02mqM1fVc=
    // subscription[subscribable_id]:2724596
    // subscription[subscribable_type]:User
    // _method:delete

  }, {
    key: 'unsubscribeUser',
    value: function () {
      var _ref28 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee21(user) {
        var token, userId, endpoint, params;
        return _regenerator2.default.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                if (AO3.user) {
                  _context21.next = 3;
                  break;
                }

                _context21.next = 3;
                return AO3.login(AO3.credentials);

              case 3:
                _context21.next = 5;
                return AO3.getToken();

              case 5:
                token = _context21.sent;
                _context21.next = 8;
                return AO3.getUserSubscribableId(user);

              case 8:
                userId = _context21.sent;
                endpoint = AO3.site + '/users/' + AO3.user + '/subscriptions/' + userId;
                params = _qs2.default.stringify({
                  utf8: '✓',
                  _method: 'delete',
                  authenticity_token: token,
                  subscription: {
                    subscribable_id: userId,
                    subscribable_type: 'User'
                  }
                });
                _context21.prev = 11;
                _context21.next = 14;
                return instance.post(endpoint, params, settings);

              case 14:
                return _context21.abrupt('return', _context21.sent);

              case 17:
                _context21.prev = 17;
                _context21.t0 = _context21['catch'](11);
                return _context21.abrupt('return', _context21.t0);

              case 20:
              case 'end':
                return _context21.stop();
            }
          }
        }, _callee21, this, [[11, 17]]);
      }));

      function unsubscribeUser(_x22) {
        return _ref28.apply(this, arguments);
      }

      return unsubscribeUser;
    }()
  }, {
    key: 'profile',
    value: function () {
      var _ref29 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee22(user) {
        return _regenerator2.default.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                _context22.next = 2;
                return AO3.userDashboard(user);

              case 2:
                return _context22.abrupt('return', _context22.sent);

              case 3:
              case 'end':
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function profile(_x23) {
        return _ref29.apply(this, arguments);
      }

      return profile;
    }()

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

  }, {
    key: 'media',
    value: function () {
      var _ref30 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee23(fandom) {
        var endpoint, response, $, index, fandoms;
        return _regenerator2.default.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                endpoint = AO3.site + '/media/' + escape(fandom) + '/fandoms';
                _context23.next = 3;
                return instance.get(endpoint);

              case 3:
                response = _context23.sent;
                $ = _cheerio2.default.load(response.data);
                index = $('ol.fandom').find('li.letter');
                fandoms = index.map(function (i, el) {
                  var letter = $(this).find('h3.heading').text().replace(/\s/g, '').trim();
                  var items = $(this).find('ul.tags').find('li').map(function (i, el) {
                    var tag = $(this).find('a.tag').text();
                    var number = $(this).text().replace(/\D/g, '').trim();
                    return {
                      tag: {
                        name: tag,
                        works: number
                      }
                    };
                  }).get();

                  var payload = (0, _defineProperty3.default)({}, letter, items);

                  return payload;
                }).get();
                return _context23.abrupt('return', {
                  meta: AO3.getResponseMeta(response),
                  data: fandoms
                });

              case 8:
              case 'end':
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      function media(_x24) {
        return _ref30.apply(this, arguments);
      }

      return media;
    }()
  }, {
    key: 'handleRedirect',
    value: function () {
      var _ref31 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee24(endpoint) {
        var response;
        return _regenerator2.default.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                endpoint = AO3.site + '/' + endpoint;
                _context24.next = 3;
                return instance.get(endpoint, settings);

              case 3:
                response = _context24.sent;
                return _context24.abrupt('return', response.data);

              case 5:
              case 'end':
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      function handleRedirect(_x25) {
        return _ref31.apply(this, arguments);
      }

      return handleRedirect;
    }()
  }, {
    key: 'parseChapters',
    value: function parseChapters($) {
      var work = $('div.wrapper');
      var stats = work.find('dd.stats').find('dl.stats');
      var chapters = stats.find('dd.chapters').text();
      return chapters;
    }
  }, {
    key: 'work',
    value: function () {
      var _ref32 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee25(id) {
        var permission, endpoint, response, $, chapters, stats, _title, _text, title, text;

        return _regenerator2.default.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                permission = _qs2.default.stringify({ // NOTE: this is wonky
                  view_adult: true,
                  view_full_work: true
                });
                endpoint = AO3.site + '/works/' + id + '?' + permission;
                _context25.next = 4;
                return instance.get(endpoint, settings);

              case 4:
                response = _context25.sent;
                $ = _cheerio2.default.load(response.data);
                // const redirect = $('div#inner').find('ul.actions').find('a').attr('href');
                //
                // if (redirect) {
                //   $ = cheerio.load(await AO3.handleRedirect(redirect));
                // }

                // console.log(response.data);

                chapters = AO3.parseChapters($);
                stats = AO3.parseStats($('div.wrapper').find('dl.work'));

                if (!(parseInt(chapters, 10) > 1)) {
                  _context25.next = 13;
                  break;
                }

                _title = strip($('div#workskin').find('div.preface').find('h2.title').text());
                _text = $('div#chapters').children('.chapter').map(function (i, el) {
                  var chapterTitle = strip($(el).find('h3.title').text());
                  $(el).find('h3.landmark').replaceWith('<h3 class="landmark heading">' + chapterTitle + '</h3>'); // maybe make this optional
                  var content = $(el).find('div.userstuff').html();
                  return (0, _defineProperty3.default)({}, chapterTitle, content);
                }).get();


                _text = _text.reduce(function (acc, val) {
                  var _Object$keys4 = (0, _keys2.default)(val),
                      _Object$keys5 = (0, _slicedToArray3.default)(_Object$keys4, 1),
                      key = _Object$keys5[0];

                  acc[key] = val[key];
                  return acc;
                }, {});

                return _context25.abrupt('return', {
                  meta: AO3.getResponseMeta(response),
                  data: {
                    title: _title,
                    text: _text,
                    stats: stats
                  }
                });

              case 13:
                title = $('#workskin').find('h2.title').text();
                text = $('#chapters').find('div.userstuff').html();
                return _context25.abrupt('return', {
                  meta: AO3.getResponseMeta(response),
                  data: {
                    title: title,
                    text: text,
                    stats: stats
                  }
                });

              case 16:
              case 'end':
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function work(_x26) {
        return _ref32.apply(this, arguments);
      }

      return work;
    }()
  }, {
    key: 'workComments',
    value: function () {
      var _ref34 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee26(workId, chapterId) {
        var endpoint, response, $, chapterIds, promises;
        return _regenerator2.default.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                if (AO3.user) {
                  _context26.next = 3;
                  break;
                }

                _context26.next = 3;
                return AO3.login(AO3.credentials);

              case 3:
                endpoint = chapterId ? AO3.site + '/works/' + workId + '/chapters/' + chapterId : AO3.site + '/works/' + workId + '/navigate';
                _context26.prev = 4;
                _context26.next = 7;
                return instance.get(endpoint, settings);

              case 7:
                response = _context26.sent;

                if (chapterId) {
                  _context26.next = 15;
                  break;
                }

                $ = _cheerio2.default.load(response.data);
                chapterIds = $('ol.chapter').find('li').map(function (i, el) {
                  var id = $(this).find('a').attr('href').split('/').pop();
                  return id;
                }).get();
                promises = chapterIds.map(function (id) {
                  return instance.get(AO3.site + '/comments/show_comments?chapter_id=' + id, {
                    Accept: '*/*;q=0.5, text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
                    'Accept-Encoding': 'gzip deflate, sdch',
                    'Content-Type': 'text/javascript; charset=utf-8'
                  });
                });
                _context26.next = 14;
                return _promise2.default.all(promises);

              case 14:
                return _context26.abrupt('return', _context26.sent);

              case 15:
                _context26.next = 20;
                break;

              case 17:
                _context26.prev = 17;
                _context26.t0 = _context26['catch'](4);
                return _context26.abrupt('return', _context26.t0);

              case 20:
              case 'end':
                return _context26.stop();
            }
          }
        }, _callee26, this, [[4, 17]]);
      }));

      function workComments(_x27, _x28) {
        return _ref34.apply(this, arguments);
      }

      return workComments;
    }()
  }, {
    key: 'tags',
    value: function () {
      var _ref35 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee27(fandom) {
        var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var page, endpoint, response, $, data, found;
        return _regenerator2.default.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                page = has(query, 'page') ? query.page : 0;
                endpoint = AO3.site + '/tags/' + fandom + '/works?' + _qs2.default.stringify(query);
                _context27.next = 4;
                return instance.get(endpoint);

              case 4:
                response = _context27.sent;
                $ = _cheerio2.default.load(response.data);
                data = AO3.parseWorks($);
                found = $('div#main').find('h2.heading').text().match(/([^of])+(?=Works)/, '')[0].trim();
                return _context27.abrupt('return', {
                  meta: AO3.getResponseMeta(response),
                  data: {
                    page: page,
                    found: found,
                    items: data,
                    length: data.length
                  }
                });

              case 9:
              case 'end':
                return _context27.stop();
            }
          }
        }, _callee27, this);
      }));

      function tags(_x29) {
        return _ref35.apply(this, arguments);
      }

      return tags;
    }()
  }, {
    key: '_formatWorksFilterEndpoint',
    value: function _formatWorksFilterEndpoint(query) {
      var endpoint = AO3.site + '/works?utf8=%E2%9C%93';
      var _query = query,
          tag_id = _query.tag_id,
          term = _query.term;

      delete query.tag_id;
      query = _qs2.default.stringify({ commit: 'Sort and Filter', work_search: term, tag_id: tag_id });
      return endpoint + '&' + query;
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

  }, {
    key: 'worksFilter',
    value: function () {
      var _ref36 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee28(tag) {
        var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var endpoint, response, $, page, found, data;
        return _regenerator2.default.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                _context28.prev = 0;

                (0, _assign2.default)(query, { tag_id: tag });
                endpoint = AO3._formatWorksFilterEndpoint(query);
                _context28.next = 5;
                return instance.get(endpoint, {
                  timeout: 3000
                });

              case 5:
                response = _context28.sent;
                $ = _cheerio2.default.load(response.data);
                page = has(query, 'page') ? query.page : 0;
                found = $('div#main').find('h2.heading').text().match(/([^of])+(?=Works)/, '')[0].trim();
                data = AO3.parseWorks($);
                return _context28.abrupt('return', {
                  meta: AO3.getResponseMeta(response),
                  data: {
                    page: page,
                    found: found,
                    items: data,
                    length: data.length
                  }
                });

              case 13:
                _context28.prev = 13;
                _context28.t0 = _context28['catch'](0);
                return _context28.abrupt('return', _context28.t0);

              case 16:
              case 'end':
                return _context28.stop();
            }
          }
        }, _callee28, this, [[0, 13]]);
      }));

      function worksFilter(_x31) {
        return _ref36.apply(this, arguments);
      }

      return worksFilter;
    }()
  }, {
    key: '_formatWorksSearchEndpoint',
    value: function _formatWorksSearchEndpoint(query, page) {
      query = _qs2.default.stringify({ work_search: query });
      var endpoint = AO3.site + '/works/search';
      if (page === 0) {
        endpoint = endpoint + '?utf8=%E2%9C%93&' + query;
      } else {
        endpoint = endpoint + '?page=' + page + '?utf8=%E2%9C%93&' + query;
      }
      return endpoint;
    }

    // query, title, creator, revised_at, complete, single_chapter, word_count, language_id, fandom_names, rating_ids, warning_ids, category_ids, character_names, relationship_names, freeform_names, hits, kudos_count, comments_count, bookmarks_count, sort_column, sort_direction

  }, {
    key: 'worksSearch',
    value: function () {
      var _ref37 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee29(query) {
        var page, endpoint, response, $, found, data;
        return _regenerator2.default.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                page = has(query, 'page') ? query.page : 0;


                if (page !== 0) {
                  delete query.page;
                }

                endpoint = AO3._formatWorksSearchEndpoint(query, page);
                _context29.prev = 3;
                _context29.next = 6;
                return instance.get(endpoint);

              case 6:
                response = _context29.sent;
                $ = _cheerio2.default.load(response.data);
                found = parseInt($('#main').find('h3.heading').text(), 10);
                data = AO3.parseWorks($);
                return _context29.abrupt('return', {
                  meta: AO3.getResponseMeta(response),
                  data: {
                    page: page,
                    found: found,
                    items: data,
                    length: data.length
                  }
                });

              case 13:
                _context29.prev = 13;
                _context29.t0 = _context29['catch'](3);
                return _context29.abrupt('return', _context29.t0);

              case 16:
              case 'end':
                return _context29.stop();
            }
          }
        }, _callee29, this, [[3, 13]]);
      }));

      function worksSearch(_x33) {
        return _ref37.apply(this, arguments);
      }

      return worksSearch;
    }()
  }, {
    key: 'parseWorks',
    value: function parseWorks($) {
      try {
        return $('ol.work').find('li.work').map(function (i, el) {
          var heading = $(this).find('h4.heading').find('a');
          var title = heading.first().text();
          var author = heading.last().text();
          if (title) {
            var id = $(this).attr('id').replace(/work_/, '');
            var fandom = $(this).find('h5').find('a').text();
            var summary = strip($(this).find('.summary').text());
            var updated = $(this).find('p.datetime').text();

            var stats = AO3.parseStats($(this));
            var tags = AO3.parseTags($, $(el).find('ul.tags'));
            var required_tags = AO3.parseRequiredTags($, this);

            return {
              id: id, title: title, author: author, fandom: fandom, updated: updated, required_tags: required_tags, tags: tags, summary: summary, stats: stats
            };
          }
        }).get();
      } catch (err) {
        return err;
      }
    }

    // content rating, relationships, content warnings, finished?

  }, {
    key: 'parseRequiredTags',
    value: function parseRequiredTags($, el) {
      var _$$find$find$map$get = $(el).find('ul.required-tags').find('li').map(function (i, el) {
        return $(el).find('span').attr('title');
      }).get(),
          _$$find$find$map$get2 = (0, _slicedToArray3.default)(_$$find$find$map$get, 4),
          content_rating = _$$find$find$map$get2[0],
          content_warnings = _$$find$find$map$get2[1],
          relationships = _$$find$find$map$get2[2],
          finished = _$$find$find$map$get2[3];

      return {
        content_rating: content_rating, relationships: relationships, content_warnings: content_warnings, finished: finished
      };
    }
  }, {
    key: 'parseStats',
    value: function parseStats(workHeading) {
      var statsElem = workHeading.find('dl.stats');
      var updated = workHeading.find('div.module').find('p.datetime').text() || statsElem.find('dd.status').text();
      var language = strip(workHeading.find('dd.language').text());
      var words = statsElem.find('dd.words').text();
      var chapters = statsElem.find('dd.chapters').text();
      var kudos = statsElem.find('dd.kudos').text() || 0;
      var bookmarks = statsElem.find('dd.bookmarks').text();
      var hits = statsElem.find('dd.hits').text();

      return {
        language: language, words: words, chapters: chapters, kudos: kudos, bookmarks: bookmarks, hits: hits, updated: updated
      };
    }
  }, {
    key: 'parseTags',
    value: function parseTags($, tagElem) {
      var warnings = tagElem.find('li.warnings').text();
      var relationships = tagElem.find('li.relationships').find('a').map(function (i, el) {
        return $(el).text();
      }).get();
      var freeforms = tagElem.find('li.freeforms').find('a').map(function (i, el) {
        return $(el).text();
      }).get();
      var characters = tagElem.find('li.characters').find('a').map(function (i, el) {
        return $(el).text();
      }).get();

      return {
        warnings: warnings, relationships: relationships, characters: characters, freeforms: freeforms
      };
    }
  }]);
  return AO3;
}();

AO3.site = 'http://archiveofourown.org';
AO3.user = null;
AO3.userId = null;
AO3.token = null;
AO3.credentials = {};
exports.default = AO3;
module.exports = exports['default'];

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUFFbkIsR0FGbUIsRUFBdEI7QUFHQSxVQUFNLFlBQVksUUFBUSxJQUFSLENBQWEsY0FBYixFQUE2QixJQUE3QixDQUFrQyxHQUFsQyxFQUF1QyxHQUF2QyxDQUEyQyxVQUFDLENBQUQsRUFBSSxFQUFKLEVBQVc7QUFDdEUsZUFBTyxFQUFFLEVBQUYsRUFBTSxJQUFOLEVBQVA7QUFDRCxPQUZpQixFQUVmLEdBRmUsRUFBbEI7QUFHQSxVQUFNLGFBQWEsUUFBUSxJQUFSLENBQWEsZUFBYixFQUE4QixJQUE5QixDQUFtQyxHQUFuQyxFQUF3QyxHQUF4QyxDQUE0QyxVQUFDLENBQUQsRUFBSSxFQUFKLEVBQVc7QUFDeEUsZUFBTyxFQUFFLEVBQUYsRUFBTSxJQUFOLEVBQVA7QUFDRCxPQUZrQixFQUVoQixHQUZnQixFQUFuQjs7QUFJQSxhQUFPO0FBQ0wsMEJBREssRUFDSyw0QkFETCxFQUNvQixzQkFEcEIsRUFDZ0M7QUFEaEMsT0FBUDtBQUdEOzs7OztBQW5nQ2tCLEcsQ0FDWixJLEdBQU8sNEI7QUFESyxHLENBRVosSSxHQUFPLEk7QUFGSyxHLENBR1osTSxHQUFTLEk7QUFIRyxHLENBSVosSyxHQUFRLEk7QUFKSSxHLENBS1osVyxHQUFjLEU7a0JBTEYsRyIsImZpbGUiOiJhbzMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuaW1wb3J0IGF4aW9zQ29va2llSmFyU3VwcG9ydCBmcm9tICdAMzg0Nm1hc2EvYXhpb3MtY29va2llamFyLXN1cHBvcnQnO1xuaW1wb3J0IGNoZWVyaW8gZnJvbSAnY2hlZXJpbyc7XG5pbXBvcnQgcXMgZnJvbSAncXMnO1xuXG4vLyBsZXQgY2hlZXJpbztcblxuZnVuY3Rpb24gaXNOb2RlKCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyA/IHByb2Nlc3MgOiAwKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nO1xufVxuXG5mdW5jdGlvbiBzdHJpcChzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9cXHI/XFxufFxcci8sICcnKS50cmltKCk7XG59XG5cbmZ1bmN0aW9uIGhhcyhvYmplY3QsIHByb3BlcnR5KSB7XG4gIHJldHVybiB7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0cyhvYmplY3QsIGRlZmF1bHRPYmopIHtcbiAgZm9yIChsZXQga2V5IGluIGRlZmF1bHRPYmopIHtcbiAgICBpZiAoIW9iamVjdFtrZXldKSB7XG4gICAgICBvYmplY3Rba2V5XSA9IGRlZmF1bHRPYmpba2V5XTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxuLy8gaWYgKGlzTm9kZSgpKSB7XG4vLyAgIGNoZWVyaW8gPSByZXF1aXJlKCdjaGVlcmlvJyk7XG4vLyB9IGVsc2Uge1xuLy8gICAvLyB1c2UganF1ZXJ5XG4vLyB9XG5cbmF4aW9zQ29va2llSmFyU3VwcG9ydChheGlvcyk7XG5cbmNvbnN0IHNldHRpbmdzID0ge1xuICB3aXRoQ3JlZGVudGlhbHM6IHRydWUsXG4gIGphcjogdHJ1ZVxufTtcblxuY29uc3QgaW5zdGFuY2UgPSBheGlvcy5jcmVhdGUoe1xuICBoZWFkZXJzOiB7XG4gICAgJ1gtUmVxdWVzdGVkLVdpdGgnOiAnWE1MSHR0cFJlcXVlc3QnXG4gIH0sXG4gIC4uLnNldHRpbmdzXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQU8zIHtcbiAgc3RhdGljIHNpdGUgPSAnaHR0cDovL2FyY2hpdmVvZm91cm93bi5vcmcnO1xuICBzdGF0aWMgdXNlciA9IG51bGw7XG4gIHN0YXRpYyB1c2VySWQgPSBudWxsO1xuICBzdGF0aWMgdG9rZW4gPSBudWxsO1xuICBzdGF0aWMgY3JlZGVudGlhbHMgPSB7fTtcblxuICBzdGF0aWMgc2V0Q3JlZGVudGlhbHMoeyB1c2VyLCBwYXNzd29yZCB9KSB7XG4gICAgQU8zLmNyZWRlbnRpYWxzID0ge1xuICAgICAgdXNlcixcbiAgICAgIHBhc3N3b3JkXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBnZXRUb2tlbihlbmRwb2ludCkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UuZ2V0KGAke0FPMy5zaXRlfS8ke2VuZHBvaW50ID8gZW5kcG9pbnQgOiAnbG9naW4nfWApO1xuICAgIGNvbnN0ICQgPSBjaGVlcmlvLmxvYWQocmVzcG9uc2UuZGF0YSk7XG4gICAgY29uc3QgdG9rZW4gPSAkKCdtZXRhW25hbWU9XCJjc3JmLXRva2VuXCJdJykuYXR0cignY29udGVudCcpO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodG9rZW4pO1xuICB9XG5cbiAgc3RhdGljIGdldFJlc3BvbnNlTWV0YShyZXNwb25zZSkge1xuICAgIGNvbnN0IHsgc3RhdHVzLCBzdGF0dXNUZXh0LCBoZWFkZXJzLCBjb25maWcgfSA9IHJlc3BvbnNlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1cywgc3RhdHVzVGV4dCwgaGVhZGVycywgY29uZmlnXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBsb2dpbih7IHVzZXIsIHBhc3N3b3JkIH0pIHtcbiAgICBjb25zdCB0b2tlbiA9IGF3YWl0IEFPMy5nZXRUb2tlbigpO1xuICAgIGNvbnN0IGNyZWRlbnRpYWxzID0gcXMuc3RyaW5naWZ5KHtcbiAgICAgIHV0Zjg6ICfinJMnLFxuICAgICAgYXV0aGVudGljaXR5X3Rva2VuOiB0b2tlbixcbiAgICAgIHVzZXJfc2Vzc2lvbjoge1xuICAgICAgICBsb2dpbjogdXNlcixcbiAgICAgICAgcGFzc3dvcmRcbiAgICAgIH0sXG4gICAgICBjb21taXQ6ICdMb2cgSW4nXG4gICAgfSk7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgJHtBTzMuc2l0ZX0vdXNlcl9zZXNzaW9uc2A7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnN0YW5jZS5wb3N0KGVuZHBvaW50LCBjcmVkZW50aWFscywgc2V0dGluZ3MpO1xuICAgICAgY29uc3QgJCA9IGNoZWVyaW8ubG9hZChyZXNwb25zZS5kYXRhKTtcbiAgICAgIGNvbnN0IHVzZXIgPSBzdHJpcCgkKCcjbWFpbicpLmZpbmQoJ2Rpdi51c2VyJykuZmluZCgnZGl2LnByaW1hcnknKS5maW5kKCdoMi5oZWFkaW5nJykudGV4dCgpKTtcblxuICAgICAgQU8zLnVzZXIgPSB1c2VyO1xuXG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBhc3luYyB1c2VyRGFzaGJvYXJkKCkge1xuICAgIGlmICghQU8zLnVzZXIpIHtcbiAgICAgIGF3YWl0IEFPMy5sb2dpbihBTzMuY3JlZGVudGlhbHMpO1xuICAgIH1cblxuICAgIGNvbnN0IGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9L3VzZXJzLyR7QU8zLnVzZXJ9YDtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGluc3RhbmNlLmdldChlbmRwb2ludCwgc2V0dGluZ3MpO1xuICAgIGNvbnN0ICQgPSBjaGVlcmlvLmxvYWQocmVzcG9uc2UuZGF0YSk7XG4gICAgY29uc3QgdXNlciA9IHN0cmlwKCQoJyNtYWluJykuZmluZCgnZGl2LnByaW1hcnknKS5maW5kKCdoMi5oZWFkaW5nJykudGV4dCgpKTtcbiAgICAvLyBUT0RPOiBnZXQgYWxsIGxpc3QgaXRlbXMgb24gcGFnZSwgZS5nLiwgd29ya3MsIGJvb2ttYXJrcywgZXRjLi4uXG4gICAgcmV0dXJuIHVzZXI7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgdXBkYXRlVXNlclByb2ZpbGUoe1xuICAgIGFib3V0TWUsIGxvY2F0aW9uLCB0aXRsZSwgZGF0ZU9mQmlydGg6IHsgeWVhciwgbW9udGgsIGRheSB9XG4gIH0gPSB7XG4gICAgYWJvdXRNZTogJycsIGxvY2F0aW9uOiAnJywgdGl0bGU6ICcnLCBkYXRlT2ZCaXJ0aDogeyB5ZWFyOiAnJywgbW9udGg6ICcnLCBkYXk6ICcnIH1cbiAgfSkge1xuICAgIGlmICghQU8zLnVzZXIpIHtcbiAgICAgIGF3YWl0IEFPMy5sb2dpbihBTzMuY3JlZGVudGlhbHMpO1xuICAgIH1cblxuICAgIGNvbnN0IHRva2VuID0gYXdhaXQgQU8zLmdldFRva2VuKCk7XG4gICAgY29uc3QgcGFyYW1zID0gcXMuc3RyaW5naWZ5KHtcbiAgICAgIF9tZXRob2Q6ICdwdXQnLFxuICAgICAgYXV0aGVudGljaXR5X3Rva2VuOiB0b2tlbixcbiAgICAgIGNvbW1pdDogJ1VwZGF0ZScsXG4gICAgICBwcm9maWxlX2F0dHJpYnV0ZXM6IHtcbiAgICAgICAgdGl0bGUsXG4gICAgICAgIGxvY2F0aW9uLFxuICAgICAgICAnZGF0ZV9vZl9iaXJ0aCgxaSknOiB5ZWFyLFxuICAgICAgICAnZGF0ZV9vZl9iaXJ0aCgyaSknOiBtb250aCxcbiAgICAgICAgJ2RhdGVfb2ZfYmlydGgoM2kpJzogZGF5LFxuICAgICAgICBhYm91dF9tZTogYWJvdXRNZVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9L3VzZXJzLyR7QU8zLnVzZXJ9YDtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGluc3RhbmNlLnBvc3QoZW5kcG9pbnQsIHBhcmFtcywge1xuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9LFxuICAgICAgICAuLi5zZXR0aW5nc1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVuZHBvaW50OiBodHRwOi8vYXJjaGl2ZW9mb3Vyb3duLm9yZy91c2Vycy86dXNlci9wc2V1ZHMvKDp1c2VyfHw6cHNldWQpXG4gIC8vIHF1ZXJ5IHBhcmFtczpcbiAgLy8gLS0tLS0tV2ViS2l0Rm9ybUJvdW5kYXJ5MG1nd3BEVm5VOEdaQlZ4clxuICAvLyBDb250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9XCJ1dGY4XCJcbiAgLy9cbiAgLy8g4pyTXG4gIC8vIC0tLS0tLVdlYktpdEZvcm1Cb3VuZGFyeTBtZ3dwRFZuVThHWkJWeHJcbiAgLy8gQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPVwiX21ldGhvZFwiXG4gIC8vXG4gIC8vIHB1dFxuICAvLyAtLS0tLS1XZWJLaXRGb3JtQm91bmRhcnkwbWd3cERWblU4R1pCVnhyXG4gIC8vIENvbnRlbnQtRGlzcG9zaXRpb246IGZvcm0tZGF0YTsgbmFtZT1cImF1dGhlbnRpY2l0eV90b2tlblwiXG4gIC8vXG4gIC8vIDFuUGEwNENMN29oVGQ1Q3BZYWJFY2NkWHlIc2RNaVd0RnAwMm1xTTFmVmM9XG4gIC8vIC0tLS0tLVdlYktpdEZvcm1Cb3VuZGFyeTBtZ3dwRFZuVThHWkJWeHJcbiAgLy8gQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPVwicHNldWRbZGVzY3JpcHRpb25dXCJcbiAgLy9cbiAgLy9cbiAgLy8gLS0tLS0tV2ViS2l0Rm9ybUJvdW5kYXJ5MG1nd3BEVm5VOEdaQlZ4clxuICAvLyBDb250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9XCJwc2V1ZFtpY29uXVwiOyBmaWxlbmFtZT1cInNvbWJyYV9fX292ZXJ3YXRjaF9fX2ZhbmFydF9ieV9uZWxsX2ZhbGxjYXJkLWRhcGxmOHUuanBnXCJcbiAgLy8gQ29udGVudC1UeXBlOiBpbWFnZS9qcGVnXG4gIC8vXG4gIC8vXG4gIC8vIC0tLS0tLVdlYktpdEZvcm1Cb3VuZGFyeTBtZ3dwRFZuVThHWkJWeHJcbiAgLy8gQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPVwicHNldWRbaWNvbl9hbHRfdGV4dF1cIlxuICAvL1xuICAvL1xuICAvLyAtLS0tLS1XZWJLaXRGb3JtQm91bmRhcnkwbWd3cERWblU4R1pCVnhyXG4gIC8vIENvbnRlbnQtRGlzcG9zaXRpb246IGZvcm0tZGF0YTsgbmFtZT1cInBzZXVkW2ljb25fY29tbWVudF90ZXh0XVwiXG4gIC8vXG4gIC8vXG4gIC8vIC0tLS0tLVdlYktpdEZvcm1Cb3VuZGFyeTBtZ3dwRFZuVThHWkJWeHJcbiAgLy8gQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPVwiY29tbWl0XCJcbiAgLy9cbiAgLy8gVXBkYXRlXG4gIC8vIC0tLS0tLVdlYktpdEZvcm1Cb3VuZGFyeTBtZ3dwRFZuVThHWkJWeHItLVxuXG4gIHN0YXRpYyB1cGRhdGVVc2VyUHNldWQoKSB7IH1cblxuICAvLyBlbmRwb2ludDpcbiAgc3RhdGljIGFzeW5jIHVwZGF0ZVVzZXJOYW1lKG5ld1VzZXJOYW1lKSB7XG4gICAgaWYgKCFBTzMudXNlcikge1xuICAgICAgYXdhaXQgQU8zLmxvZ2luKEFPMy5jcmVkZW50aWFscyk7XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW4gPSBhd2FpdCBBTzMuZ2V0VG9rZW4oKTtcbiAgICBjb25zdCBwYXJhbXMgPSBxcy5zdHJpbmdpZnkoe1xuICAgICAgdXRmODogJ+KckycsXG4gICAgICBhdXRoZW50aWNpdHlfdG9rZW46IHRva2VuLFxuICAgICAgbmV3X2xvZ2luOiBuZXdVc2VyTmFtZSxcbiAgICAgIHBhc3N3b3JkOiBBTzMuY3JlZGVudGlhbHMucGFzc3dvcmQsXG4gICAgICBjb21taXQ6ICdDaGFuZ2UgVXNlciBOYW1lJ1xuICAgIH0pO1xuICAgIGNvbnN0IGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9L3VzZXJzLyR7QU8zLnVzZXJ9L2NoYW5nZWRfdXNlcm5hbWVgO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UucG9zdChlbmRwb2ludCwgcGFyYW1zLCB7XG4gICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0sXG4gICAgICAgIC4uLnNldHRpbmdzXG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFzeW5jIHVwZGF0ZVBhc3N3b3JkKHBhc3N3b3JkKSB7XG4gICAgaWYgKCFBTzMudXNlcikge1xuICAgICAgYXdhaXQgQU8zLmxvZ2luKEFPMy5jcmVkZW50aWFscyk7XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW4gPSBhd2FpdCBBTzMuZ2V0VG9rZW4oKTtcbiAgICBjb25zdCBwYXJhbXMgPSBxcy5zdHJpbmdpZnkoe1xuICAgICAgdXRmODogJ+KckycsXG4gICAgICBhdXRoZW50aWNpdHlfdG9rZW46IHRva2VuLFxuICAgICAgcGFzc3dvcmQsXG4gICAgICBwYXNzd29yZF9jb25maXJtYXRpb246IHBhc3N3b3JkLFxuICAgICAgcGFzc3dvcmRfY2hlY2s6IEFPMy5jcmVkZW50aWFscy5wYXNzd29yZCxcbiAgICAgIGNvbW1pdDogJ0NoYW5nZSBQYXNzd29yZCdcbiAgICB9KTtcbiAgICBjb25zdCBlbmRwb2ludCA9IGAke0FPMy5zaXRlfS91c2Vycy8ke0FPMy51c2VyfS9jaGFuZ2VkX3Bhc3N3b3JkYDtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGluc3RhbmNlLnBvc3QoZW5kcG9pbnQsIHBhcmFtcywge1xuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9LFxuICAgICAgICAuLi5zZXR0aW5nc1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFzeW5jIHVwZGF0ZUVtYWlsKHsgbmV3RW1haWwgfSkge1xuICAgIGlmICghQU8zLnVzZXIpIHtcbiAgICAgIGF3YWl0IEFPMy5sb2dpbihBTzMuY3JlZGVudGlhbHMpO1xuICAgIH1cblxuICAgIGNvbnN0IHRva2VuID0gYXdhaXQgQU8zLmdldFRva2VuKCk7XG4gICAgY29uc3QgcGFyYW1zID0gcXMuc3RyaW5naWZ5KHtcbiAgICAgIHV0Zjg6ICfinJMnLFxuICAgICAgYXV0aGVudGljaXR5X3Rva2VuOiB0b2tlbixcbiAgICAgIG5ld19lbWFpbDogbmV3RW1haWwsXG4gICAgICBlbWFpbF9jb25maXJtYXRpb246IG5ld0VtYWlsLFxuICAgICAgcGFzc3dvcmRfY2hlY2s6IEFPMy5wYXNzd29yZCxcbiAgICAgIGNvbW1pdDogJ0NoYW5nZSBFbWFpbCdcbiAgICB9KTtcbiAgICBjb25zdCBlbmRwb2ludCA9IGAke0FPMy5zaXRlfS91c2Vycy8ke0FPMy51c2VyfS9jaGFuZ2VkX2VtYWlsYDtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGluc3RhbmNlLnBvc3QoZW5kcG9pbnQsIHBhcmFtcywge1xuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9LFxuICAgICAgICAuLi5zZXR0aW5nc1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFzeW5jIHVwZGF0ZVByZWZlcmVuY2VzKHByZWZlcmVuY2VzKSB7XG4gICAgaWYgKCFBTzMudXNlcikge1xuICAgICAgYXdhaXQgQU8zLmxvZ2luKEFPMy5jcmVkZW50aWFscyk7XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW4gPSBhd2FpdCBBTzMuZ2V0VG9rZW4oKTtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IEFPMy5nZXRQcmVmZXJlbmNlcygpO1xuXG4gICAgcHJlZmVyZW5jZXMgPSBkZWZhdWx0cyhwcmVmZXJlbmNlcywgZGF0YSk7XG5cbiAgICBjb25zdCBwYXJhbXMgPSBxcy5zdHJpbmdpZnkoe1xuICAgICAgdXRmODogJ+KckycsXG4gICAgICBfbWV0aG9kOiAncHV0JyxcbiAgICAgIGF1dGhlbnRpY2l0eV90b2tlbjogdG9rZW4sXG4gICAgICBwcmVmZXJlbmNlOiBwcmVmZXJlbmNlcyxcbiAgICAgIGNvbW1pdDogJ1VwZGF0ZSdcbiAgICB9KTtcbiAgICBjb25zdCBlbmRwb2ludCA9IGAke0FPMy5zaXRlfS9wcmVmZXJlbmNlcy91cGRhdGU/dXNlcl9pZD0ke0FPMy51c2VyfWA7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnN0YW5jZS5wb3N0KGVuZHBvaW50LCBwYXJhbXMsIHtcbiAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfSxcbiAgICAgICAgLi4uc2V0dGluZ3NcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGVycjtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZ2V0UHJlZmVyZW5jZXMoKSB7XG4gICAgaWYgKCFBTzMudXNlcikge1xuICAgICAgYXdhaXQgQU8zLmxvZ2luKEFPMy5jcmVkZW50aWFscyk7XG4gICAgfVxuXG4gICAgY29uc3QgZW5kcG9pbnQgPSBgJHtBTzMuc2l0ZX0vdXNlcnMvJHtBTzMudXNlcn0vcHJlZmVyZW5jZXNgO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UuZ2V0KGVuZHBvaW50LCBzZXR0aW5ncyk7XG4gICAgY29uc3QgJCA9IGNoZWVyaW8ubG9hZChyZXNwb25zZS5kYXRhKTtcbiAgICBsZXQgcHJlZmVyZW5jZXMgPSAkKCcjbWFpbicpLmZpbmQoJ2Zvcm0nKS5maW5kKCdmaWVsZHNldCcpLm1hcChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgIGNvbnN0IGhlYWRpbmcgPSAkKHRoaXMpLmZpbmQoJ2xlZ2VuZCcpLnRleHQoKTtcbiAgICAgIGlmIChoZWFkaW5nICYmIGhlYWRpbmcgIT09ICdBY3Rpb25zJykge1xuICAgICAgICByZXR1cm4gJCh0aGlzKS5maW5kKCd1bCcpLmZpbmQoJ2xpJykubWFwKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gJCh0aGlzKS5maW5kKCdpbnB1dCcpLmdldCgxKTtcbiAgICAgICAgICBjb25zdCBpdGVtID0gJChpbnB1dCkuYXR0cignaWQnKS5yZXBsYWNlKC9wcmVmZXJlbmNlXy8sICcnKTtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9ICQoaW5wdXQpLmF0dHIoJ2NoZWNrZWQnKSA/IDEgOiAwO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBbaXRlbV06IHZhbHVlXG4gICAgICAgICAgfTtcbiAgICAgICAgfSkuZ2V0KCk7XG4gICAgICB9XG4gICAgfSkuZ2V0KCk7XG5cbiAgICBwcmVmZXJlbmNlcyA9IHByZWZlcmVuY2VzLnJlZHVjZSgoYWNjLCB2YWwpID0+IHtcbiAgICAgIGNvbnN0IFtrZXldID0gT2JqZWN0LmtleXModmFsKTtcbiAgICAgIGFjY1trZXldID0gdmFsW2tleV07XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcblxuICAgIHJldHVybiB7XG4gICAgICBtZXRhOiBBTzMuZ2V0UmVzcG9uc2VNZXRhKHJlc3BvbnNlKSxcbiAgICAgIGRhdGE6IHByZWZlcmVuY2VzXG4gICAgfTtcbiAgfVxuXG4gIC8vIGVuZHBvaW50OiBodHRwOi8vYXJjaGl2ZW9mb3Vyb3duLm9yZy93b3Jrcy8oOndvcmtJZClcbiAgLy8gcXVlcnkgcGFyYW1zOlxuICAvLyB1dGY4OuKck1xuICAvLyBfbWV0aG9kOnB1dFxuICAvLyBhdXRoZW50aWNpdHlfdG9rZW46MW5QYTA0Q0w3b2hUZDVDcFlhYkVjY2RYeUhzZE1pV3RGcDAybXFNMWZWYz1cbiAgLy8gd29ya1tyYXRpbmdfc3RyaW5nXTpFeHBsaWNpdFxuICAvLyB3b3JrW3dhcm5pbmdfc3RyaW5nc11bXTpDaG9vc2UgTm90IFRvIFVzZSBBcmNoaXZlIFdhcm5pbmdzXG4gIC8vIHdvcmtbZmFuZG9tX3N0cmluZ106T3ZlcndhdGNoIChWaWRlbyBHYW1lKVxuICAvLyB3b3JrW2NhdGVnb3J5X3N0cmluZ11bXTpGL0ZcbiAgLy8gd29ya1tjYXRlZ29yeV9zdHJpbmddW106Ri9NXG4gIC8vIHdvcmtbY2F0ZWdvcnlfc3RyaW5nXVtdOk11bHRpXG4gIC8vIHdvcmtbcmVsYXRpb25zaGlwX3N0cmluZ106TMO6Y2lvIENvcnJlaWEgZG9zIFNhbnRvcy9IYW5hIFwiRC5WYVwiIFNvbmcvU29tYnJhIChPdmVyd2F0Y2gpLCBMw7pjaW8gQ29ycmVpYSBkb3MgU2FudG9zL0hhbmEgXCJELlZhXCIgU29uZywgTMO6Y2lvIENvcnJlaWEgZG9zIFNhbnRvcy9Tb21icmEgKE92ZXJ3YXRjaCksIFNvbWJyYSAoT3ZlcndhdGNoKS9IYW5hIFwiRC5WYVwiIFNvbmdcbiAgLy8gd29ya1tjaGFyYWN0ZXJfc3RyaW5nXTpTb21icmEgKE92ZXJ3YXRjaCksIEzDumNpbyBDb3JyZWlhIGRvcyBTYW50b3MsIEhhbmEgXCJELlZhXCIgU29uZ1xuICAvLyB3b3JrW2ZyZWVmb3JtX3N0cmluZ106TW9yYWxseSBBbWJpZ3VvdXMgQ2hhcmFjdGVyLCBSb3VnaCBTZXgsIERydW5rIFNleCwgTG92ZSBUcmlhbmdsZXMsIEplYWxvdXN5LCBEcnVnc1xuICAvLyB3b3JrW3RpdGxlXTpQYXJhbW91clxuICAvLyB3b3JrW2F1dGhvcl9hdHRyaWJ1dGVzXVtpZHNdW106MjkzMjE1NFxuICAvLyBwc2V1ZFtieWxpbmVdOlxuICAvLyB3b3JrW3N1bW1hcnldOkFmdGVyIGEgZHJ1bmsgZGViYXVjaGVkIHRocmVlc29tZSwgSGFuYSBmaW5kcyBoZXJzZWxmIGluIGEgdGVudW91cyBidXQgbG92aW5nIHJlbGF0aW9uc2hpcCB3aXRoIEzDumNpbyBhbmQgYSBqZWFsb3VzIHJpdmFscnkgd2l0aCBTb21icmEgKEzDumNpbydzIGZyaWVuZCBmcm9tIGhpcyByZXZvbHV0aW9uYXJ5IGRheXMpLiBNdWNoIHRvIGhlciBjaGFncmluLCBhIGZhaWxlZCByZWNvcmQgZGVhbCBmb3JjZXMgTMO6Y2lvIGludG8gYSB0aWdodCBzcG90IGZpbmFuY2lhbGx5IGFuZCBoZSBtdXN0IGNhbGwgaW4gYSBmYXZvciBmcm9tIGhpcyB1bnNjcnVwdWxvdXMgZnJpZW5kLiBMw7pjaW8ncyByZW5ld2VkIGNvbnRhY3Qgd2l0aCBTb21icmEgY2F1c2VzIEhhbmEgdG8gcmV2aXNpdCBzb21lIGFtYmlndW91cyBtZW1vcmllcyBhbmQgcXVlc3Rpb24gTMO6Y2lvJ3MgbW9yYWxpdHkuIFRyb3VibGUgZW5zdWVzLlxuICAvLyBmcm9udC1ub3Rlcy1vcHRpb25zLXNob3c6MVxuICAvLyB3b3JrW25vdGVzXTpKdXN0IGEgd2FybmluZywgU29tYnJhIGlzIGFjdHVhbGx5IGEgYmFkIHBlcnNvbiBhbmQgZG9lcyBzb21lIGFtYmlndW91c2x5IG5vbi1jb25zZW5zdWFsIHRoaW5ncyB0byBIYW5hIGFzIHdlbGwgYXMgaGFzIG5vbi1jb25zZW5zdWFsIHRob3VnaHRzIGFib3V0IGhlci4gVGhpcyBpcyBraW5kIG9mIGEgdGllIGluIGFuZCBlbGFib3JhdGlvbiBvZiBhIDxhIGhyZWY9XCJodHRwczovL3d3dy5mYW5maWN0aW9uLm5ldC9zLzEyMjk0NjgwLzUvVGhlLW9uZS13aGVyZWluLVNvbWJyYS1pcy1hLW1lbmFjZS10by1zb2NpZXR5XCI+YnJpZWYgc2NlbmU8L2E+IEkgd3JvdGUgaW4gYW5vdGhlciA8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFuZmljdGlvbi5uZXQvcy8xMjI5NDY4MC8xL1RoZS1vbmUtd2hlcmVpbi1Tb21icmEtaXMtYS1tZW5hY2UtdG8tc29jaWV0eVwiPmZhbiBmaWN0aW9uPC9hPi4gVGhpcyBpcyBhbHNvIGxpa2UgdGhlIGZpcnN0IHNtdXQgSSd2ZSB3cml0dGVuIGZvciBodW1hbiBleWVzIHNvIEknZCBsb3ZlIGNvbW1lbnRzIGFuZCBjcml0aWNpc20gKHBsZWFzZSBiZSBnZW50bGUpLiBXcml0dGVuIG9uIHNwZWVkLCBtZWFudCB0byBiZSByZWFkIG9uIHNwZWVkLiBPSyBlbmpveS5cbiAgLy8gd29ya1tlbmRub3Rlc106XG4gIC8vIHdvcmtbY29sbGVjdGlvbl9uYW1lc106XG4gIC8vIHdvcmtbcmVjaXBpZW50c106XG4gIC8vIHdvcmtbcGFyZW50X2F0dHJpYnV0ZXNdW3VybF06XG4gIC8vIHdvcmtbcGFyZW50X2F0dHJpYnV0ZXNdW3RpdGxlXTpcbiAgLy8gd29ya1twYXJlbnRfYXR0cmlidXRlc11bYXV0aG9yXTpcbiAgLy8gd29ya1twYXJlbnRfYXR0cmlidXRlc11bbGFuZ3VhZ2VfaWRdOlxuICAvLyB3b3JrW3BhcmVudF9hdHRyaWJ1dGVzXVt0cmFuc2xhdGlvbl06MFxuICAvLyB3b3JrW3Nlcmllc19hdHRyaWJ1dGVzXVtpZF06XG4gIC8vIHdvcmtbc2VyaWVzX2F0dHJpYnV0ZXNdW3RpdGxlXTpcbiAgLy8gY2hhcHRlcnMtb3B0aW9ucy1zaG93OjFcbiAgLy8gd29ya1t3aXBfbGVuZ3RoXTo2XG4gIC8vIHdvcmtbY2hhcHRlcl9hdHRyaWJ1dGVzXVt0aXRsZV06XG4gIC8vIHdvcmtbYmFja2RhdGVdOjBcbiAgLy8gd29ya1tjaGFwdGVyX2F0dHJpYnV0ZXNdW3B1Ymxpc2hlZF9hdCgzaSldOjhcbiAgLy8gd29ya1tjaGFwdGVyX2F0dHJpYnV0ZXNdW3B1Ymxpc2hlZF9hdCgyaSldOjFcbiAgLy8gd29ya1tjaGFwdGVyX2F0dHJpYnV0ZXNdW3B1Ymxpc2hlZF9hdCgxaSldOjIwMTdcbiAgLy8gd29ya1tsYW5ndWFnZV9pZF06MVxuICAvLyB3b3JrW3dvcmtfc2tpbl9pZF06XG4gIC8vIHdvcmtbcmVzdHJpY3RlZF06MFxuICAvLyB3b3JrW2Fub25fY29tbWVudGluZ19kaXNhYmxlZF06MFxuICAvLyB3b3JrW21vZGVyYXRlZF9jb21tZW50aW5nX2VuYWJsZWRdOjBcbiAgLy8gcG9zdF9idXR0b246UG9zdCBXaXRob3V0IFByZXZpZXdcbiAgc3RhdGljIHVwZGF0ZVdvcmsoaWQsIHdvcmspIHsgfVxuXG4gIC8vIGVuZHBvaW50OiBodHRwOi8vYXJjaGl2ZW9mb3Vyb3duLm9yZy93b3Jrcy8oOndvcmtJZCkvY2hhcHRlcnMvKDpjaGFwdGVySWQpXG4gIC8vIHF1ZXJ5IHBhcmFtczpcbiAgLy8gdXRmODrinJNcbiAgLy8gX21ldGhvZDpwdXRcbiAgLy8gYXV0aGVudGljaXR5X3Rva2VuOjFuUGEwNENMN29oVGQ1Q3BZYWJFY2NkWHlIc2RNaVd0RnAwMm1xTTFmVmM9XG4gIC8vIGNoYXB0ZXJbdGl0bGVdOlxuICAvLyBjaGFwdGVyW3Bvc2l0aW9uXToxXG4gIC8vIGNoYXB0ZXJbd2lwX2xlbmd0aF06NlxuICAvLyBjaGFwdGVyW3B1Ymxpc2hlZF9hdCgzaSldOjhcbiAgLy8gY2hhcHRlcltwdWJsaXNoZWRfYXQoMmkpXToxXG4gIC8vIGNoYXB0ZXJbcHVibGlzaGVkX2F0KDFpKV06MjAxN1xuICAvLyBjaGFwdGVyW2F1dGhvcl9hdHRyaWJ1dGVzXVtpZHNdW106MjkzMjE1NFxuICAvLyBwc2V1ZFtieWxpbmVdOlxuICAvLyBjaGFwdGVyW3N1bW1hcnldOlxuICAvLyBjaGFwdGVyW25vdGVzXTpcbiAgLy8gY2hhcHRlcltlbmRub3Rlc106XG4gIC8vIGNoYXB0ZXJbY29udGVudF06XG4gIHN0YXRpYyBhc3luYyB1cGRhdGVXb3JrQ2hhcHRlcih3b3JrSWQsIGNoYXB0ZXJJZCwgY2hhcHRlcikge1xuICAgIGNvbnN0IHRva2VuID0gYXdhaXQgQU8zLmdldFRva2VuKCk7XG4gICAgY29uc3QgcGFyYW1zID0gcXMuc3RyaW5naWZ5KHtcbiAgICAgIHV0Zjg6ICfinJMnLFxuICAgICAgX21ldGhvZDogJ3B1dCcsXG4gICAgICBhdXRoZW50aWNpdHlfdG9rZW46IHRva2VuLFxuICAgICAgY2hhcHRlclxuICAgIH0pO1xuICAgIGNvbnN0IGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9L3dvcmtzLyR7d29ya0lkfS9jaGFwdGVycy8ke2NoYXB0ZXJJZH1gO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGluc3RhbmNlLnBvc3QoZW5kcG9pbnQsIHBhcmFtcywge1xuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9LFxuICAgICAgICAuLi5zZXR0aW5nc1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBnZXROZXdSZWxpY0lkKCkge1xuICAgIGlmICghQU8zLnVzZXIpIHtcbiAgICAgIGF3YWl0IEFPMy5sb2dpbihBTzMuY3JlZGVudGlhbHMpO1xuICAgIH1cblxuICAgIGNvbnN0IGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9L3VzZXJzLyR7QU8zLnVzZXJ9YDtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGluc3RhbmNlLmdldChlbmRwb2ludCk7XG4gICAgICBjb25zdCAkID0gY2hlZXJpby5sb2FkKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgY29uc3Qgc2NyaXB0cyA9ICQoJ2hlYWQnKS5maW5kKCdzY3JpcHQnKS5tYXAoZnVuY3Rpb24gKGVsLCBpKSB7XG4gICAgICAgIHJldHVybiAkKHRoaXMpLmh0bWwoKTtcbiAgICAgIH0pO1xuICAgICAgY29uc3QgbmV3UmVsaWNTY3JpcHQgPSBBcnJheS5mcm9tKHNjcmlwdHMpLmZpbHRlcihlbCA9PiB7XG4gICAgICAgIGlmIChlbC5pbmNsdWRlcygneHBpZCcpKSB7XG4gICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICB9XG4gICAgICB9KVswXTtcbiAgICAgIGNvbnN0IHhwaWQgPSBuZXdSZWxpY1NjcmlwdC5tYXRjaCgvKHhwaWQpP1wiLio/XCIvZylbMF0ucmVwbGFjZSgvXCIvZywgJycpO1xuICAgICAgcmV0dXJuIHhwaWQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBhdXRvY29tcGxldGUodGVybSwgcXVlcnkpIHtcbiAgICBpZiAoIUFPMy51c2VyKSB7XG4gICAgICBhd2FpdCBBTzMubG9naW4oQU8zLmNyZWRlbnRpYWxzKTtcbiAgICB9XG5cbiAgICBjb25zdCB0b2tlbiA9IGF3YWl0IEFPMy5nZXRUb2tlbigpO1xuICAgIGNvbnN0IG5ld1JlbGljSWQgPSBhd2FpdCBBTzMuZ2V0TmV3UmVsaWNJZCgpO1xuXG4gICAgbGV0IGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9L2F1dG9jb21wbGV0ZS9gO1xuXG4gICAgY29uc3QgcGFyYW1zID0ge307XG5cbiAgICBpZiAoaGFzKHF1ZXJ5LCAndHlwZScpKSB7XG4gICAgICBlbmRwb2ludCArPSBxdWVyeS50eXBlO1xuICAgIH1cblxuICAgIGlmIChoYXMocXVlcnksICdmYW5kb20nKSkge1xuICAgICAgcGFyYW1zLmZhbmRvbSA9IFtxdWVyeS5mYW5kb21dO1xuICAgIH1cblxuICAgIHBhcmFtcy50ZXJtID0gdGVybS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UuZ2V0KGVuZHBvaW50LCB7XG4gICAgICAgIHBhcmFtcyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0LCAqLyo7IHE9MC4wMScsXG4gICAgICAgICAgJ0FjY2VwdC1FbmNvZGluZyc6ICdnemlwIGRlZmxhdGUsIHNkY2gnLFxuICAgICAgICAgICdBY2NlcHQtTGFuZ3VhZ2UnOiAnZW4tVVMsZW47cT0wLjgsZnI7cT0wLjYnLFxuICAgICAgICAgICdDb25uZWN0aW9uJzogJ2tlZXAtYWxpdmUnLFxuICAgICAgICAgICdETlQnOiAxLFxuICAgICAgICAgICdYLUNTUkYtVG9rZW4nOiB0b2tlbixcbiAgICAgICAgICAnWC1OZXdSZWxpYy1JRCc6IG5ld1JlbGljSWRcbiAgICAgICAgfSxcbiAgICAgICAgeHNyZkhlYWRlck5hbWU6ICdYLUNTUkYtVE9LRU4nLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJ1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICB9XG5cbiAgLy8gZW5kcG9pbnQ6IGh0dHA6Ly9hcmNoaXZlb2ZvdXJvd24ub3JnL3dvcmtzLyg6d29ya0lkKS9ib29rbWFya3NcbiAgLy8gcXVlcnkgcGFyYW1zOlxuICAvLyB1dGY4OuKck1xuICAvLyBhdXRoZW50aWNpdHlfdG9rZW46MW5QYTA0Q0w3b2hUZDVDcFlhYkVjY2RYeUhzZE1pV3RGcDAybXFNMWZWYz1cbiAgLy8gYm9va21hcmtbcHNldWRfaWRdOjI5MzIxNTRcbiAgLy8gYm9va21hcmtbYm9va21hcmthYmxlX2lkXTo5MjQ5NTAzXG4gIC8vIGJvb2ttYXJrW2Jvb2ttYXJrYWJsZV90eXBlXTpXb3JrXG4gIC8vIGJvb2ttYXJrW25vdGVzXTpcbiAgLy8gYm9va21hcmtbdGFnX3N0cmluZ106XG4gIC8vIGJvb2ttYXJrW2NvbGxlY3Rpb25fbmFtZXNdOlxuICAvLyBib29rbWFya1twcml2YXRlXTowXG4gIC8vIGJvb2ttYXJrW3JlY106MFxuICAvLyBjb21taXQ6Q3JlYXRlXG4gIHN0YXRpYyBhc3luYyBib29rbWFyayh3b3JrSWQsIHsgbm90ZXMsIHRhZ3MsIGNvbGxlY3Rpb25zLCBwcml2ID0gMCwgcmVjID0gMCB9ID0ge30pIHtcbiAgICBpZiAoIUFPMy51c2VyKSB7XG4gICAgICBhd2FpdCBBTzMubG9naW4oQU8zLmNyZWRlbnRpYWxzKTtcbiAgICB9XG5cbiAgICBjb25zdCB0b2tlbiA9IGF3YWl0IEFPMy5nZXRUb2tlbigpO1xuICAgIGNvbnN0IHBzZXVkSWQgPSBhd2FpdCBBTzMuZ2V0UHNldWRJZChBTzMudXNlcik7XG4gICAgY29uc3QgcGFyYW1zID0gcXMuc3RyaW5naWZ5KHtcbiAgICAgIHV0Zjg6ICfinJMnLFxuICAgICAgYXV0aGVudGljaXR5X3Rva2VuOiB0b2tlbixcbiAgICAgIGNvbW1pdDogJ0NyZWF0ZScsXG4gICAgICBib29rbWFyazoge1xuICAgICAgICBwc2V1ZF9pZDogcHNldWRJZCxcbiAgICAgICAgYm9va21hcmthYmxlX2lkOiB3b3JrSWQsXG4gICAgICAgIGJvb2ttYXJrYWJsZV90eXBlOiAnV29yaycsXG4gICAgICAgIG5vdGVzLFxuICAgICAgICB0YWdfc3RyaW5nOiB0YWdzLFxuICAgICAgICBjb2xsZWN0aW9uX25hbWVzOiBjb2xsZWN0aW9ucyxcbiAgICAgICAgJ3ByaXZhdGUnOiBwcml2LFxuICAgICAgICByZWNcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBlbmRwb2ludCA9IGAke0FPMy5zaXRlfS93b3Jrcy8ke3dvcmtJZH0vYm9va21hcmtzYDtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGluc3RhbmNlLnBvc3QoZW5kcG9pbnQsIHBhcmFtcywgc2V0dGluZ3MpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGVycjtcbiAgICB9XG4gIH1cblxuICAvLyBlbmRwb2ludDogaHR0cDovL2FyY2hpdmVvZm91cm93bi5vcmcva3Vkb3MuanNcbiAgLy8gcXVlcnkgcGFyYW1zOlxuICAvLyB1dGY4OuKck1xuICAvLyBhdXRoZW50aWNpdHlfdG9rZW46MW5QYTA0Q0w3b2hUZDVDcFlhYkVjY2RYeUhzZE1pV3RGcDAybXFNMWZWYz1cbiAgLy8ga3Vkb1tjb21tZW50YWJsZV9pZF06NzEyOTg1OVxuICAvLyBrdWRvW2NvbW1lbnRhYmxlX3R5cGVdOldvcmtcbiAgc3RhdGljIGFzeW5jIGdpdmVLdWRvcyh3b3JrSWQpIHtcbiAgICBpZiAoIUFPMy51c2VyKSB7XG4gICAgICBhd2FpdCBBTzMubG9naW4oQU8zLmNyZWRlbnRpYWxzKTtcbiAgICB9XG5cbiAgICBjb25zdCB0b2tlbiA9IGF3YWl0IEFPMy5nZXRUb2tlbigpO1xuICAgIGNvbnN0IHBhcmFtcyA9IHFzLnN0cmluZ2lmeSh7XG4gICAgICB1dGY4OiAn4pyTJyxcbiAgICAgIGF1dGhlbnRpY2l0eV90b2tlbjogdG9rZW4sXG4gICAgICBrdWRvOiB7XG4gICAgICAgIGNvbW1lbnRhYmxlX2lkOiB3b3JrSWQsXG4gICAgICAgIGNvbW1lbnRhYmxlX3R5cGU6ICdXb3JrJ1xuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9L2t1ZG9zLmpzYDtcblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgaW5zdGFuY2UucG9zdChlbmRwb2ludCwgcGFyYW1zLCBzZXR0aW5ncyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVuZHBvaW50OiBodHRwOi8vYXJjaGl2ZW9mb3Vyb3duLm9yZy9jaGFwdGVycy8oOmNoYXB0ZXJJZCkvY29tbWVudHNcbiAgLy8gcXVlcnkgcGFyYW1zOlxuICAvLyB1dGY4OuKck1xuICAvLyBhdXRoZW50aWNpdHlfdG9rZW46MW5QYTA0Q0w3b2hUZDVDcFlhYkVjY2RYeUhzZE1pV3RGcDAybXFNMWZWYz1cbiAgLy8gY29tbWVudFtwc2V1ZF9pZF06MjkzMjE1NFxuICAvLyBjb21tZW50W2NvbnRlbnRdOnRlc3RcbiAgLy8gY29udHJvbGxlcl9uYW1lOmNoYXB0ZXJzXG4gIC8vIGNvbW1pdDpDb21tZW50XG4gIHN0YXRpYyBhc3luYyBjb21tZW50KGNoYXB0ZXJJZCwgY29tbWVudCkge1xuICAgIGlmICghQU8zLnVzZXIpIHtcbiAgICAgIGF3YWl0IEFPMy5sb2dpbihBTzMuY3JlZGVudGlhbHMpO1xuICAgIH1cblxuICAgIGNvbnN0IHRva2VuID0gYXdhaXQgQU8zLmdldFRva2VuKCk7XG4gICAgY29uc3QgcHNldWRJZCA9IGF3YWl0IEFPMy5nZXRQc2V1ZElkKEFPMy51c2VyKTtcbiAgICBjb25zdCBwYXJhbXMgPSBxcy5zdHJpbmdpZnkoe1xuICAgICAgdXRmODogJ+KckycsXG4gICAgICBhdXRoZW50aWNpdHlfdG9rZW46IHRva2VuLFxuICAgICAgY29tbWl0OiAnQ29tbWVudCcsXG4gICAgICBjb21tZW50OiB7XG4gICAgICAgIHBzZXVkX2lkOiBwc2V1ZElkLFxuICAgICAgICBjb250ZW50OiBjb21tZW50LFxuICAgICAgICBjb250cm9sbGVyX25hbWU6ICdjaGFwdGVycydcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBlbmRwb2ludCA9IGAke0FPMy5zaXRlfS9jaGFwdGVycy8ke2NoYXB0ZXJJZH0vY29tbWVudHNgO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBpbnN0YW5jZS5wb3N0KGVuZHBvaW50LCBwYXJhbXMsIHNldHRpbmdzKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICB9XG5cbiAgLy8gY29tbWVudHMgYXJlIGZ1Y2tlZFxuXG4gIHN0YXRpYyBhc3luYyBkZWxldGVDb21tZW50KCkgeyB9XG5cbiAgLy8gZW5kcG9pbnQ6IGh0dHA6Ly9hcmNoaXZlb2ZvdXJvd24ub3JnL3VzZXJzL25vZm94L3BzZXVkc1xuICAvLyBzZWxlY3RvcjogI21haW4gPiB1bC5wc2V1ZC5pbmRleC5ncm91cCA+IGxpID4gdWwgPiBsaTpudGgtY2hpbGQoMikgPiBhXG4gIHN0YXRpYyBhc3luYyBnZXRQc2V1ZElkKHVzZXIpIHtcbiAgICBpZiAoIUFPMy51c2VyKSB7XG4gICAgICBhd2FpdCBBTzMubG9naW4oQU8zLmNyZWRlbnRpYWxzKTtcbiAgICB9XG5cbiAgICBjb25zdCBlbmRwb2ludCA9IGBodHRwOi8vYXJjaGl2ZW9mb3Vyb3duLm9yZy91c2Vycy8ke3VzZXJ9L3BzZXVkc2A7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnN0YW5jZS5nZXQoZW5kcG9pbnQsIHNldHRpbmdzKTtcbiAgICAgIGNvbnN0ICQgPSBjaGVlcmlvLmxvYWQocmVzcG9uc2UuZGF0YSk7XG4gICAgICBjb25zdCBwc2V1ZElkID0gJCgnI21haW4gPiB1bC5wc2V1ZC5pbmRleC5ncm91cCA+IGxpID4gdWwnKS5odG1sKCkubWF0Y2goLyhcXGQrKS9nKVswXTsgLy8gdGhpcyBpcyBoZWxsYSBqYW5reVxuICAgICAgcmV0dXJuIHBzZXVkSWQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cbiAgfVxuXG4gIC8vICAgdXRmODrinJNcbiAgLy8gYXV0aGVudGljaXR5X3Rva2VuOmZycHZKUkd2Z0dISXgyMkdCZ2ppRC81QzQvcVZLbTdQSlU3SHJ2MzcydWM9XG4gIC8vIHN1YnNjcmlwdGlvbltzdWJzY3JpYmFibGVfaWRdOjg2NzE0ODlcbiAgLy8gc3Vic2NyaXB0aW9uW3N1YnNjcmliYWJsZV90eXBlXTpXb3JrXG5cbiAgc3RhdGljIGFzeW5jIHN1YnNjcmliZVdvcmsod29ya0lkKSB7XG4gICAgaWYgKCFBTzMudXNlcikge1xuICAgICAgYXdhaXQgQU8zLmxvZ2luKEFPMy5jcmVkZW50aWFscyk7XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW4gPSBhd2FpdCBBTzMuZ2V0VG9rZW4oKTtcbiAgICBjb25zdCBwYXJhbXMgPSBxcy5zdHJpbmdpZnkoe1xuICAgICAgdXRmODogJ+KckycsXG4gICAgICBhdXRoZW50aWNpdHlfdG9rZW46IHRva2VuLFxuICAgICAgc3Vic2NyaXB0aW9uOiB7XG4gICAgICAgIHN1YnNjcmliYWJsZV9pZDogd29ya0lkLFxuICAgICAgICBzdWJzY3JpYmFibGVfdHlwZTogJ1dvcmsnXG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgJHtBTzMuc2l0ZX0vdXNlcnMvJHtBTzMudXNlcn0vc3Vic2NyaXB0aW9uc2A7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBpbnN0YW5jZS5wb3N0KGVuZHBvaW50LCBwYXJhbXMsIHNldHRpbmdzKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFzeW5jIGdldFVzZXJTdWJzY3JpYmFibGVJZCh1c2VyKSB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgJHtBTzMuc2l0ZX0vdXNlcnMvJHt1c2VyfS9gO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UuZ2V0KGVuZHBvaW50LCBzZXR0aW5ncyk7XG4gICAgICBjb25zdCAkID0gY2hlZXJpby5sb2FkKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgY29uc3QgdXNlcklkID0gJCgnaW5wdXQjc3Vic2NyaXB0aW9uX3N1YnNjcmliYWJsZV9pZCcpLmF0dHIoJ3ZhbHVlJyk7XG4gICAgICByZXR1cm4gdXNlcklkO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGVycjtcbiAgICB9XG4gIH1cblxuICAvLyBlbmRwb2ludDogaHR0cDovL2FyY2hpdmVvZm91cm93bi5vcmcvdXNlcnMvbm9mb3gvc3Vic2NyaXB0aW9uc1xuICAvLyBxdWVyeSBwYXJhbXM6XG4gIC8vIHV0Zjg64pyTXG4gIC8vIGF1dGhlbnRpY2l0eV90b2tlbjoxblBhMDRDTDdvaFRkNUNwWWFiRWNjZFh5SHNkTWlXdEZwMDJtcU0xZlZjPVxuICAvLyBzdWJzY3JpcHRpb25bc3Vic2NyaWJhYmxlX2lkXToyNzI0NTk2XG4gIC8vIHN1YnNjcmlwdGlvbltzdWJzY3JpYmFibGVfdHlwZV06VXNlclxuICAvLyByZXR1cm5zOiB7XCJpdGVtX2lkXCI6OTQ1MDk3MDcsXCJpdGVtX3N1Y2Nlc3NfbWVzc2FnZVwiOlwiWW91IGFyZSBub3cgZm9sbG93aW5nIG5vZm94LiBJZiB5b3UnZCBsaWtlIHRvIHN0b3AgcmVjZWl2aW5nIGVtYWlsIHVwZGF0ZXMsIHlvdSBjYW4gdW5zdWJzY3JpYmUgZnJvbSA8YSBocmVmPVxcXCJodHRwOi8vYXJjaGl2ZW9mb3Vyb3duLm9yZy91c2Vycy9ub2ZveC9zdWJzY3JpcHRpb25zXFxcIj55b3VyIFN1YnNjcmlwdGlvbnMgcGFnZTwvYT4uXCJ9XG4gIHN0YXRpYyBhc3luYyBzdWJzY3JpYmVVc2VyKHVzZXIpIHtcbiAgICBpZiAoIUFPMy51c2VyKSB7XG4gICAgICBhd2FpdCBBTzMubG9naW4oQU8zLmNyZWRlbnRpYWxzKTtcbiAgICB9XG5cbiAgICBjb25zdCB0b2tlbiA9IGF3YWl0IEFPMy5nZXRUb2tlbigpO1xuICAgIGNvbnN0IHVzZXJJZCA9IGF3YWl0IEFPMy5nZXRVc2VyU3Vic2NyaWJhYmxlSWQodXNlcik7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgJHtBTzMuc2l0ZX0vdXNlcnMvJHtBTzMudXNlcn0vc3Vic2NyaXB0aW9uc2A7XG4gICAgY29uc3QgcGFyYW1zID0gcXMuc3RyaW5naWZ5KHtcbiAgICAgIHV0Zjg6ICfinJMnLFxuICAgICAgX21ldGhvZDogJ3B1dCcsXG4gICAgICBhdXRoZW50aWNpdHlfdG9rZW46IHRva2VuLFxuICAgICAgc3Vic2NyaXB0aW9uOiB7XG4gICAgICAgIHN1YnNjcmliYWJsZV9pZDogdXNlcklkLFxuICAgICAgICBzdWJzY3JpYmFibGVfdHlwZTogJ1VzZXInXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnN0YW5jZS5wb3N0KGVuZHBvaW50LCBwYXJhbXMsIHNldHRpbmdzKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICB9XG5cbiAgLy8gZW5kcG9pbnQ6IGh0dHA6Ly9hcmNoaXZlb2ZvdXJvd24ub3JnL3VzZXJzL25vZm94L3N1YnNjcmlwdGlvbnMvOTQ1MDk3MDdcbiAgLy8gcXVlcnkgcGFyYW1zOiB1dGY4OuKck1xuICAvLyBhdXRoZW50aWNpdHlfdG9rZW46MW5QYTA0Q0w3b2hUZDVDcFlhYkVjY2RYeUhzZE1pV3RGcDAybXFNMWZWYz1cbiAgLy8gc3Vic2NyaXB0aW9uW3N1YnNjcmliYWJsZV9pZF06MjcyNDU5NlxuICAvLyBzdWJzY3JpcHRpb25bc3Vic2NyaWJhYmxlX3R5cGVdOlVzZXJcbiAgLy8gX21ldGhvZDpkZWxldGVcbiAgc3RhdGljIGFzeW5jIHVuc3Vic2NyaWJlVXNlcih1c2VyKSB7XG4gICAgaWYgKCFBTzMudXNlcikge1xuICAgICAgYXdhaXQgQU8zLmxvZ2luKEFPMy5jcmVkZW50aWFscyk7XG4gICAgfVxuICAgIGNvbnN0IHRva2VuID0gYXdhaXQgQU8zLmdldFRva2VuKCk7XG4gICAgY29uc3QgdXNlcklkID0gYXdhaXQgQU8zLmdldFVzZXJTdWJzY3JpYmFibGVJZCh1c2VyKTtcbiAgICBjb25zdCBlbmRwb2ludCA9IGAke0FPMy5zaXRlfS91c2Vycy8ke0FPMy51c2VyfS9zdWJzY3JpcHRpb25zLyR7dXNlcklkfWA7XG4gICAgY29uc3QgcGFyYW1zID0gcXMuc3RyaW5naWZ5KHtcbiAgICAgIHV0Zjg6ICfinJMnLFxuICAgICAgX21ldGhvZDogJ2RlbGV0ZScsXG4gICAgICBhdXRoZW50aWNpdHlfdG9rZW46IHRva2VuLFxuICAgICAgc3Vic2NyaXB0aW9uOiB7XG4gICAgICAgIHN1YnNjcmliYWJsZV9pZDogdXNlcklkLFxuICAgICAgICBzdWJzY3JpYmFibGVfdHlwZTogJ1VzZXInXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IGluc3RhbmNlLnBvc3QoZW5kcG9pbnQsIHBhcmFtcywgc2V0dGluZ3MpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGVycjtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgcHJvZmlsZSh1c2VyKSB7XG4gICAgcmV0dXJuIGF3YWl0IEFPMy51c2VyRGFzaGJvYXJkKHVzZXIpO1xuICB9XG5cbiAgLy8gcmV0dXJuIGFsbCB0YWdzIGluIGEgZmFuZG9tXG4gIC8vIEFuaW1lICYgTWFuZ2FcbiAgLy8gQm9va3MgJiBMaXRlcmF0dXJlXG4gIC8vIENhcnRvb25zICYgQ29taWNzICYgR3JhcGhpYyBOb3ZlbHNcbiAgLy8gQ2VsZWJyaXRpZXMgJiBSZWFsIFBlb3BsZVxuICAvLyBNb3ZpZXNcbiAgLy8gTXVzaWMgJiBCcmFuZHNcbiAgLy8gT3RoZXIgTWVkaWFcbiAgLy8gVGhlYXRyZVxuICAvLyBUViBTaG93c1xuICAvLyBWaWRlbyBHYW1lc1xuICAvLyBVbmNhdGVnb3JpemVkIEZhbmRvbXNcbiAgc3RhdGljIGFzeW5jIG1lZGlhKGZhbmRvbSkge1xuICAgIGNvbnN0IGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9L21lZGlhLyR7ZXNjYXBlKGZhbmRvbSl9L2ZhbmRvbXNgO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UuZ2V0KGVuZHBvaW50KTtcbiAgICBjb25zdCAkID0gY2hlZXJpby5sb2FkKHJlc3BvbnNlLmRhdGEpO1xuICAgIGNvbnN0IGluZGV4ID0gJCgnb2wuZmFuZG9tJykuZmluZCgnbGkubGV0dGVyJyk7XG4gICAgY29uc3QgZmFuZG9tcyA9IGluZGV4Lm1hcChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgIGNvbnN0IGxldHRlciA9ICQodGhpcykuZmluZCgnaDMuaGVhZGluZycpLnRleHQoKS5yZXBsYWNlKC9cXHMvZywgJycpLnRyaW0oKTtcbiAgICAgIGNvbnN0IGl0ZW1zID0gJCh0aGlzKS5maW5kKCd1bC50YWdzJykuZmluZCgnbGknKS5tYXAoZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICAgIGNvbnN0IHRhZyA9ICQodGhpcykuZmluZCgnYS50YWcnKS50ZXh0KCk7XG4gICAgICAgIGNvbnN0IG51bWJlciA9ICQodGhpcykudGV4dCgpLnJlcGxhY2UoL1xcRC9nLCAnJykudHJpbSgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRhZzoge1xuICAgICAgICAgICAgbmFtZTogdGFnLFxuICAgICAgICAgICAgd29ya3M6IG51bWJlclxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0pLmdldCgpO1xuXG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICBbbGV0dGVyXTogaXRlbXNcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgIH0pLmdldCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1ldGE6IEFPMy5nZXRSZXNwb25zZU1ldGEocmVzcG9uc2UpLFxuICAgICAgZGF0YTogZmFuZG9tc1xuICAgIH07XG4gIH1cblxuICAvLyByZXR1cm5zIGxhdGVzdCB3b3Jrc1xuICByZWNlbnRXb3JrcygpIHsgfVxuXG4gIHN0YXRpYyBhc3luYyBoYW5kbGVSZWRpcmVjdChlbmRwb2ludCkge1xuICAgIGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9LyR7ZW5kcG9pbnR9YDtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGluc3RhbmNlLmdldChlbmRwb2ludCwgc2V0dGluZ3MpO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gIH1cblxuICBzdGF0aWMgcGFyc2VDaGFwdGVycygkKSB7XG4gICAgbGV0IHdvcmsgPSAkKCdkaXYud3JhcHBlcicpO1xuICAgIGxldCBzdGF0cyA9IHdvcmsuZmluZCgnZGQuc3RhdHMnKS5maW5kKCdkbC5zdGF0cycpO1xuICAgIGxldCBjaGFwdGVycyA9IHN0YXRzLmZpbmQoJ2RkLmNoYXB0ZXJzJykudGV4dCgpO1xuICAgIHJldHVybiBjaGFwdGVycztcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyB3b3JrKGlkKSB7XG4gICAgY29uc3QgcGVybWlzc2lvbiA9IHFzLnN0cmluZ2lmeSh7IC8vIE5PVEU6IHRoaXMgaXMgd29ua3lcbiAgICAgIHZpZXdfYWR1bHQ6IHRydWUsXG4gICAgICB2aWV3X2Z1bGxfd29yazogdHJ1ZVxuICAgIH0pO1xuICAgIGNvbnN0IGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9L3dvcmtzLyR7aWR9PyR7cGVybWlzc2lvbn1gO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UuZ2V0KGVuZHBvaW50LCBzZXR0aW5ncyk7XG4gICAgbGV0ICQgPSBjaGVlcmlvLmxvYWQocmVzcG9uc2UuZGF0YSk7XG4gICAgLy8gY29uc3QgcmVkaXJlY3QgPSAkKCdkaXYjaW5uZXInKS5maW5kKCd1bC5hY3Rpb25zJykuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcbiAgICAvL1xuICAgIC8vIGlmIChyZWRpcmVjdCkge1xuICAgIC8vICAgJCA9IGNoZWVyaW8ubG9hZChhd2FpdCBBTzMuaGFuZGxlUmVkaXJlY3QocmVkaXJlY3QpKTtcbiAgICAvLyB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKTtcblxuICAgIGNvbnN0IGNoYXB0ZXJzID0gQU8zLnBhcnNlQ2hhcHRlcnMoJCk7XG4gICAgY29uc3Qgc3RhdHMgPSBBTzMucGFyc2VTdGF0cygkKCdkaXYud3JhcHBlcicpLmZpbmQoJ2RsLndvcmsnKSk7XG5cbiAgICBpZiAocGFyc2VJbnQoY2hhcHRlcnMsIDEwKSA+IDEpIHtcbiAgICAgIGNvbnN0IHRpdGxlID0gc3RyaXAoJCgnZGl2I3dvcmtza2luJykuZmluZCgnZGl2LnByZWZhY2UnKS5maW5kKCdoMi50aXRsZScpLnRleHQoKSk7XG4gICAgICBsZXQgdGV4dCA9ICQoJ2RpdiNjaGFwdGVycycpLmNoaWxkcmVuKCcuY2hhcHRlcicpLm1hcChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgICAgY29uc3QgY2hhcHRlclRpdGxlID0gc3RyaXAoJChlbCkuZmluZCgnaDMudGl0bGUnKS50ZXh0KCkpO1xuICAgICAgICAkKGVsKS5maW5kKCdoMy5sYW5kbWFyaycpLnJlcGxhY2VXaXRoKGA8aDMgY2xhc3M9XCJsYW5kbWFyayBoZWFkaW5nXCI+JHtjaGFwdGVyVGl0bGV9PC9oMz5gKTsgLy8gbWF5YmUgbWFrZSB0aGlzIG9wdGlvbmFsXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSAkKGVsKS5maW5kKCdkaXYudXNlcnN0dWZmJykuaHRtbCgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIFtjaGFwdGVyVGl0bGVdOiBjb250ZW50XG4gICAgICAgIH07XG4gICAgICB9KS5nZXQoKTtcblxuICAgICAgdGV4dCA9IHRleHQucmVkdWNlKChhY2MsIHZhbCkgPT4ge1xuICAgICAgICBjb25zdCBba2V5XSA9IE9iamVjdC5rZXlzKHZhbCk7XG4gICAgICAgIGFjY1trZXldID0gdmFsW2tleV07XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LCB7fSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1ldGE6IEFPMy5nZXRSZXNwb25zZU1ldGEocmVzcG9uc2UpLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgdGV4dCxcbiAgICAgICAgICBzdGF0c1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IHRpdGxlID0gJCgnI3dvcmtza2luJykuZmluZCgnaDIudGl0bGUnKS50ZXh0KCk7XG4gICAgY29uc3QgdGV4dCA9ICQoJyNjaGFwdGVycycpLmZpbmQoJ2Rpdi51c2Vyc3R1ZmYnKS5odG1sKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbWV0YTogQU8zLmdldFJlc3BvbnNlTWV0YShyZXNwb25zZSksXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHRpdGxlLFxuICAgICAgICB0ZXh0LFxuICAgICAgICBzdGF0c1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgd29ya0NvbW1lbnRzKHdvcmtJZCwgY2hhcHRlcklkKSB7XG4gICAgaWYgKCFBTzMudXNlcikge1xuICAgICAgYXdhaXQgQU8zLmxvZ2luKEFPMy5jcmVkZW50aWFscyk7XG4gICAgfVxuICAgIGNvbnN0IGVuZHBvaW50ID0gY2hhcHRlcklkID8gYCR7QU8zLnNpdGV9L3dvcmtzLyR7d29ya0lkfS9jaGFwdGVycy8ke2NoYXB0ZXJJZH1gIDogYCR7QU8zLnNpdGV9L3dvcmtzLyR7d29ya0lkfS9uYXZpZ2F0ZWA7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnN0YW5jZS5nZXQoZW5kcG9pbnQsIHNldHRpbmdzKTtcbiAgICAgIGlmICghY2hhcHRlcklkKSB7XG4gICAgICAgIGxldCAkID0gY2hlZXJpby5sb2FkKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICBjb25zdCBjaGFwdGVySWRzID0gJCgnb2wuY2hhcHRlcicpLmZpbmQoJ2xpJykubWFwKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICAgIGNvbnN0IGlkID0gJCh0aGlzKS5maW5kKCdhJykuYXR0cignaHJlZicpLnNwbGl0KCcvJykucG9wKCk7XG4gICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9KS5nZXQoKTtcbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBjaGFwdGVySWRzLm1hcChpZCA9PiB7XG4gICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmdldChgJHtBTzMuc2l0ZX0vY29tbWVudHMvc2hvd19jb21tZW50cz9jaGFwdGVyX2lkPSR7aWR9YCwge1xuICAgICAgICAgICAgQWNjZXB0OiAnKi8qO3E9MC41LCB0ZXh0L2phdmFzY3JpcHQsIGFwcGxpY2F0aW9uL2phdmFzY3JpcHQsIGFwcGxpY2F0aW9uL2VjbWFzY3JpcHQsIGFwcGxpY2F0aW9uL3gtZWNtYXNjcmlwdCcsXG4gICAgICAgICAgICAnQWNjZXB0LUVuY29kaW5nJzogJ2d6aXAgZGVmbGF0ZSwgc2RjaCcsXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvamF2YXNjcmlwdDsgY2hhcnNldD11dGYtOCdcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cbiAgfVxuXG4gIC8vIHJldHVybnMgbGF0ZXN0IGJvb2ttYXJrc1xuICBib29rbWFya3MoKSB7IH1cblxuICAvLyBtb3N0IHBvcHVsYXIgYW5kIHJhbmRvbVxuICAvLyB0YWdzLzpmYW5kb20vd29ya3M/e3F1ZXJ5fVxuICBzdGF0aWMgYXN5bmMgdGFncyhmYW5kb20sIHF1ZXJ5ID0ge30pIHtcbiAgICBjb25zdCBwYWdlID0gaGFzKHF1ZXJ5LCAncGFnZScpID8gcXVlcnkucGFnZSA6IDA7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgJHtBTzMuc2l0ZX0vdGFncy8ke2ZhbmRvbX0vd29ya3M/JHtxcy5zdHJpbmdpZnkocXVlcnkpfWA7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnN0YW5jZS5nZXQoZW5kcG9pbnQpO1xuICAgIGNvbnN0ICQgPSBjaGVlcmlvLmxvYWQocmVzcG9uc2UuZGF0YSk7XG4gICAgY29uc3QgZGF0YSA9IEFPMy5wYXJzZVdvcmtzKCQpO1xuICAgIGNvbnN0IGZvdW5kID0gJCgnZGl2I21haW4nKS5maW5kKCdoMi5oZWFkaW5nJykudGV4dCgpLm1hdGNoKC8oW15vZl0pKyg/PVdvcmtzKS8sICcnKVswXS50cmltKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbWV0YTogQU8zLmdldFJlc3BvbnNlTWV0YShyZXNwb25zZSksXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHBhZ2UsXG4gICAgICAgIGZvdW5kLFxuICAgICAgICBpdGVtczogZGF0YSxcbiAgICAgICAgbGVuZ3RoOiBkYXRhLmxlbmd0aFxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBzaG93cyBhbGwgY29sbGVjdGlvbnNcbiAgY29sbGVjdGlvbnMoKSB7IH1cblxuICAvLyBhbGwgY2hhbGxlbmdlcyBvciBnaWZ0IGV4Y2hhbmdlIGNoYWxsZW5nZXNcbiAgY2hhbGxlbmdlcygpIHsgfVxuXG4gIC8vIGFwcGxpZXMgY29sbGVjdGlvbnMgZmlsdGVyc1xuICBjb2xsZWN0aW9uc1NlYXJjaCgpIHsgfVxuXG4gIHN0YXRpYyBfZm9ybWF0V29ya3NGaWx0ZXJFbmRwb2ludChxdWVyeSkge1xuICAgIGxldCBlbmRwb2ludCA9IGAke0FPMy5zaXRlfS93b3Jrcz91dGY4PSVFMiU5QyU5M2A7XG4gICAgY29uc3QgeyB0YWdfaWQsIHRlcm0gfSA9IHF1ZXJ5O1xuICAgIGRlbGV0ZSBxdWVyeS50YWdfaWQ7XG4gICAgcXVlcnkgPSBxcy5zdHJpbmdpZnkoeyBjb21taXQ6ICdTb3J0IGFuZCBGaWx0ZXInLCB3b3JrX3NlYXJjaDogdGVybSwgdGFnX2lkIH0pO1xuICAgIHJldHVybiBgJHtlbmRwb2ludH0mJHtxdWVyeX1gO1xuICB9XG5cbiAgLy8gd29ya19zZWFyY2g6XG4gIC8vICB7IHNvcnRfY29sdW1uOiAncmV2aXNlZF9hdCcsXG4gIC8vICAgIHJhdGluZ19pZHM6IFsgJzExJyBdLFxuICAvLyAgICB3YXJuaW5nX2lkczogWyAnMTQnLCAnMTcnIF0sXG4gIC8vICAgIGNhdGVnb3J5X2lkczogWyAnMjInLCAnMjI0NicsICcxMTYnLCAnMjMnLCAnMjEnLCAnMjQnIF0sXG4gIC8vICAgIGZhbmRvbV9pZHM6IFsgJzM0MDY1MTQnIF0sXG4gIC8vICAgIGNoYXJhY3Rlcl9pZHM6XG4gIC8vICAgICBbICc5Mjc4NzQwJyxcbiAgLy8gICAgICAgJzk2MDQxMTcnLFxuICAvLyAgICAgICAnNzI2NjQ3NicsXG4gIC8vICAgICAgICc3OTcwNzU4JyxcbiAgLy8gICAgICAgJzcyNjY0NzMnLFxuICAvLyAgICAgICAnNzk3MDg2MycsXG4gIC8vICAgICAgICc5ODYwMzAyJyxcbiAgLy8gICAgICAgJzk4NjAwOTgnLFxuICAvLyAgICAgICAnMTAyNzAzNDgnLFxuICAvLyAgICAgICAnOTg2MDMyOScgXSxcbiAgLy8gICAgcmVsYXRpb25zaGlwX2lkczogWyAnMTAxMTc5NDAnLCAnODk0MDU4OScgXSxcbiAgLy8gICAgZnJlZWZvcm1faWRzOiBbICc5ODcwMCcgXSxcbiAgLy8gICAgb3RoZXJfdGFnX25hbWVzOiAnJyxcbiAgLy8gICAgcXVlcnk6ICcnLFxuICAvLyAgICBsYW5ndWFnZV9pZDogJzEnLFxuICAvLyAgICBjb21wbGV0ZTogWyAnMCcsICcxJyBdIH1cblxuICBzdGF0aWMgYXN5bmMgd29ya3NGaWx0ZXIodGFnLCBxdWVyeSA9IHt9KSB7XG4gICAgdHJ5IHtcbiAgICAgIE9iamVjdC5hc3NpZ24ocXVlcnksIHsgdGFnX2lkOiB0YWcgfSk7XG4gICAgICBjb25zdCBlbmRwb2ludCA9IEFPMy5fZm9ybWF0V29ya3NGaWx0ZXJFbmRwb2ludChxdWVyeSk7XG5cbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UuZ2V0KGVuZHBvaW50LCB7XG4gICAgICAgIHRpbWVvdXQ6IDMwMDBcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCAkID0gY2hlZXJpby5sb2FkKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgY29uc3QgcGFnZSA9IGhhcyhxdWVyeSwgJ3BhZ2UnKSA/IHF1ZXJ5LnBhZ2UgOiAwO1xuICAgICAgY29uc3QgZm91bmQgPSAkKCdkaXYjbWFpbicpLmZpbmQoJ2gyLmhlYWRpbmcnKS50ZXh0KCkubWF0Y2goLyhbXm9mXSkrKD89V29ya3MpLywgJycpWzBdLnRyaW0oKTtcblxuICAgICAgY29uc3QgZGF0YSA9IEFPMy5wYXJzZVdvcmtzKCQpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZXRhOiBBTzMuZ2V0UmVzcG9uc2VNZXRhKHJlc3BvbnNlKSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgZm91bmQsXG4gICAgICAgICAgaXRlbXM6IGRhdGEsXG4gICAgICAgICAgbGVuZ3RoOiBkYXRhLmxlbmd0aFxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGVycjtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgX2Zvcm1hdFdvcmtzU2VhcmNoRW5kcG9pbnQocXVlcnksIHBhZ2UpIHtcbiAgICBxdWVyeSA9IHFzLnN0cmluZ2lmeSh7IHdvcmtfc2VhcmNoOiBxdWVyeSB9KTtcbiAgICBsZXQgZW5kcG9pbnQgPSBgJHtBTzMuc2l0ZX0vd29ya3Mvc2VhcmNoYDtcbiAgICBpZiAocGFnZSA9PT0gMCkge1xuICAgICAgZW5kcG9pbnQgPSBgJHtlbmRwb2ludH0/dXRmOD0lRTIlOUMlOTMmJHtxdWVyeX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmRwb2ludCA9IGAke2VuZHBvaW50fT9wYWdlPSR7cGFnZX0/dXRmOD0lRTIlOUMlOTMmJHtxdWVyeX1gO1xuICAgIH1cbiAgICByZXR1cm4gZW5kcG9pbnQ7XG4gIH1cblxuICAvLyBxdWVyeSwgdGl0bGUsIGNyZWF0b3IsIHJldmlzZWRfYXQsIGNvbXBsZXRlLCBzaW5nbGVfY2hhcHRlciwgd29yZF9jb3VudCwgbGFuZ3VhZ2VfaWQsIGZhbmRvbV9uYW1lcywgcmF0aW5nX2lkcywgd2FybmluZ19pZHMsIGNhdGVnb3J5X2lkcywgY2hhcmFjdGVyX25hbWVzLCByZWxhdGlvbnNoaXBfbmFtZXMsIGZyZWVmb3JtX25hbWVzLCBoaXRzLCBrdWRvc19jb3VudCwgY29tbWVudHNfY291bnQsIGJvb2ttYXJrc19jb3VudCwgc29ydF9jb2x1bW4sIHNvcnRfZGlyZWN0aW9uXG4gIHN0YXRpYyBhc3luYyB3b3Jrc1NlYXJjaChxdWVyeSkge1xuICAgIGNvbnN0IHBhZ2UgPSBoYXMocXVlcnksICdwYWdlJykgPyBxdWVyeS5wYWdlIDogMDtcblxuICAgIGlmIChwYWdlICE9PSAwKSB7XG4gICAgICBkZWxldGUgcXVlcnkucGFnZTtcbiAgICB9XG5cbiAgICBjb25zdCBlbmRwb2ludCA9IEFPMy5fZm9ybWF0V29ya3NTZWFyY2hFbmRwb2ludChxdWVyeSwgcGFnZSk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnN0YW5jZS5nZXQoZW5kcG9pbnQpO1xuICAgICAgY29uc3QgJCA9IGNoZWVyaW8ubG9hZChyZXNwb25zZS5kYXRhKTtcbiAgICAgIGNvbnN0IGZvdW5kID0gcGFyc2VJbnQoJCgnI21haW4nKS5maW5kKCdoMy5oZWFkaW5nJykudGV4dCgpLCAxMCk7XG4gICAgICBjb25zdCBkYXRhID0gQU8zLnBhcnNlV29ya3MoJCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZXRhOiBBTzMuZ2V0UmVzcG9uc2VNZXRhKHJlc3BvbnNlKSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgZm91bmQsXG4gICAgICAgICAgaXRlbXM6IGRhdGEsXG4gICAgICAgICAgbGVuZ3RoOiBkYXRhLmxlbmd0aFxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGVycjtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgcGFyc2VXb3JrcygkKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAkKCdvbC53b3JrJykuZmluZCgnbGkud29yaycpLm1hcChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgICAgY29uc3QgaGVhZGluZyA9ICQodGhpcykuZmluZCgnaDQuaGVhZGluZycpLmZpbmQoJ2EnKTtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBoZWFkaW5nLmZpcnN0KCkudGV4dCgpO1xuICAgICAgICBjb25zdCBhdXRob3IgPSBoZWFkaW5nLmxhc3QoKS50ZXh0KCk7XG4gICAgICAgIGlmICh0aXRsZSkge1xuICAgICAgICAgIGNvbnN0IGlkID0gJCh0aGlzKS5hdHRyKCdpZCcpLnJlcGxhY2UoL3dvcmtfLywgJycpO1xuICAgICAgICAgIGNvbnN0IGZhbmRvbSA9ICQodGhpcykuZmluZCgnaDUnKS5maW5kKCdhJykudGV4dCgpO1xuICAgICAgICAgIGNvbnN0IHN1bW1hcnkgPSBzdHJpcCgkKHRoaXMpLmZpbmQoJy5zdW1tYXJ5JykudGV4dCgpKTtcbiAgICAgICAgICBjb25zdCB1cGRhdGVkID0gJCh0aGlzKS5maW5kKCdwLmRhdGV0aW1lJykudGV4dCgpO1xuXG4gICAgICAgICAgY29uc3Qgc3RhdHMgPSBBTzMucGFyc2VTdGF0cygkKHRoaXMpKTtcbiAgICAgICAgICBjb25zdCB0YWdzID0gQU8zLnBhcnNlVGFncygkLCAkKGVsKS5maW5kKCd1bC50YWdzJykpO1xuICAgICAgICAgIGNvbnN0IHJlcXVpcmVkX3RhZ3MgPSBBTzMucGFyc2VSZXF1aXJlZFRhZ3MoJCwgdGhpcyk7XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQsIHRpdGxlLCBhdXRob3IsIGZhbmRvbSwgdXBkYXRlZCwgcmVxdWlyZWRfdGFncywgdGFncywgc3VtbWFyeSwgc3RhdHNcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9KS5nZXQoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICB9XG5cbiAgLy8gY29udGVudCByYXRpbmcsIHJlbGF0aW9uc2hpcHMsIGNvbnRlbnQgd2FybmluZ3MsIGZpbmlzaGVkP1xuICBzdGF0aWMgcGFyc2VSZXF1aXJlZFRhZ3MoJCwgZWwpIHtcbiAgICBjb25zdCBbY29udGVudF9yYXRpbmcsIGNvbnRlbnRfd2FybmluZ3MsIHJlbGF0aW9uc2hpcHMsIGZpbmlzaGVkXSA9ICQoZWwpLmZpbmQoJ3VsLnJlcXVpcmVkLXRhZ3MnKS5maW5kKCdsaScpLm1hcCgoaSwgZWwpID0+IHtcbiAgICAgIHJldHVybiAkKGVsKS5maW5kKCdzcGFuJykuYXR0cigndGl0bGUnKTtcbiAgICB9KS5nZXQoKTtcblxuICAgIHJldHVybiB7XG4gICAgICBjb250ZW50X3JhdGluZywgcmVsYXRpb25zaGlwcywgY29udGVudF93YXJuaW5ncywgZmluaXNoZWRcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIHBhcnNlU3RhdHMod29ya0hlYWRpbmcpIHtcbiAgICBjb25zdCBzdGF0c0VsZW0gPSB3b3JrSGVhZGluZy5maW5kKCdkbC5zdGF0cycpO1xuICAgIGNvbnN0IHVwZGF0ZWQgPSB3b3JrSGVhZGluZy5maW5kKCdkaXYubW9kdWxlJykuZmluZCgncC5kYXRldGltZScpLnRleHQoKSB8fCBzdGF0c0VsZW0uZmluZCgnZGQuc3RhdHVzJykudGV4dCgpO1xuICAgIGNvbnN0IGxhbmd1YWdlID0gc3RyaXAod29ya0hlYWRpbmcuZmluZCgnZGQubGFuZ3VhZ2UnKS50ZXh0KCkpO1xuICAgIGNvbnN0IHdvcmRzID0gc3RhdHNFbGVtLmZpbmQoJ2RkLndvcmRzJykudGV4dCgpO1xuICAgIGNvbnN0IGNoYXB0ZXJzID0gc3RhdHNFbGVtLmZpbmQoJ2RkLmNoYXB0ZXJzJykudGV4dCgpO1xuICAgIGNvbnN0IGt1ZG9zID0gc3RhdHNFbGVtLmZpbmQoJ2RkLmt1ZG9zJykudGV4dCgpIHx8IDA7XG4gICAgY29uc3QgYm9va21hcmtzID0gc3RhdHNFbGVtLmZpbmQoJ2RkLmJvb2ttYXJrcycpLnRleHQoKTtcbiAgICBjb25zdCBoaXRzID0gc3RhdHNFbGVtLmZpbmQoJ2RkLmhpdHMnKS50ZXh0KCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGFuZ3VhZ2UsIHdvcmRzLCBjaGFwdGVycywga3Vkb3MsIGJvb2ttYXJrcywgaGl0cywgdXBkYXRlZFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgcGFyc2VUYWdzKCQsIHRhZ0VsZW0pIHtcbiAgICBjb25zdCB3YXJuaW5ncyA9IHRhZ0VsZW0uZmluZCgnbGkud2FybmluZ3MnKS50ZXh0KCk7XG4gICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IHRhZ0VsZW0uZmluZCgnbGkucmVsYXRpb25zaGlwcycpLmZpbmQoJ2EnKS5tYXAoKGksIGVsKSA9PiB7XG4gICAgICByZXR1cm4gJChlbCkudGV4dCgpO1xuICAgIH0pLmdldCgpO1xuICAgIGNvbnN0IGZyZWVmb3JtcyA9IHRhZ0VsZW0uZmluZCgnbGkuZnJlZWZvcm1zJykuZmluZCgnYScpLm1hcCgoaSwgZWwpID0+IHtcbiAgICAgIHJldHVybiAkKGVsKS50ZXh0KCk7XG4gICAgfSkuZ2V0KCk7XG4gICAgY29uc3QgY2hhcmFjdGVycyA9IHRhZ0VsZW0uZmluZCgnbGkuY2hhcmFjdGVycycpLmZpbmQoJ2EnKS5tYXAoKGksIGVsKSA9PiB7XG4gICAgICByZXR1cm4gJChlbCkudGV4dCgpO1xuICAgIH0pLmdldCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHdhcm5pbmdzLCByZWxhdGlvbnNoaXBzLCBjaGFyYWN0ZXJzLCBmcmVlZm9ybXNcbiAgICB9O1xuICB9XG5cbiAgcGVvcGxlU2VhcmNoKCkgeyB9XG5cbiAgYm9va21hcmtTZWFyY2goKSB7IH1cblxuICB0YWdTZWFyY2goKSB7IH1cblxuICAvLyByZXR1cm5zIHR3ZWV0cyBhbmQgbmV3cyBpdGVtcyBvbiB0aGUgZnJvbnQgcGFnZVxuICAvLyBUT0RPOiB0aGlzIGlzbid0IGRvbmVcbiAgbWFpblBhZ2UoKSB7XG4gICAgY29uc3QgcGF5bG9hZCA9IHt9O1xuICAgIGluc3RhbmNlLmdldChBTzMuc2l0ZSkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBjb25zdCB7IGRhdGEgfSA9IHJlc3BvbnNlO1xuICAgICAgY29uc3QgJCA9IGNoZWVyaW8ubG9hZChkYXRhKTtcbiAgICAgIGNvbnN0IGxpID0gJCgndWwubmV3cycpLmNoaWxkcmVuKCk7XG4gICAgICBwYXlsb2FkLmRhdGEgPSBuZXcgQXJyYXkobGkubGVuZ3RoKTtcbiAgICAgIGxpLmVhY2goZnVuY3Rpb24gKGksIGNoaWxkKSB7XG4gICAgICAgIGNvbnN0IG1ldGEgPSAkKHRoaXMpLmZpbmQoJ3AubWV0YScpO1xuICAgICAgICBjb25zdCBjb21tZW50cyA9IG1ldGEuZmluZCgnc3Bhbi5jb21tZW50cycpLmZpbmQoJ2EnKS50ZXh0KCk7XG4gICAgICAgIGNvbnN0IHB1Ymxpc2hlZCA9IG1ldGEuZmluZCgnc3Bhbi5wdWJsaXNoZWQnKTtcbiAgICAgICAgcGF5bG9hZC5kYXRhW2ldID0ge1xuICAgICAgICAgIHRleHQ6ICQodGhpcykuZmluZCgnYmxvY2txdW90ZScpLnRleHQoKSxcbiAgICAgICAgICBtZXRhOiB7XG4gICAgICAgICAgICBjb21tZW50cyxcbiAgICAgICAgICAgIHB1Ymxpc2hlZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iXX0=