import ttsave from '../../utils/ttsave.js';
import chunkArr from '../../helper/chunkArr.js';
import axios from 'axios';
import ssstik from '../../utils/ssstik.js';

export default function (bot) {
  bot.on('text', async (ctx, next) => {
    const chatId = ctx.chat.id;
    const messageText = ctx.message.text;
    const matches = messageText.match(
      /(https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/\d+|https:\/\/vt\.tiktok\.com\/[\w.-]+)/g
    );
    if (matches) {
      const url = messageText;
      // const data = await ttsave(url);
      const data = await ssstik(url);

      if (data.type == 'video') {
        let loadingMessage = await ctx.reply(`Downloading TikTok video`);
        const videoUrl =
          data.link.no_watermark || data.link.watermark || data.link;
        const loadingId = loadingMessage.message_id;

        const response = await axios.get(videoUrl, {
          responseType: 'arraybuffer',
        });
        const videoBuffer = Buffer.from(response.data, 'binary');
        await ctx.deleteMessage(loadingId);
        const caption = `Success download ${Date.now()}`;

        await bot.telegram.sendVideo(
          chatId,
          { source: videoBuffer },
          { caption: caption }
        );
      } else if (data.type == 'image') {
        const loadingMessage = await ctx.reply('Downloading TikTok image');
        const loadingId = loadingMessage.message_id;
        const arrMedia = [];
        console.log(data);

        for (const imageUrl of data.link) {
          arrMedia.push({
            type: 'photo',
            media: imageUrl,
          }); // Menyimpan URL gambar saja
        }

        await ctx.deleteMessage(loadingId);
        const chunkArrMedia = chunkArr(arrMedia, 10);
        const caption = `Success download ${Date.now()}`;

        for (const chunk of chunkArrMedia) {
          // await bot.telegram.sendMediaGroup()
          chunk[0].caption = caption;
          await bot.telegram.sendMediaGroup(chatId, chunk, {
            caption: caption,
          });
        }
      }
    }
    next();
  });
}
