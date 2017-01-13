import cheerio from 'cheerio';
import qs from 'qs';
import axios from './axios';
import { has, strip } from './utils';
import 'babel-polyfill';

export default class AO3 {

  static site = 'http://archiveofourown.org/';

  // fetch by endpoint
  fetch(endpoint, query = '') {
    // GET /works
    // GET /works/:id
    // GET /works/:id/chapters/:chapter
    // GET /works/search?utf8=%E2%9C%93&work_search%5Bquery%5D=sombra+overwatch
    // GET /bookmarks
    // GET /bookmarks/search?utf8=%E2%9C%93&bookmark_search%5Bquery%5D=e&bookmark_search%5Bbookmarker%5D=e&bookmark_search%5Bnotes%5D=e&bookmark_search%5Btag%5D=e&bookmark_search%5Brec%5D=0&bookmark_search%5Brec%5D=1&bookmark_search%5Bwith_notes%5D=0&bookmark_search%5Bwith_notes%5D=1&bookmark_search%5Bbookmarkable_type%5D=Work&bookmark_search%5Bdate%5D=e&bookmark_search%5Bbookmarkable_date%5D=e&bookmark_search%5Bsort_column%5D=&commit=Search+bookmarks
    // GET /tags
    // GET /tags/:fandom/works
    // GET /tags/search?utf8=%E2%9C%93&query%5Bname%5D=drunk&query%5Btype%5D=Fandom&query%5Bcanonical%5D=true
    // GET /collections
    // GET /collections?utf8=%E2%9C%93&sort_column=collections.created_at&sort_direction=ASC&collection_filters%5Btitle%5D=lol&collection_filters%5Bfandom%5D=&collection_filters%5Bclosed%5D=false&collection_filters%5Bmoderated%5D=false&collection_filters%5Bchallenge_type%5D=&commit=Sort+and+Filter
    // GET /people
    // GET /people/search?utf8=%E2%9C%93&query=nofox
    // GET /users
    // GET /users/:user
    // GET /users/:user/profile
    // GET /users/:user/pseuds
    // GET /users/:user/pseuds/:user
    // GET /users/:user/works
    // GET /users/:user/works/drafts
    // GET /users/:user/series
    // GET /users/:user/bookmarks
    // GET /users/:user/collections
    // GET /users/:user/inbox
    // GET /users/:user/stats
    // GET /users/:user/readings
    // GET /users/:user/subscriptions
    // gift stuff
  }

  post(endpoint) { }

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
    const endpoint = `${AO3.site}media/${escape(fandom)}/fandoms`;
    const response = await axios.get(endpoint);
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
      const payload = {};
      payload[letter] = items;

