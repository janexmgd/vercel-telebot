import ttsave from '../../utils/ttsave.js';
import chunkArr from '../../helper/chunkArr.js';
import axios from 'axios';

export default function (bot) {
  bot.on('text', async (ctx, next) => {
    const chatId = ctx.chat.id;
    const messageText = ctx.message.text;
    const matches = messageText.match(
      /(https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/\d+|https:\/\/vt\.tiktok\.com\/[\w.-]+)/g
    );
    if (matches) {
      const url = messageText;
      const data = await ttsave(url);
      console.log(data);

      if (data.type == 'video') {
        let loadingMessage = await ctx.reply(`Downloading TikTok video`);
        const videoUrl = data.link.no_watermark || data.link.watermark;
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

        for (const imageUrl of data.link) {
          arrMedia.push({ media: imageUrl }); // Menyimpan URL gambar saja
        }

        await ctx.deleteMessage(loadingId);
        const chunkArrMedia = chunkArr(arrMedia, 10);
        const caption = `Success download ${Date.now()}`;

        for (const chunk of chunkArrMedia) {
          await bot.telegram.sendMediaGroup(chatId, chunk);
        }

        await ctx.reply(caption);
      }
    }
    next();
  });
}
