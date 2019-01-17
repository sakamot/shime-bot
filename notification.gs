//トリガー設定用
function myFunction(){
  var today = new Date();
  var date =  today.getDate();//日付を取得
  if (new Date(lastBusinessDay().setHours(0, 0, 0)) < today && lastBusinessDay() > today){
    doPost(today);
  };
};

function doPost(today){
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var slackApp = SlackApp.create(token); //SlackApp インスタンスの取得
  var options = {
    channelId: "#general", //チャンネル名
    userName: "締め日", //投稿するbotの名前
    message: "<!here>\n今日は" + (today.getMonth()+1) + "月最終出社日！\n* 勤怠\n* 稼働\n* 交通費精算\n確認して！", //投稿するメッセージ
    icon_emoji: ":calendar:"
  };
 
  return slackApp.postMessage(options.channelId, options.message, {username: options.userName, icon_emoji: options.icon_emoji});
}

function lastBusinessDay(){
  var today = new Date();

  var lastDayOfThisMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);
  var day; // 0->日曜日

  for (var i = 0; i < 30; i++) {
    day = lastDayOfThisMonth.getDay();
    if (day == 0 || day == 6 || isHoliday(lastDayOfThisMonth)) {
      lastDayOfThisMonth = new Date(today.getFullYear(), today.getMonth()+1, -1 * i);
      continue;
    }
  }
  return lastDayOfThisMonth;
}

function isHoliday(day){
  var startDate = new Date(day.setHours(0, 0, 0, 0));
  var endDate = new Date(day.setHours(23, 59, 59));
  var cal = CalendarApp.getCalendarById("ja.japanese#holiday@group.v.calendar.google.com");
  var holidays =  cal.getEvents(startDate, endDate);
  return holidays.length != 0; // 祝日ならtrue
}
