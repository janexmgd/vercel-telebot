import axios from 'axios';
import { load } from 'cheerio';

export default async function (tturl) {
  try {
    const response = await axios.post(
      'https://ttsave.app/download',
      {
        query: tturl,
        language_id: '2',
      },
      {
        headers: {
          'accept-language': 'en-US,en;q=0.8',
          'cache-control': 'no-cache',
          origin: 'https://ttsave.app',
          pragma: 'no-cache',
          priority: 'u=1, i',
          referer: 'https://ttsave.app/id',
          'sec-ch-ua':
            '"Brave";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'sec-gpc': '1',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        },
      }
    );

    const responseBody = response.data;
    const $ = load(responseBody);
    const inputElement = $('input#unique-id').val();
    const noWm = $('a[type="no-watermark"]').attr('href');
    const wm = $('a[type="watermark"]').attr('href');
    if (noWm) {
      return {
        name: inputElement,
        type: 'video',
        link: {
          no_watermark: noWm,
          watermark: wm,
        },
      };
    }
    let imageSlide = [];
    $('div#button-download-ready').each((index, element) => {
      $(element)
        .find('a[type="slide"]')
        .each((i, link) => {
          const href = $(link).attr('href');
          imageSlide.push(href);
        });
    });
    return {
      name: inputElement,
      type: 'image',
      link: [...imageSlide],
    };
  } catch (error) {
    return error;
  }
}
