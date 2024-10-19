export default function (bot) {
  bot.command('about', async (ctx) => {
    const userid = ctx.from.id;
    ctx.reply('this bot made by janexmgd ' + userid);
  });
}
