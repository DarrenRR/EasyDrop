
/*
import * as cron from 'node-cron'
cron.schedule('16 18 * * *', () => {
  console.log('running a task every day at 5:03 am');
});

*/


import schedule from 'node-schedule';

const job = schedule.scheduleJob('49 * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
});