import axios from 'axios';
import { load } from 'cheerio';

export default async function (tturl) {
  try {
    const headers = {
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.6',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'hx-current-url': 'https://ssstik.io/id',
      'hx-request': 'true',
      'hx-target': 'target',
      'hx-trigger': '_gcaptcha_pt',
      origin: 'https://ssstik.io',
      pragma: 'no-cache',
      priority: 'u=1, i',
      referer: 'https://ssstik.io/id',
      'sec-ch-ua': '"Brave";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'sec-gpc': '1',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    };

    const body = new URLSearchParams({
      id: tturl, // This should be a variable, not a string
      locale: 'id',
      tt: 'ck14Rng3',
    }).toString();

    const response = await axios.post('https://ssstik.io/abc', body, {
      headers,
    });

    const responseBody = response.data;
    // console.log(responseBody);

    const $ = load(responseBody);
    const downloadLink = $('a.download_link.without_watermark').attr('href');
    if (downloadLink == undefined) {
      const imageUrls = [];
      const slides = $('.splide__slide').not('.splide__slide--clone');

      slides.each((i, el) => {
        const imgSrc = $(el).find('img').attr('data-splide-lazy');
        const link = $(el).find('a').attr('href');
        imageUrls.push(link);
      });
      return {
        type: 'image',
        link: imageUrls,
      };
    }

    return {
      type: 'video',
      link: downloadLink,
    };
  } catch (error) {
    return error;
  }
}
