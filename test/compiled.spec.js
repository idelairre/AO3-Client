import chai from 'chai';
import tough, { Cookie } from 'tough-cookie';
import Library from '../lib/ao3.min';
import qs from 'qs';
import CREDENTIALS from '../credentials.json';
import 'babel-polyfill';

// NOTE: going to have to switch this to a browser context since "isNode" will always evaluate to false
// when the UMD is compiled

chai.expect();

const { expect } = chai;

describe('Given an instance of my library', function () {
  before(function () {
    Library.setCredentials(CREDENTIALS);
  });

  describe.only('when I call tagsAutocomplete', function () {
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
});