      return payload;
    }).get();

    return {
      data: fandoms
    };
  }

  // returns latest works
  recentWorks() { }

  static async handleRedirect(endpoint) {
    endpoint = `${AO3.site}${endpoint}`;
    const response = await axios.get(endpoint, {
      withCredentials: true,
      jar: true
    });

    return response.data;
  }

  static async work(id) {
    const permission = qs.stringify({
      view_adult: true,
      view_full_work: true
    });
    const endpoint = `${AO3.site}/works/${id}&${permission}`;
    const response = await axios.get(endpoint, {
      withCredentials: true,
      jar: true
    });
    let $ = cheerio.load(response.data);
    const redirect = $('div#inner').find('ul.actions').find('a').attr('href');

    if (redirect) {
      $ = cheerio.load(await AO3.handleRedirect(redirect));
    }

    let chapters = $('dl.stats').find('dd.chapters').text();
    chapters = chapters.split('/');
    chapters = parseInt(chapters[chapters.length - 1], 10);

    const text = $('#workskin').find('div#chapters').find('div.chapter').map((i, el) => {
      return {
        chapter: {
          title: $(el).find('h3.title').text(),
          text: $(el).find('div.userstuff').html()
        }
      };
    }).get();

    return {
      data: text
    };
  }

  // returns latest bookmarks
  bookmarks() { }

  // most popular and random
  // tags/:fandom/works?{query}
  static async tags(fandom, query = {}) {
    const page = has(query, 'page') ? query.page : 0;
    let endpoint = `${AO3.site}tags/${fandom}/works?${qs.stringify(query)}`;
    const response = await axios.get(endpoint);
    const $ = cheerio.load(response.data);
    const data = AO3.parseWorks($);
    const found = $('div#main').find('h2.heading').text().match(/([^of])+(?=Works)/, '')[0].trim();

    return {
      meta: {
        page,
        found,
        items: data.length
      },
      data
    };
  }

  // shows all collections
  collections() { }

  // all challenges or gift exchange challenges
  challenges() { }

  // applies collections filters
  collectionsSearch() { }

  static formatWorksFilterEndpoint(query) {
    let endpoint = `${AO3.site}works?utf8=%E2%9C%93`;
    const { tag_id } = query;
    delete query.tag_id;
    query = qs.stringify({ commit: 'Sort and Filter', work_search: query, tag_id });
    return `${endpoint}&${query}`;
  }

  static async worksFilter(tag, query = {}) {
    Object.assign(query, { tag_id: tag });
    const endpoint = AO3.formatWorksFilterEndpoint(query);

    const response = await axios.get(endpoint);
    const $ = cheerio.load(response.data);
    const page = has(query, 'page') ? query.page : 0;
    const found = $('div#main').find('h2.heading').text().match(/([^of])+(?=Works)/, '')[0].trim();

    const data = AO3.parseWorks($);
    return {
      meta: {
        page,
        found,
        items: data.length
      },
      data
    };
  }

  static formatWorksSearchEndpoint(query, page) {
    query = qs.stringify({ work_search: query });
    let endpoint = `${AO3.site}works/search`;
    if (page === 0) {
      endpoint = `${endpoint}?utf8=%E2%9C%93&${query}`;
    } else {
      endpoint = `${endpoint}?page=${page}?utf8=%E2%9C%93&${query}`;
    }
    return endpoint;
  }

  // posts to ao3 search endpoint
  // query, title, creator, revised_at, complete, single_chapter, word_count, language_id, fandom_names, rating_ids, warning_ids, category_ids, character_names, relationship_names, freeform_names, hits, kudos_count, comments_count, bookmarks_count, sort_column, sort_direction
  static async worksSearch(query) {
    const page = has(query, 'page') ? query.page : 0;
    if (page !== 0) {
      delete query.page;
    }
    const endpoint = AO3.formatWorksSearchEndpoint(query, page);
    try {
      const response = await axios.get(endpoint);
      const $ = cheerio.load(response.data);
      const found = parseInt($('#main').find('h3.heading').text(), 10);
      const data = AO3.parseWorks($);
      return {
        meta: {
          page,
          found,
          items: data.length
        },
        data
      };
    } catch (err) {
      console.error(err);
    }
  }

  static parseWorks($) {
    return $('ol.work').find('li').map(function (i, el) {
      const heading = $(this).find('h4.heading').find('a');
      const title = heading.first().text();
      const author = heading.last().text();
      if (title) {
        const id = $(this).attr('id').replace(/work_/, '');
        const fandom = $(this).find('h5').find('a').text();
        const summary = strip($(this).find('.summary').text());
        const updated = $(this).find('p.datetime').text();

        const stats = AO3.parseStats($);
        const tags = AO3.parseTags($, $(el).find('ul.tags'));
        const required_tags = AO3.parseRequiredTags($, this);

        return {
          id, title, author, fandom, updated, required_tags, tags, summary, stats
        };
      }
    }).get();
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

  static parseStats($) {
    // stats
    const statsElem = $(this).find('dl.stats');
    const language = statsElem.find('dd.language').text();
    const words = statsElem.find('dd.words').text();
    const chapters = statsElem.find('dd.chapters').text();
    const kudos = statsElem.find('dd.kudos').text();
    const bookmarks = statsElem.find('dd.bookmarks').text();
    const hits = statsElem.find('dd.hits').text();

    return {
      language, words, chapters, kudos, bookmarks, hits
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
    axios.get(AO3.site).then(response => {
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
