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

function isNode() {
  return Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
}

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
        var token, preferences, params, endpoint;
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
                preferences = {
                  utf8: '✓',
                  authenticity_token: token,
                  subscription: {
                    subscribable_id: workId,
                    subscribable_type: 'Work'
                  }
                };
                params = _qs2.default.stringify(preferences);
                endpoint = AO3.site + '/users/' + AO3.user + '/subscriptions';
                _context18.prev = 9;
                _context18.next = 12;
                return instance.post(endpoint, params, settings);

              case 12:
                return _context18.abrupt('return', _context18.sent);

              case 15:
                _context18.prev = 15;
                _context18.t0 = _context18['catch'](9);
                return _context18.abrupt('return', _context18.t0);

              case 18:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this, [[9, 15]]);
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
        var token, userId, endpoint, params, response;
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
                response = _context21.sent;
                return _context21.abrupt('return', response);

              case 18:
                _context21.prev = 18;
                _context21.t0 = _context21['catch'](11);
                return _context21.abrupt('return', _context21.t0);

              case 21:
              case 'end':
                return _context21.stop();
            }
          }
        }, _callee21, this, [[11, 18]]);
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
                  var content = $(el).find('div.userstuff').html();
                  var chapterTitle = strip($(el).find('h3.title').text());
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
    key: 'formatWorksFilterEndpoint',
    value: function formatWorksFilterEndpoint(query) {
      var endpoint = AO3.site + '/works?utf8=%E2%9C%93';
      var _query = query,
          tag_id = _query.tag_id;

      delete query.tag_id;
      query = _qs2.default.stringify({ commit: 'Sort and Filter', work_search: query, tag_id: tag_id });
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
                endpoint = AO3.formatWorksFilterEndpoint(query);
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
    key: 'formatWorksSearchEndpoint',
    value: function formatWorksSearchEndpoint(query, page) {
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

                endpoint = AO3.formatWorksSearchEndpoint(query, page);
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
          relationships = _$$find$find$map$get2[1],
          content_warnings = _$$find$find$map$get2[2],
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RCxFQUFJLEVBQUosRUFBVztBQUN0RSxlQUFPLEVBQUUsRUFBRixFQUFNLElBQU4sRUFBUDtBQUNELE9BRmlCLEVBRWYsR0FGZSxFQUFsQjtBQUdBLFVBQU0sYUFBYSxRQUFRLElBQVIsQ0FBYSxlQUFiLEVBQThCLElBQTlCLENBQW1DLEdBQW5DLEVBQXdDLEdBQXhDLENBQTRDLFVBQUMsQ0FBRCxFQUFJLEVBQUosRUFBVztBQUN4RSxlQUFPLEVBQUUsRUFBRixFQUFNLElBQU4sRUFBUDtBQUNELE9BRmtCLEVBRWhCLEdBRmdCLEVBQW5COztBQUlBLGFBQU87QUFDTCwwQkFESyxFQUNLLDRCQURMLEVBQ29CLHNCQURwQixFQUNnQztBQURoQyxPQUFQO0FBR0Q7Ozs7O0FBaGdDa0IsRyxDQUNaLEksR0FBTyw0QjtBQURLLEcsQ0FFWixJLEdBQU8sSTtBQUZLLEcsQ0FHWixNLEdBQVMsSTtBQUhHLEcsQ0FJWixLLEdBQVEsSTtBQUpJLEcsQ0FLWixXLEdBQWMsRTtrQkFMRixHIiwiZmlsZSI6ImFvMy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5pbXBvcnQgYXhpb3NDb29raWVKYXJTdXBwb3J0IGZyb20gJ0AzODQ2bWFzYS9heGlvcy1jb29raWVqYXItc3VwcG9ydCc7XG5pbXBvcnQgY2hlZXJpbyBmcm9tICdjaGVlcmlvJztcbmltcG9ydCBxcyBmcm9tICdxcyc7XG5cbmZ1bmN0aW9uIHN0cmlwKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1xccj9cXG58XFxyLywgJycpLnRyaW0oKTtcbn1cblxuZnVuY3Rpb24gaGFzKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgcmV0dXJuIHt9Lmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRzKG9iamVjdCwgZGVmYXVsdE9iaikge1xuICBmb3IgKGxldCBrZXkgaW4gZGVmYXVsdE9iaikge1xuICAgIGlmICghb2JqZWN0W2tleV0pIHtcbiAgICAgIG9iamVjdFtrZXldID0gZGVmYXVsdE9ialtrZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5mdW5jdGlvbiBpc05vZGUoKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnID8gcHJvY2VzcyA6IDApID09PSAnW29iamVjdCBwcm9jZXNzXSc7XG59XG5cbmF4aW9zQ29va2llSmFyU3VwcG9ydChheGlvcyk7XG5cbmNvbnN0IHNldHRpbmdzID0ge1xuICB3aXRoQ3JlZGVudGlhbHM6IHRydWUsXG4gIGphcjogdHJ1ZVxufTtcblxuY29uc3QgaW5zdGFuY2UgPSBheGlvcy5jcmVhdGUoe1xuICBoZWFkZXJzOiB7XG4gICAgJ1gtUmVxdWVzdGVkLVdpdGgnOiAnWE1MSHR0cFJlcXVlc3QnXG4gIH0sXG4gIC4uLnNldHRpbmdzXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQU8zIHtcbiAgc3RhdGljIHNpdGUgPSAnaHR0cDovL2FyY2hpdmVvZm91cm93bi5vcmcnO1xuICBzdGF0aWMgdXNlciA9IG51bGw7XG4gIHN0YXRpYyB1c2VySWQgPSBudWxsO1xuICBzdGF0aWMgdG9rZW4gPSBudWxsO1xuICBzdGF0aWMgY3JlZGVudGlhbHMgPSB7fTtcblxuICBzdGF0aWMgc2V0Q3JlZGVudGlhbHMoeyB1c2VyLCBwYXNzd29yZCB9KSB7XG4gICAgQU8zLmNyZWRlbnRpYWxzID0ge1xuICAgICAgdXNlcixcbiAgICAgIHBhc3N3b3JkXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBnZXRUb2tlbihlbmRwb2ludCkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UuZ2V0KGAke0FPMy5zaXRlfS8ke2VuZHBvaW50ID8gZW5kcG9pbnQgOiAnbG9naW4nfWApO1xuICAgIGNvbnN0ICQgPSBjaGVlcmlvLmxvYWQocmVzcG9uc2UuZGF0YSk7XG4gICAgY29uc3QgdG9rZW4gPSAkKCdtZXRhW25hbWU9XCJjc3JmLXRva2VuXCJdJykuYXR0cignY29udGVudCcpO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodG9rZW4pO1xuICB9XG5cbiAgc3RhdGljIGdldFJlc3BvbnNlTWV0YShyZXNwb25zZSkge1xuICAgIGNvbnN0IHsgc3RhdHVzLCBzdGF0dXNUZXh0LCBoZWFkZXJzLCBjb25maWcgfSA9IHJlc3BvbnNlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1cywgc3RhdHVzVGV4dCwgaGVhZGVycywgY29uZmlnXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBsb2dpbih7IHVzZXIsIHBhc3N3b3JkIH0pIHtcbiAgICBjb25zdCB0b2tlbiA9IGF3YWl0IEFPMy5nZXRUb2tlbigpO1xuICAgIGNvbnN0IGNyZWRlbnRpYWxzID0gcXMuc3RyaW5naWZ5KHtcbiAgICAgIHV0Zjg6ICfinJMnLFxuICAgICAgYXV0aGVudGljaXR5X3Rva2VuOiB0b2tlbixcbiAgICAgIHVzZXJfc2Vzc2lvbjoge1xuICAgICAgICBsb2dpbjogdXNlcixcbiAgICAgICAgcGFzc3dvcmRcbiAgICAgIH0sXG4gICAgICBjb21taXQ6ICdMb2cgSW4nXG4gICAgfSk7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgJHtBTzMuc2l0ZX0vdXNlcl9zZXNzaW9uc2A7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnN0YW5jZS5wb3N0KGVuZHBvaW50LCBjcmVkZW50aWFscywgc2V0dGluZ3MpO1xuICAgICAgY29uc3QgJCA9IGNoZWVyaW8ubG9hZChyZXNwb25zZS5kYXRhKTtcbiAgICAgIGNvbnN0IHVzZXIgPSBzdHJpcCgkKCcjbWFpbicpLmZpbmQoJ2Rpdi51c2VyJykuZmluZCgnZGl2LnByaW1hcnknKS5maW5kKCdoMi5oZWFkaW5nJykudGV4dCgpKTtcblxuICAgICAgQU8zLnVzZXIgPSB1c2VyO1xuXG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBhc3luYyB1c2VyRGFzaGJvYXJkKCkge1xuICAgIGlmICghQU8zLnVzZXIpIHtcbiAgICAgIGF3YWl0IEFPMy5sb2dpbihBTzMuY3JlZGVudGlhbHMpO1xuICAgIH1cblxuICAgIGNvbnN0IGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9L3VzZXJzLyR7QU8zLnVzZXJ9YDtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGluc3RhbmNlLmdldChlbmRwb2ludCwgc2V0dGluZ3MpO1xuICAgIGNvbnN0ICQgPSBjaGVlcmlvLmxvYWQocmVzcG9uc2UuZGF0YSk7XG4gICAgY29uc3QgdXNlciA9IHN0cmlwKCQoJyNtYWluJykuZmluZCgnZGl2LnByaW1hcnknKS5maW5kKCdoMi5oZWFkaW5nJykudGV4dCgpKTtcbiAgICAvLyBUT0RPOiBnZXQgYWxsIGxpc3QgaXRlbXMgb24gcGFnZSwgZS5nLiwgd29ya3MsIGJvb2ttYXJrcywgZXRjLi4uXG4gICAgcmV0dXJuIHVzZXI7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgdXBkYXRlVXNlclByb2ZpbGUoe1xuICAgIGFib3V0TWUsIGxvY2F0aW9uLCB0aXRsZSwgZGF0ZU9mQmlydGg6IHsgeWVhciwgbW9udGgsIGRheSB9XG4gIH0gPSB7XG4gICAgYWJvdXRNZTogJycsIGxvY2F0aW9uOiAnJywgdGl0bGU6ICcnLCBkYXRlT2ZCaXJ0aDogeyB5ZWFyOiAnJywgbW9udGg6ICcnLCBkYXk6ICcnIH1cbiAgfSkge1xuICAgIGlmICghQU8zLnVzZXIpIHtcbiAgICAgIGF3YWl0IEFPMy5sb2dpbihBTzMuY3JlZGVudGlhbHMpO1xuICAgIH1cblxuICAgIGNvbnN0IHRva2VuID0gYXdhaXQgQU8zLmdldFRva2VuKCk7XG4gICAgY29uc3QgcGFyYW1zID0gcXMuc3RyaW5naWZ5KHtcbiAgICAgIF9tZXRob2Q6ICdwdXQnLFxuICAgICAgYXV0aGVudGljaXR5X3Rva2VuOiB0b2tlbixcbiAgICAgIGNvbW1pdDogJ1VwZGF0ZScsXG4gICAgICBwcm9maWxlX2F0dHJpYnV0ZXM6IHtcbiAgICAgICAgdGl0bGUsXG4gICAgICAgIGxvY2F0aW9uLFxuICAgICAgICAnZGF0ZV9vZl9iaXJ0aCgxaSknOiB5ZWFyLFxuICAgICAgICAnZGF0ZV9vZl9iaXJ0aCgyaSknOiBtb250aCxcbiAgICAgICAgJ2RhdGVfb2ZfYmlydGgoM2kpJzogZGF5LFxuICAgICAgICBhYm91dF9tZTogYWJvdXRNZVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9L3VzZXJzLyR7QU8zLnVzZXJ9YDtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGluc3RhbmNlLnBvc3QoZW5kcG9pbnQsIHBhcmFtcywge1xuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9LFxuICAgICAgICAuLi5zZXR0aW5nc1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVuZHBvaW50OiBodHRwOi8vYXJjaGl2ZW9mb3Vyb3duLm9yZy91c2Vycy86dXNlci9wc2V1ZHMvKDp1c2VyfHw6cHNldWQpXG4gIC8vIHF1ZXJ5IHBhcmFtczpcbiAgLy8gLS0tLS0tV2ViS2l0Rm9ybUJvdW5kYXJ5MG1nd3BEVm5VOEdaQlZ4clxuICAvLyBDb250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9XCJ1dGY4XCJcbiAgLy9cbiAgLy8g4pyTXG4gIC8vIC0tLS0tLVdlYktpdEZvcm1Cb3VuZGFyeTBtZ3dwRFZuVThHWkJWeHJcbiAgLy8gQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPVwiX21ldGhvZFwiXG4gIC8vXG4gIC8vIHB1dFxuICAvLyAtLS0tLS1XZWJLaXRGb3JtQm91bmRhcnkwbWd3cERWblU4R1pCVnhyXG4gIC8vIENvbnRlbnQtRGlzcG9zaXRpb246IGZvcm0tZGF0YTsgbmFtZT1cImF1dGhlbnRpY2l0eV90b2tlblwiXG4gIC8vXG4gIC8vIDFuUGEwNENMN29oVGQ1Q3BZYWJFY2NkWHlIc2RNaVd0RnAwMm1xTTFmVmM9XG4gIC8vIC0tLS0tLVdlYktpdEZvcm1Cb3VuZGFyeTBtZ3dwRFZuVThHWkJWeHJcbiAgLy8gQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPVwicHNldWRbZGVzY3JpcHRpb25dXCJcbiAgLy9cbiAgLy9cbiAgLy8gLS0tLS0tV2ViS2l0Rm9ybUJvdW5kYXJ5MG1nd3BEVm5VOEdaQlZ4clxuICAvLyBDb250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9XCJwc2V1ZFtpY29uXVwiOyBmaWxlbmFtZT1cInNvbWJyYV9fX292ZXJ3YXRjaF9fX2ZhbmFydF9ieV9uZWxsX2ZhbGxjYXJkLWRhcGxmOHUuanBnXCJcbiAgLy8gQ29udGVudC1UeXBlOiBpbWFnZS9qcGVnXG4gIC8vXG4gIC8vXG4gIC8vIC0tLS0tLVdlYktpdEZvcm1Cb3VuZGFyeTBtZ3dwRFZuVThHWkJWeHJcbiAgLy8gQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPVwicHNldWRbaWNvbl9hbHRfdGV4dF1cIlxuICAvL1xuICAvL1xuICAvLyAtLS0tLS1XZWJLaXRGb3JtQm91bmRhcnkwbWd3cERWblU4R1pCVnhyXG4gIC8vIENvbnRlbnQtRGlzcG9zaXRpb246IGZvcm0tZGF0YTsgbmFtZT1cInBzZXVkW2ljb25fY29tbWVudF90ZXh0XVwiXG4gIC8vXG4gIC8vXG4gIC8vIC0tLS0tLVdlYktpdEZvcm1Cb3VuZGFyeTBtZ3dwRFZuVThHWkJWeHJcbiAgLy8gQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPVwiY29tbWl0XCJcbiAgLy9cbiAgLy8gVXBkYXRlXG4gIC8vIC0tLS0tLVdlYktpdEZvcm1Cb3VuZGFyeTBtZ3dwRFZuVThHWkJWeHItLVxuXG4gIHN0YXRpYyB1cGRhdGVVc2VyUHNldWQoKSB7IH1cblxuICAvLyBlbmRwb2ludDpcbiAgc3RhdGljIGFzeW5jIHVwZGF0ZVVzZXJOYW1lKG5ld1VzZXJOYW1lKSB7XG4gICAgaWYgKCFBTzMudXNlcikge1xuICAgICAgYXdhaXQgQU8zLmxvZ2luKEFPMy5jcmVkZW50aWFscyk7XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW4gPSBhd2FpdCBBTzMuZ2V0VG9rZW4oKTtcbiAgICBjb25zdCBwYXJhbXMgPSBxcy5zdHJpbmdpZnkoe1xuICAgICAgdXRmODogJ+KckycsXG4gICAgICBhdXRoZW50aWNpdHlfdG9rZW46IHRva2VuLFxuICAgICAgbmV3X2xvZ2luOiBuZXdVc2VyTmFtZSxcbiAgICAgIHBhc3N3b3JkOiBBTzMuY3JlZGVudGlhbHMucGFzc3dvcmQsXG4gICAgICBjb21taXQ6ICdDaGFuZ2UgVXNlciBOYW1lJ1xuICAgIH0pO1xuICAgIGNvbnN0IGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9L3VzZXJzLyR7QU8zLnVzZXJ9L2NoYW5nZWRfdXNlcm5hbWVgO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UucG9zdChlbmRwb2ludCwgcGFyYW1zLCB7XG4gICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0sXG4gICAgICAgIC4uLnNldHRpbmdzXG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFzeW5jIHVwZGF0ZVBhc3N3b3JkKHBhc3N3b3JkKSB7XG4gICAgaWYgKCFBTzMudXNlcikge1xuICAgICAgYXdhaXQgQU8zLmxvZ2luKEFPMy5jcmVkZW50aWFscyk7XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW4gPSBhd2FpdCBBTzMuZ2V0VG9rZW4oKTtcbiAgICBjb25zdCBwYXJhbXMgPSBxcy5zdHJpbmdpZnkoe1xuICAgICAgdXRmODogJ+KckycsXG4gICAgICBhdXRoZW50aWNpdHlfdG9rZW46IHRva2VuLFxuICAgICAgcGFzc3dvcmQsXG4gICAgICBwYXNzd29yZF9jb25maXJtYXRpb246IHBhc3N3b3JkLFxuICAgICAgcGFzc3dvcmRfY2hlY2s6IEFPMy5jcmVkZW50aWFscy5wYXNzd29yZCxcbiAgICAgIGNvbW1pdDogJ0NoYW5nZSBQYXNzd29yZCdcbiAgICB9KTtcbiAgICBjb25zdCBlbmRwb2ludCA9IGAke0FPMy5zaXRlfS91c2Vycy8ke0FPMy51c2VyfS9jaGFuZ2VkX3Bhc3N3b3JkYDtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGluc3RhbmNlLnBvc3QoZW5kcG9pbnQsIHBhcmFtcywge1xuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9LFxuICAgICAgICAuLi5zZXR0aW5nc1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFzeW5jIHVwZGF0ZUVtYWlsKHsgbmV3RW1haWwgfSkge1xuICAgIGlmICghQU8zLnVzZXIpIHtcbiAgICAgIGF3YWl0IEFPMy5sb2dpbihBTzMuY3JlZGVudGlhbHMpO1xuICAgIH1cbiAgICBjb25zdCB0b2tlbiA9IGF3YWl0IEFPMy5nZXRUb2tlbigpO1xuICAgIGNvbnN0IHBhcmFtcyA9IHFzLnN0cmluZ2lmeSh7XG4gICAgICB1dGY4OiAn4pyTJyxcbiAgICAgIGF1dGhlbnRpY2l0eV90b2tlbjogdG9rZW4sXG4gICAgICBuZXdfZW1haWw6IG5ld0VtYWlsLFxuICAgICAgZW1haWxfY29uZmlybWF0aW9uOiBuZXdFbWFpbCxcbiAgICAgIHBhc3N3b3JkX2NoZWNrOiBBTzMucGFzc3dvcmQsXG4gICAgICBjb21taXQ6ICdDaGFuZ2UgRW1haWwnXG4gICAgfSk7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgJHtBTzMuc2l0ZX0vdXNlcnMvJHtBTzMudXNlcn0vY2hhbmdlZF9lbWFpbGA7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnN0YW5jZS5wb3N0KGVuZHBvaW50LCBwYXJhbXMsIHtcbiAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfSxcbiAgICAgICAgLi4uc2V0dGluZ3NcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBhc3luYyB1cGRhdGVQcmVmZXJlbmNlcyhwcmVmZXJlbmNlcykge1xuICAgIGlmICghQU8zLnVzZXIpIHtcbiAgICAgIGF3YWl0IEFPMy5sb2dpbihBTzMuY3JlZGVudGlhbHMpO1xuICAgIH1cblxuICAgIGNvbnN0IHRva2VuID0gYXdhaXQgQU8zLmdldFRva2VuKCk7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBBTzMuZ2V0UHJlZmVyZW5jZXMoKTtcblxuICAgIHByZWZlcmVuY2VzID0gZGVmYXVsdHMocHJlZmVyZW5jZXMsIGRhdGEpO1xuXG4gICAgY29uc3QgcGFyYW1zID0gcXMuc3RyaW5naWZ5KHtcbiAgICAgIHV0Zjg6ICfinJMnLFxuICAgICAgX21ldGhvZDogJ3B1dCcsXG4gICAgICBhdXRoZW50aWNpdHlfdG9rZW46IHRva2VuLFxuICAgICAgcHJlZmVyZW5jZTogcHJlZmVyZW5jZXMsXG4gICAgICBjb21taXQ6ICdVcGRhdGUnXG4gICAgfSk7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgJHtBTzMuc2l0ZX0vcHJlZmVyZW5jZXMvdXBkYXRlP3VzZXJfaWQ9JHtBTzMudXNlcn1gO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UucG9zdChlbmRwb2ludCwgcGFyYW1zLCB7XG4gICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0sXG4gICAgICAgIC4uLnNldHRpbmdzXG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFzeW5jIGdldFByZWZlcmVuY2VzKCkge1xuICAgIGlmICghQU8zLnVzZXIpIHtcbiAgICAgIGF3YWl0IEFPMy5sb2dpbihBTzMuY3JlZGVudGlhbHMpO1xuICAgIH1cbiAgICBjb25zdCBlbmRwb2ludCA9IGAke0FPMy5zaXRlfS91c2Vycy8ke0FPMy51c2VyfS9wcmVmZXJlbmNlc2A7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnN0YW5jZS5nZXQoZW5kcG9pbnQsIHNldHRpbmdzKTtcbiAgICBjb25zdCAkID0gY2hlZXJpby5sb2FkKHJlc3BvbnNlLmRhdGEpO1xuICAgIGxldCBwcmVmZXJlbmNlcyA9ICQoJyNtYWluJykuZmluZCgnZm9ybScpLmZpbmQoJ2ZpZWxkc2V0JykubWFwKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgY29uc3QgaGVhZGluZyA9ICQodGhpcykuZmluZCgnbGVnZW5kJykudGV4dCgpO1xuICAgICAgaWYgKGhlYWRpbmcgJiYgaGVhZGluZyAhPT0gJ0FjdGlvbnMnKSB7XG4gICAgICAgIHJldHVybiAkKHRoaXMpLmZpbmQoJ3VsJykuZmluZCgnbGknKS5tYXAoZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSAkKHRoaXMpLmZpbmQoJ2lucHV0JykuZ2V0KDEpO1xuICAgICAgICAgIGNvbnN0IGl0ZW0gPSAkKGlucHV0KS5hdHRyKCdpZCcpLnJlcGxhY2UoL3ByZWZlcmVuY2VfLywgJycpO1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gJChpbnB1dCkuYXR0cignY2hlY2tlZCcpID8gMSA6IDA7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFtpdGVtXTogdmFsdWVcbiAgICAgICAgICB9O1xuICAgICAgICB9KS5nZXQoKTtcbiAgICAgIH1cbiAgICB9KS5nZXQoKTtcblxuICAgIHByZWZlcmVuY2VzID0gcHJlZmVyZW5jZXMucmVkdWNlKChhY2MsIHZhbCkgPT4ge1xuICAgICAgY29uc3QgW2tleV0gPSBPYmplY3Qua2V5cyh2YWwpO1xuICAgICAgYWNjW2tleV0gPSB2YWxba2V5XTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1ldGE6IEFPMy5nZXRSZXNwb25zZU1ldGEocmVzcG9uc2UpLFxuICAgICAgZGF0YTogcHJlZmVyZW5jZXNcbiAgICB9O1xuICB9XG5cbiAgLy8gZW5kcG9pbnQ6IGh0dHA6Ly9hcmNoaXZlb2ZvdXJvd24ub3JnL3dvcmtzLyg6d29ya0lkKVxuICAvLyBxdWVyeSBwYXJhbXM6XG4gIC8vIHV0Zjg64pyTXG4gIC8vIF9tZXRob2Q6cHV0XG4gIC8vIGF1dGhlbnRpY2l0eV90b2tlbjoxblBhMDRDTDdvaFRkNUNwWWFiRWNjZFh5SHNkTWlXdEZwMDJtcU0xZlZjPVxuICAvLyB3b3JrW3JhdGluZ19zdHJpbmddOkV4cGxpY2l0XG4gIC8vIHdvcmtbd2FybmluZ19zdHJpbmdzXVtdOkNob29zZSBOb3QgVG8gVXNlIEFyY2hpdmUgV2FybmluZ3NcbiAgLy8gd29ya1tmYW5kb21fc3RyaW5nXTpPdmVyd2F0Y2ggKFZpZGVvIEdhbWUpXG4gIC8vIHdvcmtbY2F0ZWdvcnlfc3RyaW5nXVtdOkYvRlxuICAvLyB3b3JrW2NhdGVnb3J5X3N0cmluZ11bXTpGL01cbiAgLy8gd29ya1tjYXRlZ29yeV9zdHJpbmddW106TXVsdGlcbiAgLy8gd29ya1tyZWxhdGlvbnNoaXBfc3RyaW5nXTpMw7pjaW8gQ29ycmVpYSBkb3MgU2FudG9zL0hhbmEgXCJELlZhXCIgU29uZy9Tb21icmEgKE92ZXJ3YXRjaCksIEzDumNpbyBDb3JyZWlhIGRvcyBTYW50b3MvSGFuYSBcIkQuVmFcIiBTb25nLCBMw7pjaW8gQ29ycmVpYSBkb3MgU2FudG9zL1NvbWJyYSAoT3ZlcndhdGNoKSwgU29tYnJhIChPdmVyd2F0Y2gpL0hhbmEgXCJELlZhXCIgU29uZ1xuICAvLyB3b3JrW2NoYXJhY3Rlcl9zdHJpbmddOlNvbWJyYSAoT3ZlcndhdGNoKSwgTMO6Y2lvIENvcnJlaWEgZG9zIFNhbnRvcywgSGFuYSBcIkQuVmFcIiBTb25nXG4gIC8vIHdvcmtbZnJlZWZvcm1fc3RyaW5nXTpNb3JhbGx5IEFtYmlndW91cyBDaGFyYWN0ZXIsIFJvdWdoIFNleCwgRHJ1bmsgU2V4LCBMb3ZlIFRyaWFuZ2xlcywgSmVhbG91c3ksIERydWdzXG4gIC8vIHdvcmtbdGl0bGVdOlBhcmFtb3VyXG4gIC8vIHdvcmtbYXV0aG9yX2F0dHJpYnV0ZXNdW2lkc11bXToyOTMyMTU0XG4gIC8vIHBzZXVkW2J5bGluZV06XG4gIC8vIHdvcmtbc3VtbWFyeV06QWZ0ZXIgYSBkcnVuayBkZWJhdWNoZWQgdGhyZWVzb21lLCBIYW5hIGZpbmRzIGhlcnNlbGYgaW4gYSB0ZW51b3VzIGJ1dCBsb3ZpbmcgcmVsYXRpb25zaGlwIHdpdGggTMO6Y2lvIGFuZCBhIGplYWxvdXMgcml2YWxyeSB3aXRoIFNvbWJyYSAoTMO6Y2lvJ3MgZnJpZW5kIGZyb20gaGlzIHJldm9sdXRpb25hcnkgZGF5cykuIE11Y2ggdG8gaGVyIGNoYWdyaW4sIGEgZmFpbGVkIHJlY29yZCBkZWFsIGZvcmNlcyBMw7pjaW8gaW50byBhIHRpZ2h0IHNwb3QgZmluYW5jaWFsbHkgYW5kIGhlIG11c3QgY2FsbCBpbiBhIGZhdm9yIGZyb20gaGlzIHVuc2NydXB1bG91cyBmcmllbmQuIEzDumNpbydzIHJlbmV3ZWQgY29udGFjdCB3aXRoIFNvbWJyYSBjYXVzZXMgSGFuYSB0byByZXZpc2l0IHNvbWUgYW1iaWd1b3VzIG1lbW9yaWVzIGFuZCBxdWVzdGlvbiBMw7pjaW8ncyBtb3JhbGl0eS4gVHJvdWJsZSBlbnN1ZXMuXG4gIC8vIGZyb250LW5vdGVzLW9wdGlvbnMtc2hvdzoxXG4gIC8vIHdvcmtbbm90ZXNdOkp1c3QgYSB3YXJuaW5nLCBTb21icmEgaXMgYWN0dWFsbHkgYSBiYWQgcGVyc29uIGFuZCBkb2VzIHNvbWUgYW1iaWd1b3VzbHkgbm9uLWNvbnNlbnN1YWwgdGhpbmdzIHRvIEhhbmEgYXMgd2VsbCBhcyBoYXMgbm9uLWNvbnNlbnN1YWwgdGhvdWdodHMgYWJvdXQgaGVyLiBUaGlzIGlzIGtpbmQgb2YgYSB0aWUgaW4gYW5kIGVsYWJvcmF0aW9uIG9mIGEgPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhbmZpY3Rpb24ubmV0L3MvMTIyOTQ2ODAvNS9UaGUtb25lLXdoZXJlaW4tU29tYnJhLWlzLWEtbWVuYWNlLXRvLXNvY2lldHlcIj5icmllZiBzY2VuZTwvYT4gSSB3cm90ZSBpbiBhbm90aGVyIDxhIGhyZWY9XCJodHRwczovL3d3dy5mYW5maWN0aW9uLm5ldC9zLzEyMjk0NjgwLzEvVGhlLW9uZS13aGVyZWluLVNvbWJyYS1pcy1hLW1lbmFjZS10by1zb2NpZXR5XCI+ZmFuIGZpY3Rpb248L2E+LiBUaGlzIGlzIGFsc28gbGlrZSB0aGUgZmlyc3Qgc211dCBJJ3ZlIHdyaXR0ZW4gZm9yIGh1bWFuIGV5ZXMgc28gSSdkIGxvdmUgY29tbWVudHMgYW5kIGNyaXRpY2lzbSAocGxlYXNlIGJlIGdlbnRsZSkuIFdyaXR0ZW4gb24gc3BlZWQsIG1lYW50IHRvIGJlIHJlYWQgb24gc3BlZWQuIE9LIGVuam95LlxuICAvLyB3b3JrW2VuZG5vdGVzXTpcbiAgLy8gd29ya1tjb2xsZWN0aW9uX25hbWVzXTpcbiAgLy8gd29ya1tyZWNpcGllbnRzXTpcbiAgLy8gd29ya1twYXJlbnRfYXR0cmlidXRlc11bdXJsXTpcbiAgLy8gd29ya1twYXJlbnRfYXR0cmlidXRlc11bdGl0bGVdOlxuICAvLyB3b3JrW3BhcmVudF9hdHRyaWJ1dGVzXVthdXRob3JdOlxuICAvLyB3b3JrW3BhcmVudF9hdHRyaWJ1dGVzXVtsYW5ndWFnZV9pZF06XG4gIC8vIHdvcmtbcGFyZW50X2F0dHJpYnV0ZXNdW3RyYW5zbGF0aW9uXTowXG4gIC8vIHdvcmtbc2VyaWVzX2F0dHJpYnV0ZXNdW2lkXTpcbiAgLy8gd29ya1tzZXJpZXNfYXR0cmlidXRlc11bdGl0bGVdOlxuICAvLyBjaGFwdGVycy1vcHRpb25zLXNob3c6MVxuICAvLyB3b3JrW3dpcF9sZW5ndGhdOjZcbiAgLy8gd29ya1tjaGFwdGVyX2F0dHJpYnV0ZXNdW3RpdGxlXTpcbiAgLy8gd29ya1tiYWNrZGF0ZV06MFxuICAvLyB3b3JrW2NoYXB0ZXJfYXR0cmlidXRlc11bcHVibGlzaGVkX2F0KDNpKV06OFxuICAvLyB3b3JrW2NoYXB0ZXJfYXR0cmlidXRlc11bcHVibGlzaGVkX2F0KDJpKV06MVxuICAvLyB3b3JrW2NoYXB0ZXJfYXR0cmlidXRlc11bcHVibGlzaGVkX2F0KDFpKV06MjAxN1xuICAvLyB3b3JrW2xhbmd1YWdlX2lkXToxXG4gIC8vIHdvcmtbd29ya19za2luX2lkXTpcbiAgLy8gd29ya1tyZXN0cmljdGVkXTowXG4gIC8vIHdvcmtbYW5vbl9jb21tZW50aW5nX2Rpc2FibGVkXTowXG4gIC8vIHdvcmtbbW9kZXJhdGVkX2NvbW1lbnRpbmdfZW5hYmxlZF06MFxuICAvLyBwb3N0X2J1dHRvbjpQb3N0IFdpdGhvdXQgUHJldmlld1xuICBzdGF0aWMgdXBkYXRlV29yayhpZCwgd29yaykgeyB9XG5cbiAgLy8gZW5kcG9pbnQ6IGh0dHA6Ly9hcmNoaXZlb2ZvdXJvd24ub3JnL3dvcmtzLyg6d29ya0lkKS9jaGFwdGVycy8oOmNoYXB0ZXJJZClcbiAgLy8gcXVlcnkgcGFyYW1zOlxuICAvLyB1dGY4OuKck1xuICAvLyBfbWV0aG9kOnB1dFxuICAvLyBhdXRoZW50aWNpdHlfdG9rZW46MW5QYTA0Q0w3b2hUZDVDcFlhYkVjY2RYeUhzZE1pV3RGcDAybXFNMWZWYz1cbiAgLy8gY2hhcHRlclt0aXRsZV06XG4gIC8vIGNoYXB0ZXJbcG9zaXRpb25dOjFcbiAgLy8gY2hhcHRlclt3aXBfbGVuZ3RoXTo2XG4gIC8vIGNoYXB0ZXJbcHVibGlzaGVkX2F0KDNpKV06OFxuICAvLyBjaGFwdGVyW3B1Ymxpc2hlZF9hdCgyaSldOjFcbiAgLy8gY2hhcHRlcltwdWJsaXNoZWRfYXQoMWkpXToyMDE3XG4gIC8vIGNoYXB0ZXJbYXV0aG9yX2F0dHJpYnV0ZXNdW2lkc11bXToyOTMyMTU0XG4gIC8vIHBzZXVkW2J5bGluZV06XG4gIC8vIGNoYXB0ZXJbc3VtbWFyeV06XG4gIC8vIGNoYXB0ZXJbbm90ZXNdOlxuICAvLyBjaGFwdGVyW2VuZG5vdGVzXTpcbiAgLy8gY2hhcHRlcltjb250ZW50XTpcbiAgc3RhdGljIGFzeW5jIHVwZGF0ZVdvcmtDaGFwdGVyKHdvcmtJZCwgY2hhcHRlcklkLCBjaGFwdGVyKSB7XG4gICAgY29uc3QgdG9rZW4gPSBhd2FpdCBBTzMuZ2V0VG9rZW4oKTtcbiAgICBjb25zdCBwYXJhbXMgPSBxcy5zdHJpbmdpZnkoe1xuICAgICAgdXRmODogJ+KckycsXG4gICAgICBfbWV0aG9kOiAncHV0JyxcbiAgICAgIGF1dGhlbnRpY2l0eV90b2tlbjogdG9rZW4sXG4gICAgICBjaGFwdGVyXG4gICAgfSk7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgJHtBTzMuc2l0ZX0vd29ya3MvJHt3b3JrSWR9L2NoYXB0ZXJzLyR7Y2hhcHRlcklkfWA7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UucG9zdChlbmRwb2ludCwgcGFyYW1zLCB7XG4gICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0sXG4gICAgICAgIC4uLnNldHRpbmdzXG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFzeW5jIGdldE5ld1JlbGljSWQoKSB7XG4gICAgaWYgKCFBTzMudXNlcikge1xuICAgICAgYXdhaXQgQU8zLmxvZ2luKEFPMy5jcmVkZW50aWFscyk7XG4gICAgfVxuXG4gICAgY29uc3QgZW5kcG9pbnQgPSBgJHtBTzMuc2l0ZX0vdXNlcnMvJHtBTzMudXNlcn1gO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UuZ2V0KGVuZHBvaW50KTtcbiAgICAgIGNvbnN0ICQgPSBjaGVlcmlvLmxvYWQocmVzcG9uc2UuZGF0YSk7XG4gICAgICBjb25zdCBzY3JpcHRzID0gJCgnaGVhZCcpLmZpbmQoJ3NjcmlwdCcpLm1hcChmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgICAgcmV0dXJuICQodGhpcykuaHRtbCgpO1xuICAgICAgfSk7XG4gICAgICBjb25zdCBuZXdSZWxpY1NjcmlwdCA9IEFycmF5LmZyb20oc2NyaXB0cykuZmlsdGVyKGVsID0+IHtcbiAgICAgICAgaWYgKGVsLmluY2x1ZGVzKCd4cGlkJykpIHtcbiAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgIH1cbiAgICAgIH0pWzBdO1xuICAgICAgY29uc3QgeHBpZCA9IG5ld1JlbGljU2NyaXB0Lm1hdGNoKC8oeHBpZCk/XCIuKj9cIi9nKVswXS5yZXBsYWNlKC9cIi9nLCAnJyk7XG4gICAgICByZXR1cm4geHBpZDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFzeW5jIGF1dG9jb21wbGV0ZSh0ZXJtLCBxdWVyeSkge1xuICAgIGlmICghQU8zLnVzZXIpIHtcbiAgICAgIGF3YWl0IEFPMy5sb2dpbihBTzMuY3JlZGVudGlhbHMpO1xuICAgIH1cblxuICAgIGNvbnN0IHRva2VuID0gYXdhaXQgQU8zLmdldFRva2VuKCk7XG4gICAgY29uc3QgbmV3UmVsaWNJZCA9IGF3YWl0IEFPMy5nZXROZXdSZWxpY0lkKCk7XG5cbiAgICBsZXQgZW5kcG9pbnQgPSBgJHtBTzMuc2l0ZX0vYXV0b2NvbXBsZXRlL2A7XG5cbiAgICBjb25zdCBwYXJhbXMgPSB7fTtcblxuICAgIGlmIChoYXMocXVlcnksICd0eXBlJykpIHtcbiAgICAgIGVuZHBvaW50ICs9IHF1ZXJ5LnR5cGU7XG4gICAgfVxuXG4gICAgaWYgKGhhcyhxdWVyeSwgJ2ZhbmRvbScpKSB7XG4gICAgICBwYXJhbXMuZmFuZG9tID0gW3F1ZXJ5LmZhbmRvbV07XG4gICAgfVxuXG4gICAgcGFyYW1zLnRlcm0gPSB0ZXJtLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnN0YW5jZS5nZXQoZW5kcG9pbnQsIHtcbiAgICAgICAgcGFyYW1zLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHQsICovKjsgcT0wLjAxJyxcbiAgICAgICAgICAnQWNjZXB0LUVuY29kaW5nJzogJ2d6aXAgZGVmbGF0ZSwgc2RjaCcsXG4gICAgICAgICAgJ0FjY2VwdC1MYW5ndWFnZSc6ICdlbi1VUyxlbjtxPTAuOCxmcjtxPTAuNicsXG4gICAgICAgICAgJ0Nvbm5lY3Rpb24nOiAna2VlcC1hbGl2ZScsXG4gICAgICAgICAgJ0ROVCc6IDEsXG4gICAgICAgICAgJ1gtQ1NSRi1Ub2tlbic6IHRva2VuLFxuICAgICAgICAgICdYLU5ld1JlbGljLUlEJzogbmV3UmVsaWNJZFxuICAgICAgICB9LFxuICAgICAgICB4c3JmSGVhZGVyTmFtZTogJ1gtQ1NSRi1UT0tFTicsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGVycjtcbiAgICB9XG4gIH1cblxuICAvLyBlbmRwb2ludDogaHR0cDovL2FyY2hpdmVvZm91cm93bi5vcmcvd29ya3MvKDp3b3JrSWQpL2Jvb2ttYXJrc1xuICAvLyBxdWVyeSBwYXJhbXM6XG4gIC8vIHV0Zjg64pyTXG4gIC8vIGF1dGhlbnRpY2l0eV90b2tlbjoxblBhMDRDTDdvaFRkNUNwWWFiRWNjZFh5SHNkTWlXdEZwMDJtcU0xZlZjPVxuICAvLyBib29rbWFya1twc2V1ZF9pZF06MjkzMjE1NFxuICAvLyBib29rbWFya1tib29rbWFya2FibGVfaWRdOjkyNDk1MDNcbiAgLy8gYm9va21hcmtbYm9va21hcmthYmxlX3R5cGVdOldvcmtcbiAgLy8gYm9va21hcmtbbm90ZXNdOlxuICAvLyBib29rbWFya1t0YWdfc3RyaW5nXTpcbiAgLy8gYm9va21hcmtbY29sbGVjdGlvbl9uYW1lc106XG4gIC8vIGJvb2ttYXJrW3ByaXZhdGVdOjBcbiAgLy8gYm9va21hcmtbcmVjXTowXG4gIC8vIGNvbW1pdDpDcmVhdGVcbiAgc3RhdGljIGFzeW5jIGJvb2ttYXJrKHdvcmtJZCwgeyBub3RlcywgdGFncywgY29sbGVjdGlvbnMsIHByaXYgPSAwLCByZWMgPSAwIH0gPSB7fSkge1xuICAgIGlmICghQU8zLnVzZXIpIHtcbiAgICAgIGF3YWl0IEFPMy5sb2dpbihBTzMuY3JlZGVudGlhbHMpO1xuICAgIH1cblxuICAgIGNvbnN0IHRva2VuID0gYXdhaXQgQU8zLmdldFRva2VuKCk7XG4gICAgY29uc3QgcHNldWRJZCA9IGF3YWl0IEFPMy5nZXRQc2V1ZElkKEFPMy51c2VyKTtcbiAgICBjb25zdCBwYXJhbXMgPSBxcy5zdHJpbmdpZnkoe1xuICAgICAgdXRmODogJ+KckycsXG4gICAgICBhdXRoZW50aWNpdHlfdG9rZW46IHRva2VuLFxuICAgICAgY29tbWl0OiAnQ3JlYXRlJyxcbiAgICAgIGJvb2ttYXJrOiB7XG4gICAgICAgIHBzZXVkX2lkOiBwc2V1ZElkLFxuICAgICAgICBib29rbWFya2FibGVfaWQ6IHdvcmtJZCxcbiAgICAgICAgYm9va21hcmthYmxlX3R5cGU6ICdXb3JrJyxcbiAgICAgICAgbm90ZXMsXG4gICAgICAgIHRhZ19zdHJpbmc6IHRhZ3MsXG4gICAgICAgIGNvbGxlY3Rpb25fbmFtZXM6IGNvbGxlY3Rpb25zLFxuICAgICAgICAncHJpdmF0ZSc6IHByaXYsXG4gICAgICAgIHJlY1xuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9L3dvcmtzLyR7d29ya0lkfS9ib29rbWFya3NgO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UucG9zdChlbmRwb2ludCwgcGFyYW1zLCBzZXR0aW5ncyk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVuZHBvaW50OiBodHRwOi8vYXJjaGl2ZW9mb3Vyb3duLm9yZy9rdWRvcy5qc1xuICAvLyBxdWVyeSBwYXJhbXM6XG4gIC8vIHV0Zjg64pyTXG4gIC8vIGF1dGhlbnRpY2l0eV90b2tlbjoxblBhMDRDTDdvaFRkNUNwWWFiRWNjZFh5SHNkTWlXdEZwMDJtcU0xZlZjPVxuICAvLyBrdWRvW2NvbW1lbnRhYmxlX2lkXTo3MTI5ODU5XG4gIC8vIGt1ZG9bY29tbWVudGFibGVfdHlwZV06V29ya1xuICBzdGF0aWMgYXN5bmMgZ2l2ZUt1ZG9zKHdvcmtJZCkge1xuICAgIGlmICghQU8zLnVzZXIpIHtcbiAgICAgIGF3YWl0IEFPMy5sb2dpbihBTzMuY3JlZGVudGlhbHMpO1xuICAgIH1cblxuICAgIGNvbnN0IHRva2VuID0gYXdhaXQgQU8zLmdldFRva2VuKCk7XG4gICAgY29uc3QgcGFyYW1zID0gcXMuc3RyaW5naWZ5KHtcbiAgICAgIHV0Zjg6ICfinJMnLFxuICAgICAgYXV0aGVudGljaXR5X3Rva2VuOiB0b2tlbixcbiAgICAgIGt1ZG86IHtcbiAgICAgICAgY29tbWVudGFibGVfaWQ6IHdvcmtJZCxcbiAgICAgICAgY29tbWVudGFibGVfdHlwZTogJ1dvcmsnXG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgJHtBTzMuc2l0ZX0va3Vkb3MuanNgO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBpbnN0YW5jZS5wb3N0KGVuZHBvaW50LCBwYXJhbXMsIHNldHRpbmdzKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICB9XG5cbiAgLy8gZW5kcG9pbnQ6IGh0dHA6Ly9hcmNoaXZlb2ZvdXJvd24ub3JnL2NoYXB0ZXJzLyg6Y2hhcHRlcklkKS9jb21tZW50c1xuICAvLyBxdWVyeSBwYXJhbXM6XG4gIC8vIHV0Zjg64pyTXG4gIC8vIGF1dGhlbnRpY2l0eV90b2tlbjoxblBhMDRDTDdvaFRkNUNwWWFiRWNjZFh5SHNkTWlXdEZwMDJtcU0xZlZjPVxuICAvLyBjb21tZW50W3BzZXVkX2lkXToyOTMyMTU0XG4gIC8vIGNvbW1lbnRbY29udGVudF06dGVzdFxuICAvLyBjb250cm9sbGVyX25hbWU6Y2hhcHRlcnNcbiAgLy8gY29tbWl0OkNvbW1lbnRcbiAgc3RhdGljIGFzeW5jIGNvbW1lbnQoY2hhcHRlcklkLCBjb21tZW50KSB7XG4gICAgaWYgKCFBTzMudXNlcikge1xuICAgICAgYXdhaXQgQU8zLmxvZ2luKEFPMy5jcmVkZW50aWFscyk7XG4gICAgfVxuICAgIGNvbnN0IHRva2VuID0gYXdhaXQgQU8zLmdldFRva2VuKCk7XG4gICAgY29uc3QgcHNldWRJZCA9IGF3YWl0IEFPMy5nZXRQc2V1ZElkKEFPMy51c2VyKTtcbiAgICBjb25zdCBwYXJhbXMgPSBxcy5zdHJpbmdpZnkoe1xuICAgICAgdXRmODogJ+KckycsXG4gICAgICBhdXRoZW50aWNpdHlfdG9rZW46IHRva2VuLFxuICAgICAgY29tbWl0OiAnQ29tbWVudCcsXG4gICAgICBjb21tZW50OiB7XG4gICAgICAgIHBzZXVkX2lkOiBwc2V1ZElkLFxuICAgICAgICBjb250ZW50OiBjb21tZW50LFxuICAgICAgICBjb250cm9sbGVyX25hbWU6ICdjaGFwdGVycydcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBlbmRwb2ludCA9IGAke0FPMy5zaXRlfS9jaGFwdGVycy8ke2NoYXB0ZXJJZH0vY29tbWVudHNgO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBpbnN0YW5jZS5wb3N0KGVuZHBvaW50LCBwYXJhbXMsIHNldHRpbmdzKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICB9XG5cbiAgLy8gY29tbWVudHMgYXJlIGZ1Y2tlZFxuXG4gIHN0YXRpYyBhc3luYyBkZWxldGVDb21tZW50KCkgeyB9XG5cbiAgLy8gZW5kcG9pbnQ6IGh0dHA6Ly9hcmNoaXZlb2ZvdXJvd24ub3JnL3VzZXJzL25vZm94L3BzZXVkc1xuICAvLyBzZWxlY3RvcjogI21haW4gPiB1bC5wc2V1ZC5pbmRleC5ncm91cCA+IGxpID4gdWwgPiBsaTpudGgtY2hpbGQoMikgPiBhXG4gIHN0YXRpYyBhc3luYyBnZXRQc2V1ZElkKHVzZXIpIHtcbiAgICBpZiAoIUFPMy51c2VyKSB7XG4gICAgICBhd2FpdCBBTzMubG9naW4oQU8zLmNyZWRlbnRpYWxzKTtcbiAgICB9XG5cbiAgICBjb25zdCBlbmRwb2ludCA9IGBodHRwOi8vYXJjaGl2ZW9mb3Vyb3duLm9yZy91c2Vycy8ke3VzZXJ9L3BzZXVkc2A7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnN0YW5jZS5nZXQoZW5kcG9pbnQsIHNldHRpbmdzKTtcbiAgICAgIGNvbnN0ICQgPSBjaGVlcmlvLmxvYWQocmVzcG9uc2UuZGF0YSk7XG4gICAgICBjb25zdCBwc2V1ZElkID0gJCgnI21haW4gPiB1bC5wc2V1ZC5pbmRleC5ncm91cCA+IGxpID4gdWwnKS5odG1sKCkubWF0Y2goLyhcXGQrKS9nKVswXTsgLy8gdGhpcyBpcyBoZWxsYSBqYW5reVxuICAgICAgcmV0dXJuIHBzZXVkSWQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cbiAgfVxuXG4gIC8vICAgdXRmODrinJNcbiAgLy8gYXV0aGVudGljaXR5X3Rva2VuOmZycHZKUkd2Z0dISXgyMkdCZ2ppRC81QzQvcVZLbTdQSlU3SHJ2MzcydWM9XG4gIC8vIHN1YnNjcmlwdGlvbltzdWJzY3JpYmFibGVfaWRdOjg2NzE0ODlcbiAgLy8gc3Vic2NyaXB0aW9uW3N1YnNjcmliYWJsZV90eXBlXTpXb3JrXG5cbiAgc3RhdGljIGFzeW5jIHN1YnNjcmliZVdvcmsod29ya0lkKSB7XG4gICAgaWYgKCFBTzMudXNlcikge1xuICAgICAgYXdhaXQgQU8zLmxvZ2luKEFPMy5jcmVkZW50aWFscyk7XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW4gPSBhd2FpdCBBTzMuZ2V0VG9rZW4oKTtcbiAgICBjb25zdCBwcmVmZXJlbmNlcyA9IHtcbiAgICAgIHV0Zjg6ICfinJMnLFxuICAgICAgYXV0aGVudGljaXR5X3Rva2VuOiB0b2tlbixcbiAgICAgIHN1YnNjcmlwdGlvbjoge1xuICAgICAgICBzdWJzY3JpYmFibGVfaWQ6IHdvcmtJZCxcbiAgICAgICAgc3Vic2NyaWJhYmxlX3R5cGU6ICdXb3JrJ1xuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgcGFyYW1zID0gcXMuc3RyaW5naWZ5KHByZWZlcmVuY2VzKTtcbiAgICBjb25zdCBlbmRwb2ludCA9IGAke0FPMy5zaXRlfS91c2Vycy8ke0FPMy51c2VyfS9zdWJzY3JpcHRpb25zYDtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IGluc3RhbmNlLnBvc3QoZW5kcG9pbnQsIHBhcmFtcywgc2V0dGluZ3MpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGVycjtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZ2V0VXNlclN1YnNjcmliYWJsZUlkKHVzZXIpIHtcbiAgICBjb25zdCBlbmRwb2ludCA9IGAke0FPMy5zaXRlfS91c2Vycy8ke3VzZXJ9L2A7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnN0YW5jZS5nZXQoZW5kcG9pbnQsIHNldHRpbmdzKTtcbiAgICAgIGNvbnN0ICQgPSBjaGVlcmlvLmxvYWQocmVzcG9uc2UuZGF0YSk7XG4gICAgICBjb25zdCB1c2VySWQgPSAkKCdpbnB1dCNzdWJzY3JpcHRpb25fc3Vic2NyaWJhYmxlX2lkJykuYXR0cigndmFsdWUnKTtcbiAgICAgIHJldHVybiB1c2VySWQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVuZHBvaW50OiBodHRwOi8vYXJjaGl2ZW9mb3Vyb3duLm9yZy91c2Vycy9ub2ZveC9zdWJzY3JpcHRpb25zXG4gIC8vIHF1ZXJ5IHBhcmFtczpcbiAgLy8gdXRmODrinJNcbiAgLy8gYXV0aGVudGljaXR5X3Rva2VuOjFuUGEwNENMN29oVGQ1Q3BZYWJFY2NkWHlIc2RNaVd0RnAwMm1xTTFmVmM9XG4gIC8vIHN1YnNjcmlwdGlvbltzdWJzY3JpYmFibGVfaWRdOjI3MjQ1OTZcbiAgLy8gc3Vic2NyaXB0aW9uW3N1YnNjcmliYWJsZV90eXBlXTpVc2VyXG4gIC8vIHJldHVybnM6IHtcIml0ZW1faWRcIjo5NDUwOTcwNyxcIml0ZW1fc3VjY2Vzc19tZXNzYWdlXCI6XCJZb3UgYXJlIG5vdyBmb2xsb3dpbmcgbm9mb3guIElmIHlvdSdkIGxpa2UgdG8gc3RvcCByZWNlaXZpbmcgZW1haWwgdXBkYXRlcywgeW91IGNhbiB1bnN1YnNjcmliZSBmcm9tIDxhIGhyZWY9XFxcImh0dHA6Ly9hcmNoaXZlb2ZvdXJvd24ub3JnL3VzZXJzL25vZm94L3N1YnNjcmlwdGlvbnNcXFwiPnlvdXIgU3Vic2NyaXB0aW9ucyBwYWdlPC9hPi5cIn1cbiAgc3RhdGljIGFzeW5jIHN1YnNjcmliZVVzZXIodXNlcikge1xuICAgIGlmICghQU8zLnVzZXIpIHtcbiAgICAgIGF3YWl0IEFPMy5sb2dpbihBTzMuY3JlZGVudGlhbHMpO1xuICAgIH1cblxuICAgIGNvbnN0IHRva2VuID0gYXdhaXQgQU8zLmdldFRva2VuKCk7XG4gICAgY29uc3QgdXNlcklkID0gYXdhaXQgQU8zLmdldFVzZXJTdWJzY3JpYmFibGVJZCh1c2VyKTtcbiAgICBjb25zdCBlbmRwb2ludCA9IGAke0FPMy5zaXRlfS91c2Vycy8ke0FPMy51c2VyfS9zdWJzY3JpcHRpb25zYDtcbiAgICBjb25zdCBwYXJhbXMgPSBxcy5zdHJpbmdpZnkoe1xuICAgICAgdXRmODogJ+KckycsXG4gICAgICBfbWV0aG9kOiAncHV0JyxcbiAgICAgIGF1dGhlbnRpY2l0eV90b2tlbjogdG9rZW4sXG4gICAgICBzdWJzY3JpcHRpb246IHtcbiAgICAgICAgc3Vic2NyaWJhYmxlX2lkOiB1c2VySWQsXG4gICAgICAgIHN1YnNjcmliYWJsZV90eXBlOiAnVXNlcidcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGluc3RhbmNlLnBvc3QoZW5kcG9pbnQsIHBhcmFtcywgc2V0dGluZ3MpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGVycjtcbiAgICB9XG4gIH1cblxuICAvLyBlbmRwb2ludDogaHR0cDovL2FyY2hpdmVvZm91cm93bi5vcmcvdXNlcnMvbm9mb3gvc3Vic2NyaXB0aW9ucy85NDUwOTcwN1xuICAvLyBxdWVyeSBwYXJhbXM6IHV0Zjg64pyTXG4gIC8vIGF1dGhlbnRpY2l0eV90b2tlbjoxblBhMDRDTDdvaFRkNUNwWWFiRWNjZFh5SHNkTWlXdEZwMDJtcU0xZlZjPVxuICAvLyBzdWJzY3JpcHRpb25bc3Vic2NyaWJhYmxlX2lkXToyNzI0NTk2XG4gIC8vIHN1YnNjcmlwdGlvbltzdWJzY3JpYmFibGVfdHlwZV06VXNlclxuICAvLyBfbWV0aG9kOmRlbGV0ZVxuICBzdGF0aWMgYXN5bmMgdW5zdWJzY3JpYmVVc2VyKHVzZXIpIHtcbiAgICBpZiAoIUFPMy51c2VyKSB7XG4gICAgICBhd2FpdCBBTzMubG9naW4oQU8zLmNyZWRlbnRpYWxzKTtcbiAgICB9XG4gICAgY29uc3QgdG9rZW4gPSBhd2FpdCBBTzMuZ2V0VG9rZW4oKTtcbiAgICBjb25zdCB1c2VySWQgPSBhd2FpdCBBTzMuZ2V0VXNlclN1YnNjcmliYWJsZUlkKHVzZXIpO1xuICAgIGNvbnN0IGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9L3VzZXJzLyR7QU8zLnVzZXJ9L3N1YnNjcmlwdGlvbnMvJHt1c2VySWR9YDtcbiAgICBjb25zdCBwYXJhbXMgPSBxcy5zdHJpbmdpZnkoe1xuICAgICAgdXRmODogJ+KckycsXG4gICAgICBfbWV0aG9kOiAnZGVsZXRlJyxcbiAgICAgIGF1dGhlbnRpY2l0eV90b2tlbjogdG9rZW4sXG4gICAgICBzdWJzY3JpcHRpb246IHtcbiAgICAgICAgc3Vic2NyaWJhYmxlX2lkOiB1c2VySWQsXG4gICAgICAgIHN1YnNjcmliYWJsZV90eXBlOiAnVXNlcidcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGluc3RhbmNlLnBvc3QoZW5kcG9pbnQsIHBhcmFtcywgc2V0dGluZ3MpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGVycjtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgcHJvZmlsZSh1c2VyKSB7XG4gICAgcmV0dXJuIGF3YWl0IEFPMy51c2VyRGFzaGJvYXJkKHVzZXIpO1xuICB9XG5cbiAgLy8gcmV0dXJuIGFsbCB0YWdzIGluIGEgZmFuZG9tXG4gIC8vIEFuaW1lICYgTWFuZ2FcbiAgLy8gQm9va3MgJiBMaXRlcmF0dXJlXG4gIC8vIENhcnRvb25zICYgQ29taWNzICYgR3JhcGhpYyBOb3ZlbHNcbiAgLy8gQ2VsZWJyaXRpZXMgJiBSZWFsIFBlb3BsZVxuICAvLyBNb3ZpZXNcbiAgLy8gTXVzaWMgJiBCcmFuZHNcbiAgLy8gT3RoZXIgTWVkaWFcbiAgLy8gVGhlYXRyZVxuICAvLyBUViBTaG93c1xuICAvLyBWaWRlbyBHYW1lc1xuICAvLyBVbmNhdGVnb3JpemVkIEZhbmRvbXNcbiAgc3RhdGljIGFzeW5jIG1lZGlhKGZhbmRvbSkge1xuICAgIGNvbnN0IGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9L21lZGlhLyR7ZXNjYXBlKGZhbmRvbSl9L2ZhbmRvbXNgO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UuZ2V0KGVuZHBvaW50KTtcbiAgICBjb25zdCAkID0gY2hlZXJpby5sb2FkKHJlc3BvbnNlLmRhdGEpO1xuICAgIGNvbnN0IGluZGV4ID0gJCgnb2wuZmFuZG9tJykuZmluZCgnbGkubGV0dGVyJyk7XG4gICAgY29uc3QgZmFuZG9tcyA9IGluZGV4Lm1hcChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgIGNvbnN0IGxldHRlciA9ICQodGhpcykuZmluZCgnaDMuaGVhZGluZycpLnRleHQoKS5yZXBsYWNlKC9cXHMvZywgJycpLnRyaW0oKTtcbiAgICAgIGNvbnN0IGl0ZW1zID0gJCh0aGlzKS5maW5kKCd1bC50YWdzJykuZmluZCgnbGknKS5tYXAoZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICAgIGNvbnN0IHRhZyA9ICQodGhpcykuZmluZCgnYS50YWcnKS50ZXh0KCk7XG4gICAgICAgIGNvbnN0IG51bWJlciA9ICQodGhpcykudGV4dCgpLnJlcGxhY2UoL1xcRC9nLCAnJykudHJpbSgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRhZzoge1xuICAgICAgICAgICAgbmFtZTogdGFnLFxuICAgICAgICAgICAgd29ya3M6IG51bWJlclxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0pLmdldCgpO1xuXG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICBbbGV0dGVyXTogaXRlbXNcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgIH0pLmdldCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1ldGE6IEFPMy5nZXRSZXNwb25zZU1ldGEocmVzcG9uc2UpLFxuICAgICAgZGF0YTogZmFuZG9tc1xuICAgIH07XG4gIH1cblxuICAvLyByZXR1cm5zIGxhdGVzdCB3b3Jrc1xuICByZWNlbnRXb3JrcygpIHsgfVxuXG4gIHN0YXRpYyBhc3luYyBoYW5kbGVSZWRpcmVjdChlbmRwb2ludCkge1xuICAgIGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9LyR7ZW5kcG9pbnR9YDtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGluc3RhbmNlLmdldChlbmRwb2ludCwgc2V0dGluZ3MpO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gIH1cblxuICBzdGF0aWMgcGFyc2VDaGFwdGVycygkKSB7XG4gICAgbGV0IHdvcmsgPSAkKCdkaXYud3JhcHBlcicpO1xuICAgIGxldCBzdGF0cyA9IHdvcmsuZmluZCgnZGQuc3RhdHMnKS5maW5kKCdkbC5zdGF0cycpO1xuICAgIGxldCBjaGFwdGVycyA9IHN0YXRzLmZpbmQoJ2RkLmNoYXB0ZXJzJykudGV4dCgpO1xuICAgIHJldHVybiBjaGFwdGVycztcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyB3b3JrKGlkKSB7XG4gICAgY29uc3QgcGVybWlzc2lvbiA9IHFzLnN0cmluZ2lmeSh7IC8vIE5PVEU6IHRoaXMgaXMgd29ua3lcbiAgICAgIHZpZXdfYWR1bHQ6IHRydWUsXG4gICAgICB2aWV3X2Z1bGxfd29yazogdHJ1ZVxuICAgIH0pO1xuICAgIGNvbnN0IGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9L3dvcmtzLyR7aWR9PyR7cGVybWlzc2lvbn1gO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UuZ2V0KGVuZHBvaW50LCBzZXR0aW5ncyk7XG4gICAgbGV0ICQgPSBjaGVlcmlvLmxvYWQocmVzcG9uc2UuZGF0YSk7XG4gICAgLy8gY29uc3QgcmVkaXJlY3QgPSAkKCdkaXYjaW5uZXInKS5maW5kKCd1bC5hY3Rpb25zJykuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcbiAgICAvL1xuICAgIC8vIGlmIChyZWRpcmVjdCkge1xuICAgIC8vICAgJCA9IGNoZWVyaW8ubG9hZChhd2FpdCBBTzMuaGFuZGxlUmVkaXJlY3QocmVkaXJlY3QpKTtcbiAgICAvLyB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKTtcblxuICAgIGNvbnN0IGNoYXB0ZXJzID0gQU8zLnBhcnNlQ2hhcHRlcnMoJCk7XG4gICAgY29uc3Qgc3RhdHMgPSBBTzMucGFyc2VTdGF0cygkKCdkaXYud3JhcHBlcicpLmZpbmQoJ2RsLndvcmsnKSk7XG5cbiAgICBpZiAocGFyc2VJbnQoY2hhcHRlcnMsIDEwKSA+IDEpIHtcbiAgICAgIGNvbnN0IHRpdGxlID0gc3RyaXAoJCgnZGl2I3dvcmtza2luJykuZmluZCgnZGl2LnByZWZhY2UnKS5maW5kKCdoMi50aXRsZScpLnRleHQoKSk7XG4gICAgICBsZXQgdGV4dCA9ICQoJ2RpdiNjaGFwdGVycycpLmNoaWxkcmVuKCcuY2hhcHRlcicpLm1hcChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgICAgY29uc3QgY29udGVudCA9ICQoZWwpLmZpbmQoJ2Rpdi51c2Vyc3R1ZmYnKS5odG1sKCk7XG4gICAgICAgIGNvbnN0IGNoYXB0ZXJUaXRsZSA9IHN0cmlwKCQoZWwpLmZpbmQoJ2gzLnRpdGxlJykudGV4dCgpKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBbY2hhcHRlclRpdGxlXTogY29udGVudFxuICAgICAgICB9O1xuICAgICAgfSkuZ2V0KCk7XG5cbiAgICAgIHRleHQgPSB0ZXh0LnJlZHVjZSgoYWNjLCB2YWwpID0+IHtcbiAgICAgICAgY29uc3QgW2tleV0gPSBPYmplY3Qua2V5cyh2YWwpO1xuICAgICAgICBhY2Nba2V5XSA9IHZhbFtrZXldO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwge30pO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZXRhOiBBTzMuZ2V0UmVzcG9uc2VNZXRhKHJlc3BvbnNlKSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgIHRleHQsXG4gICAgICAgICAgc3RhdHNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCB0aXRsZSA9ICQoJyN3b3Jrc2tpbicpLmZpbmQoJ2gyLnRpdGxlJykudGV4dCgpO1xuICAgIGNvbnN0IHRleHQgPSAkKCcjY2hhcHRlcnMnKS5maW5kKCdkaXYudXNlcnN0dWZmJykuaHRtbCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1ldGE6IEFPMy5nZXRSZXNwb25zZU1ldGEocmVzcG9uc2UpLFxuICAgICAgZGF0YToge1xuICAgICAgICB0aXRsZSxcbiAgICAgICAgdGV4dCxcbiAgICAgICAgc3RhdHNcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIHdvcmtDb21tZW50cyh3b3JrSWQsIGNoYXB0ZXJJZCkge1xuICAgIGlmICghQU8zLnVzZXIpIHtcbiAgICAgIGF3YWl0IEFPMy5sb2dpbihBTzMuY3JlZGVudGlhbHMpO1xuICAgIH1cbiAgICBjb25zdCBlbmRwb2ludCA9IGNoYXB0ZXJJZCA/IGAke0FPMy5zaXRlfS93b3Jrcy8ke3dvcmtJZH0vY2hhcHRlcnMvJHtjaGFwdGVySWR9YCA6IGAke0FPMy5zaXRlfS93b3Jrcy8ke3dvcmtJZH0vbmF2aWdhdGVgO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UuZ2V0KGVuZHBvaW50LCBzZXR0aW5ncyk7XG4gICAgICBpZiAoIWNoYXB0ZXJJZCkge1xuICAgICAgICBsZXQgJCA9IGNoZWVyaW8ubG9hZChyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgY29uc3QgY2hhcHRlcklkcyA9ICQoJ29sLmNoYXB0ZXInKS5maW5kKCdsaScpLm1hcChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykuZmluZCgnYScpLmF0dHIoJ2hyZWYnKS5zcGxpdCgnLycpLnBvcCgpO1xuICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfSkuZ2V0KCk7XG4gICAgICAgIGNvbnN0IHByb21pc2VzID0gY2hhcHRlcklkcy5tYXAoaWQgPT4ge1xuICAgICAgICAgIHJldHVybiBpbnN0YW5jZS5nZXQoYCR7QU8zLnNpdGV9L2NvbW1lbnRzL3Nob3dfY29tbWVudHM/Y2hhcHRlcl9pZD0ke2lkfWAsIHtcbiAgICAgICAgICAgIEFjY2VwdDogJyovKjtxPTAuNSwgdGV4dC9qYXZhc2NyaXB0LCBhcHBsaWNhdGlvbi9qYXZhc2NyaXB0LCBhcHBsaWNhdGlvbi9lY21hc2NyaXB0LCBhcHBsaWNhdGlvbi94LWVjbWFzY3JpcHQnLFxuICAgICAgICAgICAgJ0FjY2VwdC1FbmNvZGluZyc6ICdnemlwIGRlZmxhdGUsIHNkY2gnLFxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L2phdmFzY3JpcHQ7IGNoYXJzZXQ9dXRmLTgnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGVycjtcbiAgICB9XG4gIH1cblxuICAvLyByZXR1cm5zIGxhdGVzdCBib29rbWFya3NcbiAgYm9va21hcmtzKCkgeyB9XG5cbiAgLy8gbW9zdCBwb3B1bGFyIGFuZCByYW5kb21cbiAgLy8gdGFncy86ZmFuZG9tL3dvcmtzP3txdWVyeX1cbiAgc3RhdGljIGFzeW5jIHRhZ3MoZmFuZG9tLCBxdWVyeSA9IHt9KSB7XG4gICAgY29uc3QgcGFnZSA9IGhhcyhxdWVyeSwgJ3BhZ2UnKSA/IHF1ZXJ5LnBhZ2UgOiAwO1xuICAgIGNvbnN0IGVuZHBvaW50ID0gYCR7QU8zLnNpdGV9L3RhZ3MvJHtmYW5kb219L3dvcmtzPyR7cXMuc3RyaW5naWZ5KHF1ZXJ5KX1gO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UuZ2V0KGVuZHBvaW50KTtcbiAgICBjb25zdCAkID0gY2hlZXJpby5sb2FkKHJlc3BvbnNlLmRhdGEpO1xuICAgIGNvbnN0IGRhdGEgPSBBTzMucGFyc2VXb3JrcygkKTtcbiAgICBjb25zdCBmb3VuZCA9ICQoJ2RpdiNtYWluJykuZmluZCgnaDIuaGVhZGluZycpLnRleHQoKS5tYXRjaCgvKFteb2ZdKSsoPz1Xb3JrcykvLCAnJylbMF0udHJpbSgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1ldGE6IEFPMy5nZXRSZXNwb25zZU1ldGEocmVzcG9uc2UpLFxuICAgICAgZGF0YToge1xuICAgICAgICBwYWdlLFxuICAgICAgICBmb3VuZCxcbiAgICAgICAgaXRlbXM6IGRhdGEsXG4gICAgICAgIGxlbmd0aDogZGF0YS5sZW5ndGhcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gc2hvd3MgYWxsIGNvbGxlY3Rpb25zXG4gIGNvbGxlY3Rpb25zKCkgeyB9XG5cbiAgLy8gYWxsIGNoYWxsZW5nZXMgb3IgZ2lmdCBleGNoYW5nZSBjaGFsbGVuZ2VzXG4gIGNoYWxsZW5nZXMoKSB7IH1cblxuICAvLyBhcHBsaWVzIGNvbGxlY3Rpb25zIGZpbHRlcnNcbiAgY29sbGVjdGlvbnNTZWFyY2goKSB7IH1cblxuICBzdGF0aWMgZm9ybWF0V29ya3NGaWx0ZXJFbmRwb2ludChxdWVyeSkge1xuICAgIGxldCBlbmRwb2ludCA9IGAke0FPMy5zaXRlfS93b3Jrcz91dGY4PSVFMiU5QyU5M2A7XG4gICAgY29uc3QgeyB0YWdfaWQgfSA9IHF1ZXJ5O1xuICAgIGRlbGV0ZSBxdWVyeS50YWdfaWQ7XG4gICAgcXVlcnkgPSBxcy5zdHJpbmdpZnkoeyBjb21taXQ6ICdTb3J0IGFuZCBGaWx0ZXInLCB3b3JrX3NlYXJjaDogcXVlcnksIHRhZ19pZCB9KTtcbiAgICByZXR1cm4gYCR7ZW5kcG9pbnR9JiR7cXVlcnl9YDtcbiAgfVxuXG4gIC8vIHdvcmtfc2VhcmNoOlxuICAvLyAgeyBzb3J0X2NvbHVtbjogJ3JldmlzZWRfYXQnLFxuICAvLyAgICByYXRpbmdfaWRzOiBbICcxMScgXSxcbiAgLy8gICAgd2FybmluZ19pZHM6IFsgJzE0JywgJzE3JyBdLFxuICAvLyAgICBjYXRlZ29yeV9pZHM6IFsgJzIyJywgJzIyNDYnLCAnMTE2JywgJzIzJywgJzIxJywgJzI0JyBdLFxuICAvLyAgICBmYW5kb21faWRzOiBbICczNDA2NTE0JyBdLFxuICAvLyAgICBjaGFyYWN0ZXJfaWRzOlxuICAvLyAgICAgWyAnOTI3ODc0MCcsXG4gIC8vICAgICAgICc5NjA0MTE3JyxcbiAgLy8gICAgICAgJzcyNjY0NzYnLFxuICAvLyAgICAgICAnNzk3MDc1OCcsXG4gIC8vICAgICAgICc3MjY2NDczJyxcbiAgLy8gICAgICAgJzc5NzA4NjMnLFxuICAvLyAgICAgICAnOTg2MDMwMicsXG4gIC8vICAgICAgICc5ODYwMDk4JyxcbiAgLy8gICAgICAgJzEwMjcwMzQ4JyxcbiAgLy8gICAgICAgJzk4NjAzMjknIF0sXG4gIC8vICAgIHJlbGF0aW9uc2hpcF9pZHM6IFsgJzEwMTE3OTQwJywgJzg5NDA1ODknIF0sXG4gIC8vICAgIGZyZWVmb3JtX2lkczogWyAnOTg3MDAnIF0sXG4gIC8vICAgIG90aGVyX3RhZ19uYW1lczogJycsXG4gIC8vICAgIHF1ZXJ5OiAnJyxcbiAgLy8gICAgbGFuZ3VhZ2VfaWQ6ICcxJyxcbiAgLy8gICAgY29tcGxldGU6IFsgJzAnLCAnMScgXSB9XG5cbiAgc3RhdGljIGFzeW5jIHdvcmtzRmlsdGVyKHRhZywgcXVlcnkgPSB7fSkge1xuICAgIHRyeSB7XG4gICAgICBPYmplY3QuYXNzaWduKHF1ZXJ5LCB7IHRhZ19pZDogdGFnIH0pO1xuICAgICAgY29uc3QgZW5kcG9pbnQgPSBBTzMuZm9ybWF0V29ya3NGaWx0ZXJFbmRwb2ludChxdWVyeSk7XG5cbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UuZ2V0KGVuZHBvaW50LCB7XG4gICAgICAgIHRpbWVvdXQ6IDMwMDBcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCAkID0gY2hlZXJpby5sb2FkKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgY29uc3QgcGFnZSA9IGhhcyhxdWVyeSwgJ3BhZ2UnKSA/IHF1ZXJ5LnBhZ2UgOiAwO1xuICAgICAgY29uc3QgZm91bmQgPSAkKCdkaXYjbWFpbicpLmZpbmQoJ2gyLmhlYWRpbmcnKS50ZXh0KCkubWF0Y2goLyhbXm9mXSkrKD89V29ya3MpLywgJycpWzBdLnRyaW0oKTtcblxuICAgICAgY29uc3QgZGF0YSA9IEFPMy5wYXJzZVdvcmtzKCQpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZXRhOiBBTzMuZ2V0UmVzcG9uc2VNZXRhKHJlc3BvbnNlKSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgZm91bmQsXG4gICAgICAgICAgaXRlbXM6IGRhdGEsXG4gICAgICAgICAgbGVuZ3RoOiBkYXRhLmxlbmd0aFxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGVycjtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZm9ybWF0V29ya3NTZWFyY2hFbmRwb2ludChxdWVyeSwgcGFnZSkge1xuICAgIHF1ZXJ5ID0gcXMuc3RyaW5naWZ5KHsgd29ya19zZWFyY2g6IHF1ZXJ5IH0pO1xuICAgIGxldCBlbmRwb2ludCA9IGAke0FPMy5zaXRlfS93b3Jrcy9zZWFyY2hgO1xuICAgIGlmIChwYWdlID09PSAwKSB7XG4gICAgICBlbmRwb2ludCA9IGAke2VuZHBvaW50fT91dGY4PSVFMiU5QyU5MyYke3F1ZXJ5fWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVuZHBvaW50ID0gYCR7ZW5kcG9pbnR9P3BhZ2U9JHtwYWdlfT91dGY4PSVFMiU5QyU5MyYke3F1ZXJ5fWA7XG4gICAgfVxuICAgIHJldHVybiBlbmRwb2ludDtcbiAgfVxuXG4gIC8vIHF1ZXJ5LCB0aXRsZSwgY3JlYXRvciwgcmV2aXNlZF9hdCwgY29tcGxldGUsIHNpbmdsZV9jaGFwdGVyLCB3b3JkX2NvdW50LCBsYW5ndWFnZV9pZCwgZmFuZG9tX25hbWVzLCByYXRpbmdfaWRzLCB3YXJuaW5nX2lkcywgY2F0ZWdvcnlfaWRzLCBjaGFyYWN0ZXJfbmFtZXMsIHJlbGF0aW9uc2hpcF9uYW1lcywgZnJlZWZvcm1fbmFtZXMsIGhpdHMsIGt1ZG9zX2NvdW50LCBjb21tZW50c19jb3VudCwgYm9va21hcmtzX2NvdW50LCBzb3J0X2NvbHVtbiwgc29ydF9kaXJlY3Rpb25cbiAgc3RhdGljIGFzeW5jIHdvcmtzU2VhcmNoKHF1ZXJ5KSB7XG4gICAgY29uc3QgcGFnZSA9IGhhcyhxdWVyeSwgJ3BhZ2UnKSA/IHF1ZXJ5LnBhZ2UgOiAwO1xuXG4gICAgaWYgKHBhZ2UgIT09IDApIHtcbiAgICAgIGRlbGV0ZSBxdWVyeS5wYWdlO1xuICAgIH1cblxuICAgIGNvbnN0IGVuZHBvaW50ID0gQU8zLmZvcm1hdFdvcmtzU2VhcmNoRW5kcG9pbnQocXVlcnksIHBhZ2UpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGluc3RhbmNlLmdldChlbmRwb2ludCk7XG4gICAgICBjb25zdCAkID0gY2hlZXJpby5sb2FkKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgY29uc3QgZm91bmQgPSBwYXJzZUludCgkKCcjbWFpbicpLmZpbmQoJ2gzLmhlYWRpbmcnKS50ZXh0KCksIDEwKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBBTzMucGFyc2VXb3JrcygkKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1ldGE6IEFPMy5nZXRSZXNwb25zZU1ldGEocmVzcG9uc2UpLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcGFnZSxcbiAgICAgICAgICBmb3VuZCxcbiAgICAgICAgICBpdGVtczogZGF0YSxcbiAgICAgICAgICBsZW5ndGg6IGRhdGEubGVuZ3RoXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBwYXJzZVdvcmtzKCQpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuICQoJ29sLndvcmsnKS5maW5kKCdsaS53b3JrJykubWFwKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICBjb25zdCBoZWFkaW5nID0gJCh0aGlzKS5maW5kKCdoNC5oZWFkaW5nJykuZmluZCgnYScpO1xuICAgICAgICBjb25zdCB0aXRsZSA9IGhlYWRpbmcuZmlyc3QoKS50ZXh0KCk7XG4gICAgICAgIGNvbnN0IGF1dGhvciA9IGhlYWRpbmcubGFzdCgpLnRleHQoKTtcbiAgICAgICAgaWYgKHRpdGxlKSB7XG4gICAgICAgICAgY29uc3QgaWQgPSAkKHRoaXMpLmF0dHIoJ2lkJykucmVwbGFjZSgvd29ya18vLCAnJyk7XG4gICAgICAgICAgY29uc3QgZmFuZG9tID0gJCh0aGlzKS5maW5kKCdoNScpLmZpbmQoJ2EnKS50ZXh0KCk7XG4gICAgICAgICAgY29uc3Qgc3VtbWFyeSA9IHN0cmlwKCQodGhpcykuZmluZCgnLnN1bW1hcnknKS50ZXh0KCkpO1xuICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSAkKHRoaXMpLmZpbmQoJ3AuZGF0ZXRpbWUnKS50ZXh0KCk7XG5cbiAgICAgICAgICBjb25zdCBzdGF0cyA9IEFPMy5wYXJzZVN0YXRzKCQodGhpcykpO1xuICAgICAgICAgIGNvbnN0IHRhZ3MgPSBBTzMucGFyc2VUYWdzKCQsICQoZWwpLmZpbmQoJ3VsLnRhZ3MnKSk7XG4gICAgICAgICAgY29uc3QgcmVxdWlyZWRfdGFncyA9IEFPMy5wYXJzZVJlcXVpcmVkVGFncygkLCB0aGlzKTtcblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZCwgdGl0bGUsIGF1dGhvciwgZmFuZG9tLCB1cGRhdGVkLCByZXF1aXJlZF90YWdzLCB0YWdzLCBzdW1tYXJ5LCBzdGF0c1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0pLmdldCgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGVycjtcbiAgICB9XG4gIH1cblxuICAvLyBjb250ZW50IHJhdGluZywgcmVsYXRpb25zaGlwcywgY29udGVudCB3YXJuaW5ncywgZmluaXNoZWQ/XG4gIHN0YXRpYyBwYXJzZVJlcXVpcmVkVGFncygkLCBlbCkge1xuICAgIGNvbnN0IFtjb250ZW50X3JhdGluZywgcmVsYXRpb25zaGlwcywgY29udGVudF93YXJuaW5ncywgZmluaXNoZWRdID0gJChlbCkuZmluZCgndWwucmVxdWlyZWQtdGFncycpLmZpbmQoJ2xpJykubWFwKChpLCBlbCkgPT4ge1xuICAgICAgcmV0dXJuICQoZWwpLmZpbmQoJ3NwYW4nKS5hdHRyKCd0aXRsZScpO1xuICAgIH0pLmdldCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnRfcmF0aW5nLCByZWxhdGlvbnNoaXBzLCBjb250ZW50X3dhcm5pbmdzLCBmaW5pc2hlZFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgcGFyc2VTdGF0cyh3b3JrSGVhZGluZykge1xuICAgIGNvbnN0IHN0YXRzRWxlbSA9IHdvcmtIZWFkaW5nLmZpbmQoJ2RsLnN0YXRzJyk7XG4gICAgY29uc3QgdXBkYXRlZCA9IHdvcmtIZWFkaW5nLmZpbmQoJ2Rpdi5tb2R1bGUnKS5maW5kKCdwLmRhdGV0aW1lJykudGV4dCgpIHx8IHN0YXRzRWxlbS5maW5kKCdkZC5zdGF0dXMnKS50ZXh0KCk7XG4gICAgY29uc3QgbGFuZ3VhZ2UgPSBzdHJpcCh3b3JrSGVhZGluZy5maW5kKCdkZC5sYW5ndWFnZScpLnRleHQoKSk7XG4gICAgY29uc3Qgd29yZHMgPSBzdGF0c0VsZW0uZmluZCgnZGQud29yZHMnKS50ZXh0KCk7XG4gICAgY29uc3QgY2hhcHRlcnMgPSBzdGF0c0VsZW0uZmluZCgnZGQuY2hhcHRlcnMnKS50ZXh0KCk7XG4gICAgY29uc3Qga3Vkb3MgPSBzdGF0c0VsZW0uZmluZCgnZGQua3Vkb3MnKS50ZXh0KCkgfHwgMDtcbiAgICBjb25zdCBib29rbWFya3MgPSBzdGF0c0VsZW0uZmluZCgnZGQuYm9va21hcmtzJykudGV4dCgpO1xuICAgIGNvbnN0IGhpdHMgPSBzdGF0c0VsZW0uZmluZCgnZGQuaGl0cycpLnRleHQoKTtcblxuICAgIHJldHVybiB7XG4gICAgICBsYW5ndWFnZSwgd29yZHMsIGNoYXB0ZXJzLCBrdWRvcywgYm9va21hcmtzLCBoaXRzLCB1cGRhdGVkXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBwYXJzZVRhZ3MoJCwgdGFnRWxlbSkge1xuICAgIGNvbnN0IHdhcm5pbmdzID0gdGFnRWxlbS5maW5kKCdsaS53YXJuaW5ncycpLnRleHQoKTtcbiAgICBjb25zdCByZWxhdGlvbnNoaXBzID0gdGFnRWxlbS5maW5kKCdsaS5yZWxhdGlvbnNoaXBzJykuZmluZCgnYScpLm1hcCgoaSwgZWwpID0+IHtcbiAgICAgIHJldHVybiAkKGVsKS50ZXh0KCk7XG4gICAgfSkuZ2V0KCk7XG4gICAgY29uc3QgZnJlZWZvcm1zID0gdGFnRWxlbS5maW5kKCdsaS5mcmVlZm9ybXMnKS5maW5kKCdhJykubWFwKChpLCBlbCkgPT4ge1xuICAgICAgcmV0dXJuICQoZWwpLnRleHQoKTtcbiAgICB9KS5nZXQoKTtcbiAgICBjb25zdCBjaGFyYWN0ZXJzID0gdGFnRWxlbS5maW5kKCdsaS5jaGFyYWN0ZXJzJykuZmluZCgnYScpLm1hcCgoaSwgZWwpID0+IHtcbiAgICAgIHJldHVybiAkKGVsKS50ZXh0KCk7XG4gICAgfSkuZ2V0KCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgd2FybmluZ3MsIHJlbGF0aW9uc2hpcHMsIGNoYXJhY3RlcnMsIGZyZWVmb3Jtc1xuICAgIH07XG4gIH1cblxuICBwZW9wbGVTZWFyY2goKSB7IH1cblxuICBib29rbWFya1NlYXJjaCgpIHsgfVxuXG4gIHRhZ1NlYXJjaCgpIHsgfVxuXG4gIC8vIHJldHVybnMgdHdlZXRzIGFuZCBuZXdzIGl0ZW1zIG9uIHRoZSBmcm9udCBwYWdlXG4gIC8vIFRPRE86IHRoaXMgaXNuJ3QgZG9uZVxuICBtYWluUGFnZSgpIHtcbiAgICBjb25zdCBwYXlsb2FkID0ge307XG4gICAgaW5zdGFuY2UuZ2V0KEFPMy5zaXRlKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIGNvbnN0IHsgZGF0YSB9ID0gcmVzcG9uc2U7XG4gICAgICBjb25zdCAkID0gY2hlZXJpby5sb2FkKGRhdGEpO1xuICAgICAgY29uc3QgbGkgPSAkKCd1bC5uZXdzJykuY2hpbGRyZW4oKTtcbiAgICAgIHBheWxvYWQuZGF0YSA9IG5ldyBBcnJheShsaS5sZW5ndGgpO1xuICAgICAgbGkuZWFjaChmdW5jdGlvbiAoaSwgY2hpbGQpIHtcbiAgICAgICAgY29uc3QgbWV0YSA9ICQodGhpcykuZmluZCgncC5tZXRhJyk7XG4gICAgICAgIGNvbnN0IGNvbW1lbnRzID0gbWV0YS5maW5kKCdzcGFuLmNvbW1lbnRzJykuZmluZCgnYScpLnRleHQoKTtcbiAgICAgICAgY29uc3QgcHVibGlzaGVkID0gbWV0YS5maW5kKCdzcGFuLnB1Ymxpc2hlZCcpO1xuICAgICAgICBwYXlsb2FkLmRhdGFbaV0gPSB7XG4gICAgICAgICAgdGV4dDogJCh0aGlzKS5maW5kKCdibG9ja3F1b3RlJykudGV4dCgpLFxuICAgICAgICAgIG1ldGE6IHtcbiAgICAgICAgICAgIGNvbW1lbnRzLFxuICAgICAgICAgICAgcHVibGlzaGVkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==