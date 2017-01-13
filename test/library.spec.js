import chai from 'chai';
import Library from '../src/index.js';
import qs from 'qs';
import 'babel-polyfill';

chai.expect();

const expect = chai.expect;

let lib;

describe('Given an instance of my library', function () {
  before(function () {
    lib = new Library();
  });

  describe('when I call fetch', function () {
    it('should return the A03 mainpage', () => {

    });
  });

  describe('when I call worksSearch', function () {
    it ('should return a list of works based on query parameters', function () {
      lib.fetch('/works/search', {
        query: 'sombra overwatch'
      }).then(response => {
        expect(response).to.be.a('object');
      });
    });

    it ('should return a list of works based on query parameters', async function(done) {
      this.timeout(15000);

      const response1 = await lib.fetch('/works/search', {
        query: 'sombra overwatch',
        page: 2
      });
      const response2 = await lib.fetch('/works/search', {
        query: 'sombra overwatch',
        page: 3
      });
      expect(response1.data).not.to.equal(response2.data);

      done();
    });
  });

  describe('when I call worksFilter', function () {
    it ('should return a filtered list of works', async function (done) {
      this.timeout(15000);

      const mostExtremeQuery = 'http://archiveofourown.org/works?utf8=%E2%9C%93&commit=Sort+and+Filter&work_search%5Bsort_column%5D=revised_at&work_search%5Brating_ids%5D%5B%5D=10&work_search%5Bwarning_ids%5D%5B%5D=14&work_search%5Bwarning_ids%5D%5B%5D=16&work_search%5Bwarning_ids%5D%5B%5D=17&work_search%5Bwarning_ids%5D%5B%5D=18&work_search%5Bwarning_ids%5D%5B%5D=20&work_search%5Bwarning_ids%5D%5B%5D=19&work_search%5Bcategory_ids%5D%5B%5D=23&work_search%5Bcategory_ids%5D%5B%5D=22&work_search%5Bcategory_ids%5D%5B%5D=116&work_search%5Bcategory_ids%5D%5B%5D=21&work_search%5Bcategory_ids%5D%5B%5D=2246&work_search%5Bcategory_ids%5D%5B%5D=24&work_search%5Bfandom_ids%5D%5B%5D=721553&work_search%5Bfandom_ids%5D%5B%5D=55873&work_search%5Bcharacter_ids%5D%5B%5D=989133&work_search%5Bcharacter_ids%5D%5B%5D=859732&work_search%5Brelationship_ids%5D%5B%5D=976131&work_search%5Brelationship_ids%5D%5B%5D=893104&work_search%5Bother_tag_names%5D=Lotta+%28Charlie+and+Lola%29&work_search%5Bquery%5D=lol&work_search%5Blanguage_id%5D=1&work_search%5Bcomplete%5D=0&work_search%5Bcomplete%5D=1&tag_id=Shingeki+no+Kyojin+%7C+Attack+on+Titan';
      // console.log(qs.parse(mostExtremeQuery));

      const response = await Library.worksFilter('Overwatch (Video Game)');
      // expect(response).to.be.a('object');
      done();
    });

    it ('should return a filtered list of works based on filter params', async function (done) {
      this.timeout(15000);

      const response = await Library.worksFilter('Overwatch (Video Game)', {
        query: 'lol',
        page: 2
      });
      // expect(response).to.be.a('object');
      done();
    });
  });

  describe('when I call work', function () {
    it ('should return a filtered list of works based on filter params', async function (done) {
      this.timeout(15000);

      const response = await Library.work('9179257');
      // expect(response).to.be.a('object');
      done();
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
      console.log(response);
      // expect(response).to.be.a('object');
      done();
    });
  });
});
