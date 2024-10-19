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

      if (data.type == 'video') {
        let loadingMessage = await ctx.reply(`Downloading tiktok video`);
        const videoUrl = data.link.no_watermark || data.link.watermark;
        const loadingId = loadingMessage.message_id;
        const response = await axios.get(videoUrl, {
          responseType: 'arraybuffer',
        });
        const videoBuffer = Buffer.from(response.data, 'binary');
        await ctx.deleteMessage(loadingId);
        const caption = `Success download ${messageText} ${Date.now()}`;
        await bot.telegram.sendVideo(
          ctx.chat.id,
          { source: videoBuffer },
          {
            caption: caption,
          }
        );
      } else {
        const loadingMessage = await ctx.reply('Downloading tiktok image');
        const loadingId = loadingMessage.message_id;
        const arrMedia = [];
        // console.log(data);

        for (const imageUrl of data.link) {
          arrMedia.push({
            media: { url: imageUrl },
            type: 'photo',
            parse_mode: 'HTML',
          });
        }
        await ctx.deleteMessage(loadingId);
        const chunkArrMedia = chunkArr(arrMedia, 10);
        const caption = `Success download ${messageText} ${Date.now()}`;
        for (const chunk of chunkArrMedia) {
          await bot.telegram.sendMediaGroup(chatId, chunk, {
            caption: caption,
          });
          ctx.reply(caption);
        }
      }
    }
    next();
  });
}
