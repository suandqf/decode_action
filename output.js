//Tue Oct 01 2024 12:38:06 GMT+0000 (Coordinated Universal Time)
//Base:https://github.com/echo094/decode-js
//Modify:https://github.com/smallfawn/decode_action
const notify = $.isNode() ? require("./sendNotify") : "",
  jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let cookiesArr = [],
  cookie = "",
  jdFruitShareArr = [],
  newShareCodes,
  allMessage = "",
  shareCodes = [],
  message = "",
  subTitle = "",
  option = {},
  isFruitFinished = false;
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach(l1II1 => {
    jdCookieNode[l1II1] && cookiesArr.push(jdCookieNode[l1II1]);
  });
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") console.log = () => {};
} else cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map(III1i1 => III1i1.cookie)].filter(IlI1 => !!IlI1);
console.log("共" + cookiesArr.length + "个京东账号\n");
const retainWater = $.isNode() ? process.env.retainWater ? process.env.retainWater : 100 : $.getdata("retainWater") ? $.getdata("retainWater") : 100;
let jdNotify = true,
  jdFruitBeanCard = false,
  fruit_Water = process.env.jd_fruit_Water === "true" ? true : false;
const urlSchema = "openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html%22%20%7D",
  common = require("./utils/Rebels_jdCommon"),
  {
    H5st
  } = require("./utils/Rebels_H");
let uuid = randomString(40),
  addressid = randomString(10, "123456789"),
  sid = randomString(32, "1234567890qwertyuiopasdfghjklzxcvbnm"),
  un_area = randomString(2, "1234567890") + "-" + randomString(4, "1234567890") + "-" + randomString(4, "1234567890") + "-" + randomString(5, "1234567890"),
  lng = "106.475" + Math.floor(Math.random() * 899 + 100),
  lat = "29.503" + Math.floor(Math.random() * 899 + 100),
  rs_wait = 1,
  waitTimes = parseInt(rs_wait) * 1000,
  lnrun = 0;
