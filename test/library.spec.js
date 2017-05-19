import chai from 'chai';
import tough, { Cookie } from 'tough-cookie';
import Library from '../src/index.js';
import qs from 'qs';
import CREDENTIALS from '../credentials.json';
import 'babel-polyfill';

chai.expect();

const { expect } = chai;

describe('Given an instance of my library', function () {
  before(function () {
    Library.setCredentials(CREDENTIALS);
  });

  describe('when I call setCredentials', function () {
    it ('should set the user name and password', function () {
      expect(Library.credentials.user).to.equal(CREDENTIALS.user);
      expect(Library.credentials.password).to.equal(CREDENTIALS.password);
    });
  });

  describe('when I call login', function () {
    it ('should return response headers with a "user_credentials" cookie', async function (done) {
      this.timeout(15000);
      try {
        const response = await Library.login(CREDENTIALS);
        const cookieString = response.meta.config.headers.Cookie;
        const cookie = Cookie.parse(cookieString).toJSON();
        expect(cookie.key).to.equal('user_credentials');
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  // describe('when I call worksFilter', function () {
  //   it ('should return a filtered list of works', async function (done) {
  //     this.timeout(15000);
  //
  //     const mostExtremeQuery = 'http://archiveofourown.org/works?utf8=%E2%9C%93&commit=Sort+and+Filter&work_search%5Bsort_column%5D=revised_at&work_search%5Brating_ids%5D%5B%5D=10&work_search%5Bwarning_ids%5D%5B%5D=14&work_search%5Bwarning_ids%5D%5B%5D=16&work_search%5Bwarning_ids%5D%5B%5D=17&work_search%5Bwarning_ids%5D%5B%5D=18&work_search%5Bwarning_ids%5D%5B%5D=20&work_search%5Bwarning_ids%5D%5B%5D=19&work_search%5Bcategory_ids%5D%5B%5D=23&work_search%5Bcategory_ids%5D%5B%5D=22&work_search%5Bcategory_ids%5D%5B%5D=116&work_search%5Bcategory_ids%5D%5B%5D=21&work_search%5Bcategory_ids%5D%5B%5D=2246&work_search%5Bcategory_ids%5D%5B%5D=24&work_search%5Bfandom_ids%5D%5B%5D=721553&work_search%5Bfandom_ids%5D%5B%5D=55873&work_search%5Bcharacter_ids%5D%5B%5D=989133&work_search%5Bcharacter_ids%5D%5B%5D=859732&work_search%5Brelationship_ids%5D%5B%5D=976131&work_search%5Brelationship_ids%5D%5B%5D=893104&work_search%5Bother_tag_names%5D=Lotta+%28Charlie+and+Lola%29&work_search%5Bquery%5D=lol&work_search%5Blanguage_id%5D=1&work_search%5Bcomplete%5D=0&work_search%5Bcomplete%5D=1&tag_id=Shingeki+no+Kyojin+%7C+Attack+on+Titan';
  //     // console.log(qs.parse(mostExtremeQuery));
  //
  //     const response = await Library.worksFilter('Overwatch (Video Game)');
  //     // expect(response).to.be.a('object');
  //     done();
  //   });
  //
  //   it ('should return a filtered list of works based on filter params', async function (done) {
  //     this.timeout(15000);
  //
  //     const response = await Library.worksFilter('Overwatch (Video Game)', {
  //       query: 'lol',
  //       page: 2
  //     });
  //     // expect(response).to.be.a('object');
  //     done();
  //   });
  // });

  describe.only('when I call work', function () {
    it ('should return a filtered list of works based on filter params', async function (done) {
      this.timeout(15000);

      try {
        const response = await Library.work('9249503');
        expect(response.data.text).to.be.an('object');
        expect(Object.keys(response.data.text)).to.have.length(6);
        expect(response.data.stats.chapters).to.equal('6/6');
        expect(response.data.stats.language).to.equal('English');
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  describe('when I call tags', function () {
    it ('should return a filtered list of works from the designated tag based on filter params', async function (done) {
      this.timeout(15000);

      const response = await Library.tags('Sombra (Overwatch)');
      // expect(response).to.be.a('object');
      done();
    });
  });

  describe('when I call media', function () {
    it ('should return a list of tags in a fandom', async function (done) {
      this.timeout(15000);

      const response = await Library.media('Anime & Manga');
      // console.log(response);
      // expect(response).to.be.a('object');
      done();
    });
  });

  describe('when I call profile', function () {
    it ('should return a profile object with user\'s attributes', async function (done) {
      this.timeout(15000);

      const response = await Library.profile('nofox');
      // console.log(response);
      done();
    });
  });

  describe('when I call updatePreferences', function () {
    it ('preferences should be updated', async function (done) {
      this.timeout(15000);

      const preference = {
        email_visible: 1,
        date_of_birth_visible: 1,
        minimize_search_engines: 1,
        disable_share_links: 1,
        adult: 1,
        view_full_works: 1,
        hide_warnings: 1,
        hide_freeform: 1,
        disable_work_skins: 1,
        skin_id: 1,
        time_zone: 'Eastern Time (US & Canada)',
        work_title_format: 'TITLE - AUTHOR - FANDOM',
        hide_all_hit_counts: 1,
        hide_private_hit_count: 1,
        hide_public_hit_count: 1,
        comment_emails_off: 1,
        comment_inbox_off: 1,
        comment_copy_to_self_off: 1,
        kudos_emails_off: 1,
        admin_emails_off: 1,
        automatically_approve_collections: 1,
        collection_emails_off: 1,
        collection_inbox_off: 1,
        recipient_emails_off: 1,
        history_enabled: 1,
        first_login: 1,
        banner_seen: 1
      };

      try {
        const { data } = await Library.updatePreferences(preference);

        for (const key in data) {
          expect(data[key]).to.eq(1);
        }

        for (const key in preference) {
          preference[key] = 0;
        }

        await Library.updatePreferences(preference);

      } catch (err) {
        done(err);
      }
      done();
    });
  });

  describe('when I call getPreferences', function () {
    it ('it should return an object with the logged in user\'s preferences', async function (done) {
      this.timeout(15000);

      const { data } = await Library.getPreferences();

      for (const key in data) {
        expect(data[key]).to.equal(0);
      }

      done();
    });
  });

  describe('when I call updateUserProfile', function () {
    it ('it should update the logged in user\'s name', async function (done) {
      this.timeout(15000);

      const response = await Library.updateUserProfile({
        dateOfBirth: {
          day: 1, month: 1, year: 2001
        }
      });
      done();
    });
  });

  describe('when I call giveKudos', function () {
    it ('it should give kudos to designated work by ID', async function (done) {
      this.timeout(15000);
      const response = await Library.giveKudos('10230140');
      done();
    });
  });

  describe('when I call subscribe', function () {
    it ('it should return a success message', async function (done) {
      this.timeout(15000);

      try {
        const response = await Library.subscribeUser('Nekraan');
        console.log(response);
        done();
      } catch (err) {
        done(err);
      }
    });
  });


  describe('when I call unsubscribe', function () {
    it ('it should return a success message', async function (done) {
      this.timeout(15000);

      try {
        const response = await Library.unsubscribeUser('Nekraan');
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  describe('when I call getNewRelicId', function () {
    it ('it should retrieve xpid from script tags', async function (done) {
      this.timeout(15000);

      try {
        const response = await Library.getNewRelicId();
        console.log(response);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  describe('when I call tagsAutocomplete', function () {
    it ('it should return freeform tags', async function (done) {
      this.timeout(15000);

      try {
        const response = await Library.autocomplete('omg', {
          type: 'freeform'
        });

        expect(response.status).to.equal(200);
        expect(response).to.have.property('data');
        done();
      } catch (err) {
        done(err);
      }
    });

    it ('it should return character_in_fandom tags', async function (done) {
      this.timeout(15000);

      try {
        const response = await Library.autocomplete('so', {
          fandom: 'Overwatch (Video Game)',
          type: 'character_in_fandom'
        });

        expect(response.status).to.equal(200);
        expect(response).to.have.property('data');
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  describe('when I call getPseudId', function () {
    it ('it should get the current user\'s pseudo id', async function (done) {
      this.timeout(15000);

      try {
        const response = await Library.getPseudId('nofox');
        expect(response).to.eq('2932154');
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  describe('when I call bookmark', function () {
    it ('it should bookmark works by ID', async function (done) {
      this.timeout(15000);
      try {
        const response = await Library.bookmark('7169057');

        done();
      } catch (err) {
        done(err);
      }
    });
  });

  // describe('when I call comment', function () {
  //   it ('it should leave a comment by chapter ID', async function (done) {
  //     this.timeout(15000);
  //     try {
  //       const response = await Library.comment('23429562', 'test comment for javascript ');
  //       console.log(response);
  //       done();
  //     } catch (err) {
  //       done(err);
  //     }
  //   });
  // });

  // describe('when I call workComment', function () {
  //   it ('it should fetch comments by work id', async function (done) {
  //     this.timeout(15000);
  //     try {
  //       const response = await Library.workComments('9249503');
  //       console.log(response);
  //       done();
  //     } catch (err) {
  //       done(err);
  //     }
  //   });
  // });
});