!(async () => {
  if (!cookiesArr[0]) {
    {
      $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", {
        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
      });
      return;
    }
  }
  console.log("该活动检测运行环境较为严格，若多次提示403则建议更换IP运行...");
  for (let IiIII = 0; IiIII < cookiesArr.length; IiIII++) {
    if (cookiesArr[IiIII]) {
      {
        cookie = cookiesArr[IiIII];
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
        $.index = IiIII + 1;
        $.isLogin = true;
        $.nickName = "";
        console.log("\n开始【京东账号" + $.index + "】" + ($.nickName || $.UserName) + "\n");
        if (!$.isLogin) {
          $.msg($.name, "【提示】cookie已失效", "京东账号" + $.index + " " + ($.nickName || $.UserName) + "\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action", {
            "open-url": "https://bean.m.jd.com/bean/signIndex.action"
          });
          $.isNode() && (await notify.sendNotify($.name + "cookie已失效 - " + $.UserName, "京东账号" + $.index + " " + $.UserName + "\n请重新登录获取cookie"));
          continue;
        }
        message = "";
        subTitle = "";
        option = {};
        $.UA = common.genUA($.UserName);
        $.retry = 0;
        lnrun++;
        await jdFruit();
        lnrun == 5 && (console.log("\n【访问接口次数达到5次，休息10秒.....】\n"), await $.wait(parseInt(waitTimes * 5 + 2000, 10)), lnrun = 0);
        await $.wait(parseInt(waitTimes * 1 + 2500, 10));
      }
    }
  }
  $.isNode() && allMessage && $.ctrTemp && (await notify.sendNotify("" + $.name, "" + allMessage));
})().catch(lIlliI => {
  $.log("", "❌ " + $.name + ", 失败! 原因: " + lIlliI + "!", "");
}).finally(() => {
  $.done();
});
async function jdFruit() {
  subTitle = "【京东账号" + $.index + "】" + ($.nickName || $.UserName);
  try {
    await initForFarm();
    if ($.farmInfo?.["farmUserPro"]) {
      {
        message = "【水果名称】" + $.farmInfo?.["farmUserPro"]?.["name"] + "\n";
        if ($.farmInfo?.["treeState"] === 2 || $.farmInfo?.["treeState"] === 3) {
          option["open-url"] = urlSchema;
          $.msg($.name, "", "【京东账号" + $.index + "】" + ($.nickName || $.UserName) + "\n【提醒⏰】" + $.farmInfo?.["farmUserPro"]?.["name"] + "已可领取\n请去京东APP或微信小程序查看\n点击弹窗即达", option);
          $.isNode() && (await notify.sendNotify($.name + " - 账号" + $.index + " - " + ($.nickName || $.UserName) + "水果已可领取", "【京东账号" + $.index + "】" + ($.nickName || $.UserName) + "\n【提醒⏰】" + $.farmInfo?.["farmUserPro"]?.["name"] + "已可领取\n请去京东APP或微信小程序查看"));
          return;
        } else {
          if ($.farmInfo?.["treeState"] === 1) console.log("🌳 " + $.farmInfo?.["farmUserPro"]?.["name"] + "（等级" + $.farmInfo?.["farmUserPro"]?.["prizeLevel"] + "）\n");else {
            if ($.farmInfo?.["treeState"] === 0) {
              {
                option["open-url"] = urlSchema;
                $.msg($.name, "", "【京东账号" + $.index + "】 " + ($.nickName || $.UserName) + "\n【提醒⏰】您忘了种植新的水果\n请去京东APP或微信小程序选购并种植新的水果\n点击弹窗即达", option);
                $.isNode() && (await notify.sendNotify($.name + " - 您忘了种植新的水果", "京东账号" + $.index + " " + ($.nickName || $.UserName) + "\n【提醒⏰】您忘了种植新的水果\n请去京东APP或微信小程序选购并种植新的水果"));
                return;
              }
            }
          }
        }
        await doDailyTask();
        !fruit_Water ? await doTenWater() : console.log("默认浇水，不浇水设置变量export jd_fruit_Water='true'");
        await getFirstWaterAward();
        await getTenWaterAward();
        await getWaterFriendGotAward();
        await gotNewUserTaskForFarms();
        await duck();
        !process.env.DO_TEN_WATER_AGAIN ? await doTenWaterAgain() : console.log("不执行再次浇水，攒水滴");
        await predictionFruit();
      }
    } else {
      if ($.farmInfo?.["code"] == 3) {
        {
          console.log("农场初始化异常：" + ($.farmInfo?.["code"] || "未知") + "，未登录");
          return;
        }
      } else {
        if ($.farmInfo?.["code"] == 6) console.log("农场初始化异常：" + ($.farmInfo?.["code"] || "未知") + "，活动太火爆");else $.farmInfo?.["code"] == 2 ? console.log("农场初始化异常：" + ($.farmInfo?.["code"] || "未知") + "，" + ($.farmInfo?.["echo"] || "未知")) : console.log("农场初始化异常：" + ($.farmInfo?.["code"] || "未知") + "，" + ($.farmInfo?.["message"] || "未知"));
      }
      ($.farmInfo?.["code"] == 402 || $.farmInfo?.["code"] == 403) && (await $.wait(parseInt(Math.random() * 2000 + 5000, 10)));
      $.retry < 1 && ($.retry++, console.log("等待3秒后重试，第" + $.retry + "次"), await $.wait(3000), await jdFruit());
    }
  } catch (l1ili) {
    $.logErr(l1ili);
  }
  await showMsg();
}
async function doDailyTask() {
  await taskInitForFarm();
  $.farmInfo?.["todayGotWaterGoalTask"]?.["canPop"] && (await gotWaterGoalTaskForFarm(), $.goalResult?.["code"] === "0" && console.log("【被水滴砸中】获得" + $.goalResult?.["addEnergy"] + "g💧\n"));
  if (!$.farmTask?.["gotBrowseTaskAdInit"]["f"]) {
    let iiiIii = $.farmTask?.["gotBrowseTaskAdInit"]?.["userBrowseTaskAds"] || [],
      IllI1 = 0,
      iiiIil = 0,
      lilll = 0;
    for (let l1iilI of iiiIii) {
      {
        if (l1iilI.limit <= l1iilI?.["hadFinishedTimes"]) {
          console.log(l1iilI?.["mainTitle"] + "+ ' 已完成");
          continue;
        }
        console.log("去做 “" + l1iilI?.["mainTitle"] + "” 浏览任务");
        await browseAdTaskForFarm(l1iilI?.["advertId"], 0);
        $.browseResult?.["code"] === "0" ? (await browseAdTaskForFarm(l1iilI?.["advertId"], 1), $.browseRwardResult?.["code"] === "0" ? (console.log("任务完成，获得" + $.browseRwardResult?.["amount"] + "g💧"), IllI1 += $.browseRwardResult?.["amount"], iiiIil++) : (lilll++, console.log("领取浏览广告奖励结果：" + JSON.stringify($.browseRwardResult)))) : (lilll++, console.log("浏览任务失败：" + JSON.stringify($.browseResult)));
      }
    }
    lilll > 0 ? console.log("【浏览任务】总计完成" + iiiIil + "个任务，失败" + lilll + "个，累计获得" + IllI1 + "g💧\n") : console.log("【浏览任务】总计完成" + iiiIil + "个任务，累计获得" + IllI1 + "g💧\n");
  } else console.log("【浏览任务】今天已经做过浏览广告任务\n");
  !$.farmTask?.["gotThreeMealInit"]?.["f"] ? (await gotThreeMealForFarm(), $.threeMeal?.["code"] === "0" ? console.log("【定时领水】获得" + $.threeMeal?.["amount"] + "g💧") : console.log("定时领水成功结果:  " + JSON.stringify($.threeMeal))) : console.log("当前不在定时领水时间断或者已经领过");
  !$.farmTask?.["waterFriendTaskInit"]["f"] ? $.farmTask?.["waterFriendTaskInit"]?.["waterFriendCountKey"] < $.farmTask?.["waterFriendTaskInit"]?.["waterFriendMax"] && (await doFriendsWater()) : console.log("给" + $.farmTask?.["waterFriendTaskInit"]?.["waterFriendMax"] + "个好友浇水任务已完成");
  await getTreasureBoxAwardTask();
  await clockInIn();
  await executeWaterRains();
  await getExtraAward();
  await turntableFarm();
}
async function getTreasureBoxAwardTask() {
  await taskInitForFarm();
  const iilliI = $.farmTask["treasureBoxInit-getBean"];
  if (!iilliI) {
    return;
  }
  !iilliI.f ? (console.log("正在进行任务：" + iilliI?.["taskMainTitle"]), await ddnc_getTreasureBoxAward(1), $.treasureResult?.["code"] == "0" && (await beanTaskList(), await $.wait(1000), await ddnc_getTreasureBoxAward(2), $.treasureRwardResult?.["code"] == "0" ? console.log("领取" + iilliI?.["taskMainTitle"] + "奖励：" + $.treasureRwardResult?.["waterGram"] + "g水滴") : console.log("领取" + iilliI?.["taskMainTitle"] + "奖励失败"))) : console.log(iilliI?.["taskMainTitle"] + " 已完成");
}
async function gotNewUserTaskForFarms() {
  await gotNewUserTaskForFarm();
  $.gotNewUserTaskForFarmResult?.["code"] === "0" ? console.log("领取回归礼包成功，" + $.gotNewUserTaskForFarmResult?.["addEnergy"] + " g") : console.log("领取回归礼包失败");
}
async function predictionFruit() {
  console.log("");
  await initForFarm();
  await taskInitForFarm();
  let iII11 = $.farmTask?.["firstWaterInit"]?.["totalWaterTimes"];
  message += "【今日浇水】" + iII11 + "次\n";
  message += "【剩余水滴】" + $.farmInfo?.["farmUserPro"]?.["totalEnergy"] + "g💧\n";
  message += "【水果进度】" + ($.farmInfo?.["farmUserPro"]?.["treeEnergy"] / $.farmInfo?.["farmUserPro"]?.["treeTotalEnergy"] * 100).toFixed(2) + "%，已浇水" + $.farmInfo?.["farmUserPro"]?.["treeEnergy"] / 10 + "次还需" + ($.farmInfo?.["farmUserPro"]?.["treeTotalEnergy"] - $.farmInfo?.["farmUserPro"]?.["treeEnergy"]) / 10 + "次\n";
  if ($.farmInfo?.["toFlowTimes"] > $.farmInfo?.["farmUserPro"]?.["treeEnergy"] / 10) message += "【开花进度】再浇水" + ($.farmInfo?.["toFlowTimes"] - $.farmInfo?.["farmUserPro"]?.["treeEnergy"] / 10) + "次开花\n";else $.farmInfo?.["toFruitTimes"] > $.farmInfo?.["farmUserPro"]?.["treeEnergy"] / 10 && (message += "【结果进度】再浇水" + ($.farmInfo?.["toFruitTimes"] - $.farmInfo?.["farmUserPro"]?.["treeEnergy"] / 10) + "次结果\n");
  let iilll1 = ($.farmInfo?.["farmUserPro"]?.["treeTotalEnergy"] - $.farmInfo?.["farmUserPro"]?.["treeEnergy"] - $.farmInfo?.["farmUserPro"]?.["totalEnergy"]) / 10,
    l1iI11 = Math.ceil(iilll1 / iII11);
  message += "【成熟预测】" + (l1iI11 === 1 ? "明天" : l1iI11 === 2 ? "后天" : l1iI11 + "天之后") + "(" + timeFormat(86400000 * l1iI11 + Date.now()) + "日)可兑换水果🍉";
}
async function doTenWater() {
  jdFruitBeanCard = $.getdata("jdFruitBeanCard") ? $.getdata("jdFruitBeanCard") : jdFruitBeanCard;
  $.isNode() && process.env.FRUIT_BEAN_CARD && (jdFruitBeanCard = process.env.FRUIT_BEAN_CARD);
  await myCardInfoForFarm();
  const {
    fastCard: I1ii1I,
    doubleCard: Ililli,
    beanCard: lii1,
    signCard: iIii1l
  } = $.myCardInfoRes;
  if ("" + jdFruitBeanCard === "true" && JSON.stringify($.myCardInfoRes).match("限时翻倍") && lii1 > 0) {
    console.log("您设置的是使用水滴换豆卡，且背包有水滴换豆卡" + lii1 + "张, 跳过10次浇水任务");
    return;
  }
  if ($.farmTask?.["totalWaterTaskInit"]?.["totalWaterTaskTimes"] < $.farmTask?.["totalWaterTaskInit"]?.["totalWaterTaskLimit"]) {
    console.log("\n开始做浇水十次任务");
    let I1liI1 = 0;
    isFruitFinished = false;
    for (; I1liI1 < $.farmTask?.["totalWaterTaskInit"]?.["totalWaterTaskLimit"] - $.farmTask?.["totalWaterTaskInit"]?.["totalWaterTaskTimes"]; I1liI1++) {
      console.log("进行第" + (I1liI1 + 1) + "次浇水");
      await waterGoodForFarm();
      await $.wait(parseInt(waitTimes * 1 + 1000, 10));
      if ($.waterResult?.["code"] === "0") {
        console.log("浇水成功，剩余水滴" + $.waterResult?.["totalEnergy"] + "g");
        if ($.waterResult?.["finished"]) {
          isFruitFinished = true;
          break;
        } else {
          if ($.waterResult?.["totalEnergy"] < 10) {
            {
              console.log("水滴不够，结束浇水");
              break;
            }
          }
          await gotStageAward();
        }
      } else {
        console.log("浇水出现异常，不再继续浇水 " + JSON.stringify($.waterResult));
        break;
      }
    }
    isFruitFinished && (option["open-url"] = urlSchema, $.msg($.name, "", "【京东账号" + $.index + "】" + ($.nickName || $.UserName) + "\n【提醒⏰】" + $.farmInfo?.["farmUserPro"]?.["name"] + "已可领取\n请去京东APP或微信小程序查看\n点击弹窗即达", option), $.isNode() && (await notify.sendNotify($.name + " - 账号" + $.index + " - " + ($.nickName || $.UserName) + "水果已可领取", "京东账号" + $.index + " " + ($.nickName || $.UserName) + "\n" + $.farmInfo?.["farmUserPro"]?.["name"] + "已可领取")));
  } else console.log("今日已完成10次浇水任务");
}
async function getFirstWaterAward() {
  await taskInitForFarm();
  if (!$.farmTask?.["firstWaterInit"]["f"] && $.farmTask?.["firstWaterInit"]?.["totalWaterTimes"] > 0) {
    await firstWaterTaskForFarm();
    if ($.firstWaterReward?.["code"] === "0") console.log("获得首次浇水奖励" + $.firstWaterReward?.["amount"] + "g💧");else {
      console.log("领取首次浇水奖励结果:  " + JSON.stringify($.firstWaterReward));
    }
  } else console.log("首次浇水奖励已领取");
}
async function getTenWaterAward() {
  if (!$.farmTask?.["totalWaterTaskInit"]?.["f"] && $.farmTask?.["totalWaterTaskInit"]?.["totalWaterTaskTimes"] >= $.farmTask?.["totalWaterTaskInit"]?.["totalWaterTaskLimit"]) await totalWaterTaskForFarm(), $.totalWaterReward?.["code"] === "0" ? console.log("获得十次浇水奖励" + $.totalWaterReward?.["totalWaterTaskEnergy"] + "g💧") : console.log("领取10次浇水奖励结果:  " + JSON.stringify($.totalWaterReward));else $.farmTask?.["totalWaterTaskInit"]?.["totalWaterTaskTimes"] < $.farmTask?.["totalWaterTaskInit"]?.["totalWaterTaskLimit"] && console.log("【十次浇水奖励】任务未完成，今日浇水" + $.farmTask?.["totalWaterTaskInit"]?.["totalWaterTaskTimes"] + "次\n");
}
async function doTenWaterAgain() {
  await initForFarm();
  let IIil1I = $.farmInfo?.["farmUserPro"]?.["totalEnergy"] || 0;
  console.log("当前水滴" + IIil1I + "g💧");
  await myCardInfoForFarm();
  const {
    fastCard: II1i1l,
    doubleCard: II1i1i,
    beanCard: Il1iiI,
    signCard: iIil1
  } = $.myCardInfoRes;
  console.log("当前背包道具：\n快速浇水卡 " + (II1i1l === -1 ? "未解锁" : II1i1l + "张") + "\n水滴翻倍卡 " + (II1i1i === -1 ? "未解锁" : II1i1i + "张") + "\n水滴换京豆卡 " + (Il1iiI === -1 ? "未解锁" : Il1iiI + "张") + "\n加签卡 " + (iIil1 === -1 ? "未解锁" : iIil1 + "张") + "\n");
  if (IIil1I >= 100 && II1i1i > 0) {
    {
      for (let iI11li = 0; iI11li < new Array(II1i1i).fill("").length; iI11li++) {
        await userMyCardForFarm("doubleCard");
        console.log("使用翻倍水滴卡结果：" + JSON.stringify($.userMyCardRes));
      }
      await initForFarm();
      IIil1I = $.farmInfo?.["farmUserPro"]?.["totalEnergy"];
    }
  }
  if (iIil1 > 0) {
    {
      for (let lIi11 = 0; lIi11 < new Array(iIil1).fill("").length; lIi11++) {
        {
          await userMyCardForFarm("signCard");
          if ($.userMyCardRes?.["code"] === "20") {
            console.log("使用加签卡结果：使用已达上限");
            break;
          } else console.log("使用加签卡结果：" + JSON.stringify($.userMyCardRes));
        }
      }
      console.log("");
      await initForFarm();
      IIil1I = $.farmInfo?.["farmUserPro"]?.["totalEnergy"];
    }
  }
  jdFruitBeanCard = $.getdata("jdFruitBeanCard") ? $.getdata("jdFruitBeanCard") : jdFruitBeanCard;
  $.isNode() && process.env.FRUIT_BEAN_CARD && (jdFruitBeanCard = process.env.FRUIT_BEAN_CARD);
  if ("" + jdFruitBeanCard === "true" && JSON.stringify($.myCardInfoRes).match("限时翻倍")) {
    console.log("\n您设置的是水滴换豆功能，现在为您换豆");
    if (IIil1I >= 100 && $.myCardInfoRes?.["beanCard"] > 0) {
      await userMyCardForFarm("beanCard");
      console.log("使用水滴换豆卡结果：" + JSON.stringify($.userMyCardRes));
      if ($.userMyCardRes.code === "0") {
        {
          message += "【水滴换豆卡】获得" + $.userMyCardRes?.["beanCount"] + "个京豆\n";
          return;
        }
      }
    } else console.log("您目前水滴：" + IIil1I + "g,水滴换豆卡" + $.myCardInfoRes?.["beanCard"] + "张,暂不满足水滴换豆的条件,为您继续浇水");
  }
  if (IIil1I < retainWater) {
    console.log("保留水滴不足,停止继续浇水");
    return;
  }
  let l1IllI = IIil1I - retainWater;
  if (l1IllI >= $.farmInfo?.["farmUserPro"]?.["treeTotalEnergy"] - $.farmInfo?.["farmUserPro"]?.["treeEnergy"]) {
    isFruitFinished = false;
    for (let iIliIl = 0; iIliIl < ($.farmInfo?.["farmUserPro"]?.["treeTotalEnergy"] - $.farmInfo?.["farmUserPro"]?.["treeEnergy"]) / 10; iIliIl++) {
      await waterGoodForFarm();
      if ($.waterResult?.["code"] === "0") {
        console.log("浇水10g成功，剩余" + $.waterResult?.["totalEnergy"] + "g");
        if ($.waterResult?.["finished"]) {
          {
            isFruitFinished = true;
            break;
          }
        }
      } else {
        {
          console.log("浇水出现失败异常,跳出不在继续浇水");
          break;
        }
      }
    }
    isFruitFinished && (option["open-url"] = urlSchema, $.msg($.name, "", "【京东账号" + $.index + "】" + ($.nickName || $.UserName) + "\n【提醒⏰】" + $.farmInfo?.["farmUserPro"]?.["name"] + "已可领取\n请去京东APP或微信小程序查看\n点击弹窗即达", option), $.done(), $.isNode() && (await notify.sendNotify($.name + " - 账号" + $.index + " - " + ($.nickName || $.UserName) + "水果已可领取", "京东账号" + $.index + " " + ($.nickName || $.UserName) + "\n" + $.farmInfo?.["farmUserPro"]?.["name"] + "已可领取")));
  } else {
    if (l1IllI >= 10) {
      console.log("目前剩余水滴" + IIil1I + "g，可继续浇水");
      isFruitFinished = false;
      for (let Ii111I = 0; Ii111I < parseInt(l1IllI / 10); Ii111I++) {
        await waterGoodForFarm();
        if ($.waterResult?.["code"] === "0") {
          console.log("浇水10g成功，剩余" + $.waterResult?.["totalEnergy"] + "g");
          if ($.waterResult?.["finished"]) {
            isFruitFinished = true;
            break;
          } else {
            await gotStageAward();
          }
        } else {
          console.log("浇水异常：" + JSON.stringify($.waterResult || ""));
          break;
        }
      }
      isFruitFinished && (option["open-url"] = urlSchema, $.msg($.name, "", "【京东账号" + $.index + "】" + ($.nickName || $.UserName) + "\n【提醒⏰】" + $.farmInfo?.["farmUserPro"]?.["name"] + "已可领取\n请去京东APP或微信小程序查看\n点击弹窗即达", option), $.done(), $.isNode() && (await notify.sendNotify($.name + " - 账号" + $.index + " - " + ($.nickName || $.UserName) + "水果已可领取", "京东账号" + $.index + " " + ($.nickName || $.UserName) + "\n" + $.farmInfo?.["farmUserPro"]?.["name"] + "已可领取")));
    } else console.log("目前剩余水滴" + IIil1I + "g，不再继续浇水以满足次日完成“十次浇水得水滴”任务");
  }
}
function gotStageAward() {
  return new Promise(async I1IIII => {
    {
      if ($.waterResult?.["waterStatus"] === 0 && $.waterResult?.["treeEnergy"] === 10) await gotStageAwardForFarm("1"), $.gotStageAwardForFarmRes?.["code"] === "0" ? console.log("【果树发芽了】奖励" + $.gotStageAwardForFarmRes?.["addEnergy"]) : console.log("浇水阶段奖励1领取结果 " + JSON.stringify($.gotStageAwardForFarmRes));else {
        if ($.waterResult?.["waterStatus"] === 1) await gotStageAwardForFarm("2"), $.gotStageAwardForFarmRes?.["code"] === "0" ? console.log("【果树开花了】奖励" + $.gotStageAwardForFarmRes?.["addEnergy"] + "g💧") : console.log("浇水阶段奖励2领取结果 " + JSON.stringify($.gotStageAwardForFarmRes));else {
          if ($.waterResult?.["waterStatus"] === 2) {
            await gotStageAwardForFarm("3");
            if ($.gotStageAwardForFarmRes?.["code"] === "0") {
              console.log("【果树结果了】奖励" + $.gotStageAwardForFarmRes?.["addEnergy"] + "g💧");
            } else console.log("浇水阶段奖励3领取结果 " + JSON.stringify($.gotStageAwardForFarmRes));
          }
        }
      }
      I1IIII();
    }
  });
}
async function turntableFarm() {
  await initForTurntableFarm();
  if ($.initForTurntableFarmRes?.["code"] === "0") {
    {
      let {
        timingIntervalHours: IlIiII,
        timingLastSysTime: iIliI,
        sysTime: i1IlII,
        timingGotStatus: ilIii1,
        remainLotteryTimes: ll1III,
        turntableInfos: ll1II1
      } = $.initForTurntableFarmRes;
      console.log("\n开始进行天天抽奖任务：");
      if (!ilIii1) {
        {
          if (i1IlII > iIliI + 3600 * IlIiII * 1000) await timingAwardForTurntableFarm(), $.timingAwardRes?.["code"] === "0" ? console.log("领取定时奖励成功") : console.log("领取定时奖励结果：" + JSON.stringify($.timingAwardRes)), await initForTurntableFarm(), ll1III = $.initForTurntableFarmRes?.["remainLotteryTimes"];else {}
        }
      } else {}
      if ($.initForTurntableFarmRes?.["turntableBrowserAds"] && $.initForTurntableFarmRes?.["turntableBrowserAds"]["length"] > 0) for (let IIlIii = 0; IIlIii < $.initForTurntableFarmRes?.["turntableBrowserAds"]["length"]; IIlIii++) {
        if (!$.initForTurntableFarmRes?.["turntableBrowserAds"][IIlIii]["status"]) await browserForTurntableFarm(1, $.initForTurntableFarmRes?.["turntableBrowserAds"][IIlIii]["adId"]), $.browserForTurntableFarmRes?.["code"] === "0" && $.browserForTurntableFarmRes?.["status"] && (console.log("第" + (IIlIii + 1) + "个逛会场任务完成"), await browserForTurntableFarm(2, $.initForTurntableFarmRes?.["turntableBrowserAds"][IIlIii]["adId"]), $.browserForTurntableFarmRes?.["code"] === "0" && (console.log("领取水滴奖励成功"), await initForTurntableFarm(), ll1III = $.initForTurntableFarmRes?.["remainLotteryTimes"]));else {
          console.log("已完成第" + (IIlIii + 1) + "个浏览会场任务");
        }
      }
      if (ll1III > 0) {
        {
          let iIlll1 = "";
          for (let ilIiiI = 0; ilIiiI < new Array(ll1III).fill("").length; ilIiiI++) {
            await lotteryForTurntableFarm();
            if ($.lotteryRes?.["code"] === "0") {
              {
                if ($.lotteryRes.type !== "thanks") {
                  {
                    ll1II1.map(IIlIil => {
                      {
                        if (IIlIil.type === $.lotteryRes?.["type"]) {
                          if ($.lotteryRes.type.match(/bean/g) && $.lotteryRes.type.match(/bean/g)[0] === "bean") iIlll1 += IIlIil.name + "个，";else $.lotteryRes.type.match(/water/g) && $.lotteryRes.type.match(/water/g)[0] === "water" ? iIlll1 += IIlIil.name + "，" : iIlll1 += IIlIil.name + "，";
                        }
                      }
                    });
                    if ($.lotteryRes?.["remainLotteryTimes"] === 0) {
                      break;
                    }
                  }
                }
              }
            } else console.log("第" + (ilIiiI + 1) + "次抽奖结果 " + JSON.stringify($.lotteryRes || ""));
          }
          iIlll1 && console.log("抽奖获得：" + iIlll1.substr(0, iIlll1.length - 1));
        }
      } else console.log("天天抽奖：抽奖机会为0次");
    }
  } else console.log("初始化天天抽奖得好礼失败");
}
async function getExtraAward() {
  await farmAssistInit();
  if ($.farmAssistResult?.["code"] === "0") {
    {
      if ($.farmAssistResult?.["assistFriendList"] && $.farmAssistResult?.["assistFriendList"]?.["length"] >= 1) {
        if ($.farmAssistResult?.["status"] === 2) {
          {
            let Ili1 = 0;
            for (let ii11iI of Object.keys($.farmAssistResult.assistStageList)) {
              {
                let I1IIl = $.farmAssistResult?.["assistStageList"][ii11iI];
                I1IIl.stageStaus === 2 && (await receiveStageEnergy(), $.receiveStageEnergy.code === "0" && (console.log("已成功领取第" + (ii11iI + 1) + "阶段好友助力奖励：" + $.receiveStageEnergy?.["amount"] + "g💧"), Ili1 += $.receiveStageEnergy?.["amount"]));
              }
            }
            message += "【额外奖励】领取成功，获得" + Ili1 + "g💧\n";
          }
        } else $.farmAssistResult?.["status"] === 3 && (console.log("已经领取过4好友助力额外奖励"), message += "【额外奖励】领取失败，原因：已被领取过\n");
      } else console.log("助力好友未达到1个"), message += "【额外奖励】领取失败，原因：给您助力的人未达1个\n";
      if ($.farmAssistResult?.["assistFriendList"] && $.farmAssistResult?.["assistFriendList"]["length"] > 0) {
        {
          let I11llI = "";
          $.farmAssistResult?.["assistFriendList"]["map"]((I1IIi, iiii1I) => {
            iiii1I === $.farmAssistResult?.["assistFriendList"]["length"] - 1 ? I11llI += I1IIi.nickName || "匿名用户" : I11llI += (I1IIi.nickName || "匿名用户") + ",";
            let lIlIi1 = new Date(I1IIi.time),
              l1II1l = lIlIi1.getFullYear() + "-" + (lIlIi1.getMonth() + 1) + "-" + lIlIi1.getDate() + " " + lIlIi1.getHours() + ":" + lIlIi1.getMinutes() + ":" + lIlIi1.getMinutes();
            console.log("京东昵称【" + (I1IIi.nickName || "匿名用户") + "】 在 " + l1II1l + " 给您助过力");
          });
          message += "【助力您的好友】" + I11llI + "\n";
        }
      }
    }
  } else {
    await masterHelpTaskInitForFarm();
    if ($.masterHelpResult?.["code"] === "0") {
      $.masterHelpResult?.["masterHelpPeoples"] && $.masterHelpResult?.["masterHelpPeoples"]["length"] >= 5 ? !$.masterHelpResult?.["masterGotFinal"] ? (await masterGotFinishedTaskForFarm(), $.masterGotFinished?.["code"] === "0" && (console.log("已成功领取好友助力奖励：【" + $.masterGotFinished?.["amount"] + "】g水"), message += "【额外奖励】" + $.masterGotFinished?.["amount"] + "g水领取成功\n")) : (console.log("已经领取过5好友助力额外奖励"), message += "【额外奖励】已被领取过\n") : (console.log("助力好友未达到5个"), message += "【额外奖励】领取失败,原因：给您助力的人未达5个\n");
      if ($.masterHelpResult?.["masterHelpPeoples"] && $.masterHelpResult?.["masterHelpPeoples"]["length"] > 0) {
        let ii11ii = "";
        $.masterHelpResult?.["masterHelpPeoples"]["map"]((ll1l11, iIl1I1) => {
          {
            iIl1I1 === $.masterHelpResult?.["masterHelpPeoples"]["length"] - 1 ? ii11ii += ll1l11.nickName || "匿名用户" : ii11ii += (ll1l11.nickName || "匿名用户") + ",";
            let il1lI1 = new Date(ll1l11.time),
              i111li = il1lI1.getFullYear() + "-" + (il1lI1.getMonth() + 1) + "-" + il1lI1.getDate() + " " + il1lI1.getHours() + ":" + il1lI1.getMinutes() + ":" + il1lI1.getMinutes();
            console.log("\n京东昵称【" + (ll1l11.nickName || "匿名用户") + "】 在 " + i111li + " 给您助过力\n");
          }
        });
        message += "【助力您的好友】" + ii11ii + "\n";
      }
      console.log("领取额外奖励水滴结束\n");
    }
  }
}
async function executeWaterRains() {
  let i111ll = !$.farmTask?.["waterRainInit"]?.["f"];
  if (i111ll) $.farmTask?.["waterRainInit"]?.["lastTime"] && Date.now() < $.farmTask?.["waterRainInit"]?.["lastTime"] + 10800000 && (i111ll = false, console.log("第" + ($.farmTask?.["waterRainInit"]?.["winTimes"] + 1) + "次水滴雨未到时间，请" + new Date($.farmTask?.["waterRainInit"]?.["lastTime"] + 10800000).toLocaleTimeString() + "再试\n")), i111ll && (await waterRainForFarm(), $.waterRain.code === "0" && console.log("完成水滴雨任务，获得" + $.waterRain?.["addEnergy"] + "g💧"));else {}
}
async function clockInIn() {
  await clockInInitForFarm();
  if ($.clockInInit.code === "0") {
    !$.clockInInit.todaySigned && (await clockInForFarm(), $.clockInForFarmRes?.["code"] === "0" ? (console.log("每日签到任务完成，获得" + $.clockInForFarmRes?.["amount"] + "g💧"), $.clockInForFarmRes?.["signDay"] === 7 && (await gotClockInGift(), $.gotClockInGiftRes?.["code"] === "0" && console.log("领取惊喜礼包成功，获得" + $.gotClockInGiftRes?.["amount"] + "g💧\n"))) : console.log("签到结果 " + JSON.stringify($.clockInForFarmRes)));
    $.clockInInit?.["todaySigned"] && $.clockInInit?.["totalSigned"] === 7 && (await gotClockInGift(), $.gotClockInGiftRes?.["code"] === "0" && console.log("领取惊喜礼包成功，获得" + $.gotClockInGiftRes?.["amount"] + "g💧\n"));
    if ($.clockInInit?.["themes"] && $.clockInInit?.["themes"]["length"] > 0) {
      for (let iI1iIl of $.clockInInit?.["themes"]) {
        !iI1iIl?.["hadGot"] && (await clockInFollowForFarm(iI1iIl?.["id"], "theme", "1"), $.themeStep1?.["code"] === "0" && (await clockInFollowForFarm(iI1iIl.id, "theme", "2"), $.themeStep2.code === "0" && console.log("限时关注任务完成，获得" + $.themeStep2?.["amount"] + "g💧")));
      }
    }
    if ($.clockInInit?.["venderCoupons"] && $.clockInInit?.["venderCoupons"]["length"] > 0) for (let iI1Ii of $.clockInInit?.["venderCoupons"]) {
      !iI1Ii.hadGot && (await clockInFollowForFarm(iI1Ii.id, "venderCoupon", "1"), $.venderCouponStep1?.["code"] === "0" && (await clockInFollowForFarm(iI1Ii.id, "venderCoupon", "2"), $.venderCouponStep2?.["code"] === "0" && console.log("完成限时领券任务，获得" + $.venderCouponStep2?.["amount"] + "g💧")));
    }
  }
}
async function doFriendsWater() {
  await friendListInitForFarm();
  await taskInitForFarm();
  const {
    waterFriendCountKey: iI1Il,
    waterFriendMax: i111il
  } = $.farmTask?.["waterFriendTaskInit"];
  iI1Il > 0 && console.log("今日已给" + iI1Il + "个好友浇水");
  if (iI1Il < i111il) {
    let l1Iiii = [];
    if ($.friendList?.["friends"] && $.friendList?.["friends"]["length"] > 0) {
      $.friendList.friends.map((IIiII, iiiI) => {
        IIiII.friendState === 1 && l1Iiii.length < i111il - iI1Il && l1Iiii.push(IIiII.shareCode);
      });
      let l1Iiil = 0,
        I1li1I = "";
      for (let II1iIl = 0; II1iIl < l1Iiii.length; II1iIl++) {
        {
          await waterFriendForFarm(l1Iiii[II1iIl]);
          if ($.waterFriendForFarmRes?.["code"] === "0") {
            l1Iiil++;
            if ($.waterFriendForFarmRes?.["cardInfo"]) {
              if ($.waterFriendForFarmRes?.["cardInfo"]?.["type"] === "beanCard") {
                I1li1I += "水滴换豆卡,";
              } else {
                if ($.waterFriendForFarmRes?.["cardInfo"]?.["type"] === "fastCard") I1li1I += "快速浇水卡,";else {
                  if ($.waterFriendForFarmRes?.["cardInfo"]?.["type"] === "doubleCard") I1li1I += "水滴翻倍卡,";else $.waterFriendForFarmRes?.["cardInfo"]?.["type"] === "signCard" && (I1li1I += "加签卡,");
                }
              }
            }
          } else $.waterFriendForFarmRes?.["code"] === "11" && console.log("水滴不够,跳出浇水");
        }
      }
      I1li1I && I1li1I.length > 0 ? console.log("【给好友浇水】已为" + l1Iiil + "个朋友浇水，获得奖励：" + I1li1I.substr(0, I1li1I.length - 1) + "\n") : console.log("【给好友浇水】已为" + l1Iiil + "个朋友浇水\n");
    } else console.log("您的好友列表暂无好友,快去邀请您的好友吧!");
  } else console.log("今日已为好友浇水量已达" + i111il + "个");
}
async function getWaterFriendGotAward() {
  await taskInitForFarm();
  const {
    waterFriendCountKey: II1iI1,
    waterFriendMax: iI1i1,
    waterFriendSendWater: il11Il,
    waterFriendGotAward: IIiI1
  } = $.farmTask.waterFriendTaskInit;
  if (II1iI1 >= iI1i1) {
    {
      if (!IIiI1) await waterFriendGotAwardForFarm(), $.waterFriendGotAwardRes?.["code"] === "0" ? console.log("获得给好友浇水奖励" + $.waterFriendGotAwardRes?.["addWater"] + "g💧\n") : console.log("领取给" + iI1i1 + "个好友浇水后的奖励水滴：" + JSON.stringify($.waterFriendGotAwardRes));else {
        console.log("给好友浇水的" + il11Il + "g水滴奖励已领取\n");
      }
    }
  } else console.log("暂未给" + iI1i1 + "个好友浇水\n");
}
async function duck() {
  for (let i1ii1l = 0; i1ii1l < 10; i1ii1l++) {
    {
      await getFullCollectionReward();
      if ($.duckRes?.["code"] === "0") {
        {
          if (!$.duckRes?.["hasLimit"]) console.log("小鸭子游戏:" + $.duckRes?.["title"]);else {
            {
              console.log("" + $.duckRes?.["title"]);
              break;
            }
          }
        }
      } else {
        if ($.duckRes?.["code"] === "10") {
          {
            console.log("小鸭子游戏达到上限");
            break;
          }
        }
      }
    }
  }
}
async function collect() {
  try {
    {
      await initForFarm();
      if ($.farmInfo.farmUserPro) console.log("\n【京东账号" + $.index + "（" + $.UserName + "）的" + $.name + "好友互助码】" + $.farmInfo?.["farmUserPro"]?.["shareCode"] + "\n"), jdFruitShareArr.push($.farmInfo.farmUserPro.shareCode);else {}
    }
  } catch (iiIIlI) {
    $.logErr(iiIIlI);
  }
}
function beanTaskList() {
  return new Promise(iill => {
    const llIi1I = {
      "url": "https://api.m.jd.com/client.action?functionId=beanTaskList",
      "body": "body=%7B%22viewChannel%22%3A%22AppHome%22%7D&build=167853&client=apple&clientVersion=10.2.0&d_brand=apple&d_model=iPhone11%2C8&ef=1&eid=eidIf12a8121eas2urxgGc%2BzS5%2BUYGu1Nbed7bq8YY%2BgPd0Q0t%2BiviZdQsxnK/HTA7AxZzZBrtu1ulwEviYSV3QUuw2XHHC%2BPFHdNYx1A/3Zt8xYR%2Bd3&ep=%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22screen%22%3A%22ENS4AtO3EJS%3D%22%2C%22osVersion%22%3A%22CJGkDy4n%22%2C%22openudid%22%3A%22ENq3CzTwENGmYtc3ENSnYtC0DWTwCNdwZNcnZtYmEWU2ZwYnCwY0Cm%3D%3D%22%2C%22area%22%3A%22CJvpCJYmCV81CNS1EP82Ctq1EK%3D%3D%22%2C%22uuid%22%3A%22aQf1ZRdxb2r4ovZ1EJZhcxYlVNZSZz09%22%7D%2C%22ts%22%3A1637625634%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D&ext=%7B%22prstate%22%3A%220%22%7D&isBackground=N&joycious=117&lang=zh_CN&networkType=4g&networklibtype=JDNetworkBaseAF&partner=apple&rfs=0000&scope=11&sign=778b3d3d83e0d3f45508a958f306abda&st=1637627411874&sv=101&uemps=0-0&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJ1DpIH6AlcMry0eQsMwEN/GgP2FpcEJvoNVODK8ho6G6xfFEYSmOOdwauVOUqIQFPdxhcdWdM05U%2BMN5h6umteQ78SpJGXOymjKiTiGjvSOiTpoqO8k%2BT6stsfe0WS9QQ41HfWeVF6cdpDTzsmufz0XDdJ6CcltPUazK5UqRSuo0UyDMBmw/oWg%3D%3D",
      "headers": {
        "Cookie": cookie,
        "Host": "api.m.jd.com",
        "Accept": "*/*",
        "Connection": "keep-alive",
        "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
        "Accept-Language": "zh-Hans-CN;q=1,en-CN;q=0.9",
        "Accept-Encoding": "gzip,deflate,br",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    $.post(llIi1I, (I11lil, Ili1li, lIlIil) => {
      try {
        I11lil ? (console.log("" + JSON.stringify(I11lil)), console.log($.name + " beanTaskList API请求失败，请检查网路重试")) : lIlIil = $.toObj(lIlIil);
      } catch (Ili1ll) {
        $.logErr(Ili1ll, Ili1li);
      } finally {
        iill();
      }
    });
  });
}
async function getFullCollectionReward() {
  $.duckRes = await request("totalWaterTaskForFarm", {
    "type": 2,
    "version": 6,
    "channel": 2
  });
}
async function totalWaterTaskForFarm() {
  $.totalWaterReward = await request("totalWaterTaskForFarm");
}
async function firstWaterTaskForFarm() {
  $.firstWaterReward = await request("firstWaterTaskForFarm");
}
async function waterFriendGotAwardForFarm() {
  $.waterFriendGotAwardRes = await request("waterFriendGotAwardForFarm", {
    "version": 4,
    "channel": 1
  });
}
async function myCardInfoForFarm() {
  $.myCardInfoRes = await request("myCardInfoForFarm", {
    "version": 5,
    "channel": 1
  });
}
async function userMyCardForFarm(IiII1l) {
  const Ii11Ii = arguments.callee.name.toString();
  $.userMyCardRes = await request("userMyCardForFarm", {
    "cardType": IiII1l
  });
}
async function gotStageAwardForFarm(I1li1l) {
  $.gotStageAwardForFarmRes = await request("gotStageAwardForFarm", {
    "type": I1li1l
  });
}
async function waterGoodForFarm() {
  await $.wait(parseInt(waitTimes * 1 + 1000, 10));
  $.waterResult = await request("waterGoodForFarm", {
    "type": "",
    "version": 25,
    "channel": 1,
    "babelChannel": 0,
    "lat": lat,
    "lng": lng
  });
}
async function initForTurntableFarm() {
  $.initForTurntableFarmRes = await request("initForTurntableFarm", {
    "version": 4,
    "channel": 1
  });
}
async function lotteryForTurntableFarm() {
  await $.wait(parseInt(waitTimes * 1 + 1000, 10));
  $.lotteryRes = await request("lotteryForTurntableFarm", {
    "type": 1,
    "version": 4,
    "channel": 1
  });
}
async function timingAwardForTurntableFarm() {
  $.timingAwardRes = await request("timingAwardForTurntableFarm", {
    "version": 4,
    "channel": 1
  });
}
async function browserForTurntableFarm(liIiiI, l11Iii) {
  if (liIiiI === 1) {}
  if (liIiiI === 2) {}
  const IIllil = {
    "type": liIiiI,
    "adId": l11Iii,
    "version": 4,
    "channel": 1
  };
  $.browserForTurntableFarmRes = await request("browserForTurntableFarm", IIllil);
}
async function browserForTurntableFarm2(iIlIlI) {
  const ilIili = {
    "type": 2,
    "adId": iIlIlI,
    "version": 4,
    "channel": 1
  };
  $.browserForTurntableFarm2Res = await request("browserForTurntableFarm", ilIili);
}
async function lotteryMasterHelp() {
  $.lotteryMasterHelpRes = await request("initForFarm", {
    "imageUrl": "",
    "nickName": "",
    "shareCode": arguments[0] + "-3",
    "babelChannel": "3",
    "version": 4,
    "channel": 1
  });
}
async function masterGotFinishedTaskForFarm() {
  $.masterGotFinished = await request("masterGotFinishedTaskForFarm");
}
async function masterHelpTaskInitForFarm() {
  $.masterHelpResult = await request("masterHelpTaskInitForFarm");
}
async function farmAssistInit() {
  $.farmAssistResult = await request("farmAssistInit", {
    "version": 14,
    "channel": 1,
    "babelChannel": "120"
  });
}
async function receiveStageEnergy() {
  $.receiveStageEnergy = await request("receiveStageEnergy", {
    "version": 14,
    "channel": 1,
    "babelChannel": "120"
  });
}
async function inviteFriend() {
  $.inviteFriendRes = await request("initForFarm", {
    "imageUrl": "",
    "nickName": "",
    "shareCode": arguments[0] + "-inviteFriend",
    "version": 4,
    "channel": 2
  });
}
async function masterHelp() {
  $.helpResult = await request("initForFarm", {
    "imageUrl": "",
    "nickName": "",
    "shareCode": arguments[0],
    "babelChannel": "3",
    "version": 2,
    "channel": 1
  });
}
async function waterRainForFarm() {
  const lIl1i = {
    "type": 1,
    "hongBaoTimes": 100,
    "version": 3
  };
  $.waterRain = await request("waterRainForFarm", lIl1i);
}
async function clockInInitForFarm() {
  $.clockInInit = await request("clockInInitForFarm");
}
async function clockInForFarm() {
  $.clockInForFarmRes = await request("clockInForFarm", {
    "type": 1
  });
}
async function clockInFollowForFarm(IIiIll, iIi, iI1i) {
  let l11Ill = {
    "id": IIiIll,
    "type": iIi,
    "step": iI1i
  };
  if (iIi === "theme") {
    {
      if (iI1i === "1") $.themeStep1 = await request("clockInFollowForFarm", l11Ill);else iI1i === "2" && ($.themeStep2 = await request("clockInFollowForFarm", l11Ill));
    }
  } else {
    if (iIi === "venderCoupon") {
      {
        if (iI1i === "1") $.venderCouponStep1 = await request("clockInFollowForFarm", l11Ill);else iI1i === "2" && ($.venderCouponStep2 = await request("clockInFollowForFarm", l11Ill));
      }
    }
  }
}
async function gotClockInGift() {
  $.gotClockInGiftRes = await request("gotClockInGift", {
    "type": 2
  });
}
async function gotThreeMealForFarm() {
  $.threeMeal = await request("gotThreeMealForFarm");
}
async function browseAdTaskForFarm(lli1ll, IIiIii) {
  if (IIiIii === 0) $.browseResult = await request("browseAdTaskForFarm", {
    "advertId": lli1ll,
    "type": IIiIii
  });else IIiIii === 1 && ($.browseRwardResult = await request("browseAdTaskForFarm", {
    "advertId": lli1ll,
    "type": IIiIii
  }));
}
async function ddnc_getTreasureBoxAward(Ii1lil) {
  const lliI1 = {
    "type": Ii1lil,
    "babelChannel": "45",
    "line": "getBean",
    "version": 18,
    "channel": 1
  };
  if (Ii1lil === 1) $.treasureResult = await request("ddnc_getTreasureBoxAward", lliI1);else Ii1lil === 2 && ($.treasureRwardResult = await request("ddnc_getTreasureBoxAward", lliI1));
}
async function gotWaterGoalTaskForFarm() {
  $.goalResult = await request("gotWaterGoalTaskForFarm", {
    "type": 3
  });
}
async function signForFarm() {
  $.signResult = await request("signForFarm");
}
async function gotNewUserTaskForFarm() {
  const Ii1liI = {
    "babelChannel": "10",
    "version": 24,
    "lat": lat,
    "lng": lng
  };
  $.gotNewUserTaskForFarmResult = await request("gotNewUserTaskForFarm", Ii1liI);
}
async function initForFarm() {
  $.farmInfo = await request("initForFarm", {
    "babelChannel": "522",
    "sid": "",
    "un_area": un_area,
    "version": 25,
    "channel": 1,
    "lat": lat,
    "lng": lng
  });
}
async function taskInitForFarm() {
  $.farmTask = await request("taskInitForFarm", {
    "version": 18,
    "channel": 1,
    "babelChannel": "121"
  });
}
async function friendListInitForFarm() {
  $.friendList = await request("friendListInitForFarm", {
    "version": 18,
    "channel": 1,
    "babelChannel": "45"
  });
}
async function awardInviteFriendForFarm() {
  $.awardInviteFriendRes = await request("awardInviteFriendForFarm");
}
async function waterFriendForFarm(il11II) {
  const l11lI = {
    "shareCode": il11II,
    "version": 18,
    "channel": 1,
    "babelChannel": "121"
  };
  $.waterFriendForFarmRes = await request("waterFriendForFarm", l11lI);
}
async function showMsg() {
  if ($.isNode() && process.env.FRUIT_NOTIFY_CONTROL) {
    $.ctrTemp = "" + process.env.FRUIT_NOTIFY_CONTROL === "false";
  } else $.getdata("jdFruitNotify") ? $.ctrTemp = $.getdata("jdFruitNotify") === "false" : $.ctrTemp = "" + jdNotify === "false";
  if ($.ctrTemp) $.msg($.name, subTitle, message, option), $.isNode() && (allMessage += subTitle + "\n" + message + ($.index !== cookiesArr.length ? "\n" : ""));else {
    $.log("" + message);
  }
}
function timeFormat(iIl11l) {
  let I1il;
  iIl11l ? I1il = new Date(iIl11l) : I1il = new Date();
  return I1il.getFullYear() + "-" + (I1il.getMonth() + 1 >= 10 ? I1il.getMonth() + 1 : "0" + (I1il.getMonth() + 1)) + "-" + (I1il.getDate() >= 10 ? I1il.getDate() : "0" + I1il.getDate());
}
function safeGet(I1iI) {
  if (!I1iI) {
    console.log("京东服务器返回数据为空");
    return false;
  }
  try {
    if (typeof JSON.parse(I1iI) == "object") {
      return true;
    }
  } catch (iIl111) {
    console.log(iIl111);
    return false;
  }
}
async function request(iilI1I, i11lii = {}) {
  let iiI1II = "",
    iIl11I = "POST";
  const lIiii1 = {
      "initForFarm": "8a2af",
      "taskInitForFarm": "fcb5a",
      "browseAdTaskForFarm": "53f09",
      "firstWaterTaskForFarm": "0cf1e",
      "waterFriendGotAwardForFarm": "d08ff",
      "ddnc_getTreasureBoxAward": "67dfc",
      "totalWaterTaskForFarm": "102f5",
      "gotThreeMealForFarm": "57b30",
      "waterGoodForFarm": "0c010",
      "choiceGoodsForFarm": "5f4ca",
      "gotCouponForFarm": "b1515",
      "gotStageAwardForFarm": "81591",
      "followVenderForBrand": "71547",
      "gotWaterGoalTaskForFarm": "c901b",
      "gotNewUserTaskForFarm": "de8f8",
      "orderTaskGotWaterForFarm": "eed5c",
      "clockInForFarm": "32b94",
      "clockInFollowForFarm": "4a0b4",
      "waterFriendForFarm": "673a0",
      "awardFirstFriendForFarm": "9b655",
      "awardInviteFriendForFarm": "2b5ca",
      "awardCallOrInviteFriendForFarm": "b0b03",
      "userMyCardForFarm": "86ba5",
      "getCallUserCardForFarm": "2ca57",
      "deleteFriendForFarm": "eaf91",
      "gotLowFreqWaterForFarm": "8172b",
      "getFullCollectionReward": "5c767",
      "getOrderPayLotteryWater": "ef089",
      "receiveStageEnergy": "15507",
      "exchangeGood": "52963",
      "farmAssistInit": "92354",
      "myCardInfoForFarm": "157b6",
      "gotPopFirstPurchaseTaskForFarm": "d432f",
      "limitWaterInitForFarm": "6bdc2",
      "ddnc_surpriseModal": "e81c1",
      "friendInitForFarm": "a5a9c",
      "clockInInitForFarm": "08dc3",
      "guideTaskAward": "59bc4",
      "signForFarm": "32b94",
      "gotNewUserTaskForFarm": "de8f8"
    },
    iIlII = lIiii1[iilI1I];
  if (!iIlII) iIl11I = "GET", iiI1II = "https://api.m.jd.com/client.action?functionId=" + iilI1I + "&body=" + encodeURIComponent(JSON.stringify(i11lii)) + "&appid=wh5";else {
    const lIIlll = await H5st.getH5st({
      "appId": iIlII,
      "appid": "signed_wh5",
      "body": i11lii,
      "client": "iOS",
      "clientVersion": "12.2.0",
      "functionId": iilI1I,
      "cookie": cookie,
      "ua": $.UA,
      "version": "4.2",
      "t": true
    });
    iiI1II = "https://api.m.jd.com/client.action?" + lIIlll.params;
  }
  await $.wait(700);
  const iIiII1 = {
      "url": iiI1II,
      "method": iIl11I,
      "headers": {
        "Host": "api.m.jd.com",
        "Accept": "*/*",
        "Origin": "https://carry.m.jd.com",
        "Accept-Encoding": "gzip,deflate,br",
        "User-Agent": $.UA,
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "Referer": "https://carry.m.jd.com/",
        "x-requested-with": "com.jingdong.app.mall",
        "Cookie": cookie
      },
      "body": i11lii,
      "timeout": 20000
    },
    I1l1 = 1;
  let Il11I1 = 0,
    i11liI = null,
    iilI11 = false;
  while (Il11I1 < I1l1) {
    Il11I1 > 0 && (await $.wait(1000));
    const ll1ii1 = await common.request(iIiII1);
    if (!ll1ii1.success) {
      {
        i11liI = "🚫 请求失败 ➜ " + ll1ii1.error;
        Il11I1++;
        continue;
      }
    }
    if (!ll1ii1?.["data"]) {
      i11liI = "🚫 请求失败 ➜ 无响应数据";
      Il11I1++;
      continue;
    }
    data = ll1ii1.data;
    return data;
  }
  Il11I1 >= I1l1 && (console.log(i11liI), iilI11 && ($.outFlag = true, $.message && $.message.fix(i11liI)));
}
function randomString(IiIlII, iI11i = "qwertyuiopasdfghjklzxcvbnm") {
  let ilIIII = "";
  for (let lll1l1 = 0; lll1l1 < IiIlII; lll1l1++) {
    ilIIII += iI11i[Math.floor(Math.random() * iI11i.length)];
  }
  return ilIIII;
}
function jsonParse(iIllIl) {
  if (typeof iIllIl == "string") try {
    return JSON.parse(iIllIl);
  } catch (IiIlI1) {
    console.log(IiIlI1);
    $.msg($.name, "", "请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie");
    return [];
  }
}