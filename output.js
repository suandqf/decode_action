//Tue Oct 01 2024 14:38:36 GMT+0000 (Coordinated Universal Time)
//Base:https://github.com/echo094/decode-js
//Modify:https://github.com/smallfawn/decode_action
const fs = require("fs"),
  path = require("path"),
  https = require("https"),
  axios = require("axios").default,
  CryptoJS = require("crypto-js"),
  querystring = require("querystring");
class Common {
  constructor() {
    this._Cookie = "";
    this._UserAgent = "";
    this._UserAgentMap = new Map();
    this._defaultUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/122.0.0.0";
    this._appSignConfig = null;
    this._requestDebugMode = false;
    this._requestAxiosProxyConfig = null;
    this._requestDynamicProxyConfig = null;
    this._requestDynamicProxyShowAddress = false;
    this._requestDynamicProxyPrintAddressFormat = "刷新动态代理配置：<address>";
    this._requestNoProxyList = null;
    this._requestFailMessagesMap = {
      400: "请求错误 [400 Bad Request]",
      401: "未授权 [401 Unauthorized]",
      403: "禁止访问 [403 Forbidden]",
      493: "禁止访问 [493 Forbidden]",
      404: "资源未找到 [404 Not Found]",
      408: "请求超时 [408 Request Timeout]",
      429: "请求过多 [429 Too Many Requests]",
      500: "服务器内部错误 [500 Internal Server Error]",
      502: "网关错误 [502 Bad Gateway]",
      503: "服务不可用 [503 Service Unavailable]"
    };
    this._requestErrorMessagesMap = {
      "ECONNABORTED": "请求被中断",
      "ECONNRESET": "连接被对方重置",
      "ECONNREFUSED": "服务器拒绝连接",
      "ETIMEDOUT": "网络请求超时",
      "ENOTFOUND": "无法解析的域名或地址",
      "EPROTO": "协议错误",
      "EHOSTUNREACH": "无法到达服务器主机",
      "ENETUNREACH": "无法到达网络",
      "EADDRINUSE": "网络地址已被使用",
      "EPIPE": "向已关闭的写入流进行写入",
      "ERR_BAD_OPTION_VALUE": "无效或不支持的配置选项值",
      "ERR_BAD_OPTION": "无效的配置选项",
      "ERR_NETWORK": "网络错误",
      "ERR_FR_TOO_MANY_REDIRECTS": "请求被重定向次数过多",
      "ERR_DEPRECATED": "使用了已弃用的特性或方法",
      "ERR_BAD_RESPONSE": "服务器响应无效或无法解析",
      "ERR_BAD_REQUEST": "请求无效或缺少必需参数",
      "ERR_CANCELED": "请求被用户取消",
      "ERR_NOT_SUPPORT": "当前环境不支持此特性或方法",
      "ERR_INVALID_URL": "请求的 URL 无效",
      "ERR_TLS_CERT_ALTNAME_INVALID": "TLS 证书的主机名无效",
      "ERR_TLS_CERT_REJECTED": "TLS 证书被拒绝",
      "ERR_HTTP2_STREAM_CANCEL": "HTTP2 流被取消",
      "ERR_HTTP2_SESSION_ERROR": "HTTP2 会话出错",
      "ERR_QUICSESSION_VERSION_NEGOTIATION": "QUIC 会话版本协商失败",
      "EAI_AGAIN": "DNS 查找超时"
    };
    this._latestAppVersionData = {
      "build": "169370",
      "version": "13.1.0"
    };
    this._latestLiteAppVersionData = {
      "build": "1676",
      "version": "6.26.0"
    };
    this._latestIOSVersion = "17.5";
    this._appHttpsTlsOptions = {
      "ciphers": ["TLS_AES_128_GCM_SHA256", "TLS_AES_256_GCM_SHA384", "TLS_CHACHA20_POLY1305_SHA256", "ECDHE-RSA-AES128-GCM-SHA256", "ECDHE-RSA-AES256-GCM-SHA384", "ECDHE-ECDSA-AES128-GCM-SHA256", "ECDHE-ECDSA-AES256-GCM-SHA384", "ECDHE-ECDSA-CHACHA20-POLY1305", "ECDHE-RSA-CHACHA20-POLY1305"].join(":")
    };
    this.Base64 = Base64Algorithm;
    this.DataCache = LocalStorageCache;
    this._shopMemberActivityIds = new Map();
    this._H5st = null;
    this._Table = null;
    this._HttpsProxyAgent = null;
    this._genSignModelPath = __dirname + "/Rebels_Sign";
    this._jdCryptoModelPath = __dirname + "/Rebels_H";
    this._hasInitAppSignConfig = false;
    this._initRequestConfig();
  }
  ["_initRequestConfig"]() {
    try {
      const Iil11l = require.main.filename,
        iI1iii = path.basename(Iil11l, ".js");
      this._requestNoProxyList = (process.env[iI1iii + "_no_proxy"] || process.env.RS_NO_PROXY || "").split(",").filter(II111i => II111i !== "");
      const iI1iil = process.env[iI1iii + "_proxy_tunnrl"] || process.env.RS_PROXY_TUNNRL || "",
        lIIIIl = (process.env.RS_TUNNRL_WHITRLIST || "").split("&").filter(Boolean);
      let l1iI = false;
      if (iI1iil && lIIIIl.length > 0) {
        const Illill = lIIIIl.some(II111l => process.mainModule.filename.includes(II111l));
        if (Illill) {
          const I1Iil = this._getProxyConfigWithAddress(iI1iil);
          if (I1Iil) {
            this._requestAxiosProxyConfig = I1Iil;
            console.log("\n====================使用代理池模式(新)===================\n");
            l1iI = true;
          } else console.log("❌ 提供的代理地址无效，跳过启用全局静态代理");
        }
      }
      if (!l1iI) {
        const I11iiI = process.env[iI1iii + "_proxy_api"] || process.env.RS_PROXY_API || "",
          I1Iii = (process.env.RS_API_WHITELIST || "").split("&").filter(Boolean);
        if (I11iiI && I1Iii.length > 0) {
          const I1IlI = I1Iii.some(ii11I1 => process.mainModule.filename.includes(ii11I1));
          if (I1IlI) {
            {
              this._requestDynamicProxyConfig = {
                "api": null,
                "proxyConfig": null,
                "useLimit": null,
                "timeLimit": null,
                "fetchFailContinue": null,
                "extractTimestamp": null,
                "lastUseTimeStamp": null,
                "usedTimes": null
              };
              this._requestDynamicProxyConfig.api = I11iiI;
              const iIl1ii = process.env[iI1iii + "_proxy_use_limit"] || process.env.RS_PROXY_USE_LIMIT || "0";
              try {
                this._requestDynamicProxyConfig.useLimit = parseInt(iIl1ii);
              } catch {
                this._requestDynamicProxyConfig.useLimit = 1;
              }
              const I1l1il = process.env[iI1iii + "_proxy_time_limit"] || process.env.RS_PROXY_TIME_LIMIT || "20000";
              try {
                this._requestDynamicProxyConfig.timeLimit = parseInt(I1l1il);
              } catch {
                this._requestDynamicProxyConfig.timeLimit = 20000;
              }
              this._requestDynamicProxyConfig.fetchFailContinue = (process.env[iI1iii + "_proxy_fetch_fail_continue"] || process.env.RS_PROXY_FETCH_FAIL_CONTINUE || "true") === "true";
              this._requestDynamicProxyShowAddress = (process.env[iI1iii + "_proxy_show_address"] || process.env.RS_PROXY_HTTP_DYNAMIC_PROXY_SHOW_ADDRESS || "false") === "true";
              console.log("\n=====================使用API模式(新)=====================\n");
              l1iI = true;
            }
          }
        }
      }
      Object.assign(axios.defaults, {
        "headers": {
          "common": {
            "User-Agent": this._defaultUserAgent
          }
        },
        "maxContentLength": Infinity,
        "maxBodyLength": Infinity,
        "maxRedirects": Infinity,
        "timeout": 60000,
        "transformResponse": [iIl1il => {
          try {
            return JSON.parse(iIl1il);
          } catch {}
          try {
            {
              const IlI1II = /[\w$.]+\(\s*({[\s\S]*?})\s*\)\s*;?/;
              if (IlI1II.test(iIl1il)) {
                const lIIIIi = iIl1il.match(IlI1II)[1];
                return JSON.parse(lIIIIi);
              }
            }
          } catch {}
          return iIl1il;
        }]
      });
    } catch (Iiil1I) {
      console.log("❌ 初始化 HTTP 请求配置时遇到了错误\n" + Iiil1I);
    }
  }
  ["_initAppSignConfig"]() {
    const l1lI = ["http://api.nolanstore.cc/sign", "http://sign.257999.xyz/sign"],
      II1lIi = process.env.JD_SIGN_API || l1lI[Math.floor(Math.random() * l1lI.length)];
    this._appSignConfig = {
      "requestApi": II1lIi,
      "bodyField": process.env.JD_SIGN_API_BODY_FIELD || "body",
      "functionIdField": process.env.JD_SIGN_API_FUNCTIONID_FIELD || "fn",
      "requestMethod": null,
      "requestContentType": null,
      "genSign": null
    };
    try {
      const lii1Il = process.env.JD_SIGN_API_METHOD;
      lii1Il && lii1Il.toUpperCase() === "GET" ? this._appSignConfig.requestMethod = "GET" : this._appSignConfig.requestMethod = "POST";
    } catch {}
    try {
      {
        const IillII = process.env.JD_SIGN_API_CONTENT_TYPE;
        IillII && IillII.indexOf("application/x-www-form-urlencoded") !== -1 ? this._appSignConfig.requestContentType = IillII : this._appSignConfig.requestContentType = "application/json; charset=utf-8";
      }
    } catch {}
    try {
      this._appSignConfig.genSign = require(this._genSignModelPath);
    } catch {}
  }
  ["genRandomString"](iiII1I = 32, lIIIII = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-") {
    const Iiil1l = lIIIII.length;
    let II1lII = "";
    for (let ili1 = 0; ili1 < iiII1I; ili1++) {
      II1lII += lIIIII.charAt(Math.floor(Math.random() * Iiil1l));
    }
    return II1lII;
  }
  ["parseUrl"](l1l1) {
    try {
      const I1l1iI = new URL(l1l1);
      return I1l1iI;
    } catch (iIilll) {
      return {};
    }
  }
  ["parseUrlParameter"](I11ili) {
    try {
      {
        const Ii1i1l = {},
          iI1li = this.parseUrl(I11ili),
          ii11Il = new URLSearchParams(iI1li?.["search"]);
        for (const [ii11Ii, iiII1l] of ii11Il) {
          Ii1i1l[ii11Ii] = iiII1l;
        }
        if (iI1li?.["hash"] && iI1li.hash.includes("#/")) {
          const iiII1i = iI1li.hash.replace("#/", ""),
            lll11l = iiII1i.includes("?") ? new URLSearchParams(iiII1i.split("?").slice(1).join("?")) : new URLSearchParams();
          for (const [iI1ill, Illiil] of lll11l) {
            Ii1i1l[iI1ill] = Illiil;
          }
        }
        return Ii1i1l;
      }
    } catch {
      return {};
    }
  }
  ["getUrlParameter"](lI11iI, iI1ili) {
    try {
      {
        const lll11i = this.parseUrl(lI11iI),
          l1li = lll11i.searchParams.get(iI1ili);
        return l1li || "";
      }
    } catch {
      return "";
    }
  }
  ["objectToQueryString"](ilil) {
    try {
      const lIIl1i = [];
      for (const lll111 in ilil) {
        if (ilil.hasOwnProperty(lll111)) {
          {
            const iIill1 = ilil[lll111],
              Illili = encodeURIComponent(lll111),
              il1III = iIill1 === null || iIill1 === undefined ? "" : encodeURIComponent(iIill1);
            lIIl1i.push(Illili + "=" + il1III);
          }
        }
      }
      return lIIl1i.join("&");
    } catch {
      return "";
    }
  }
  ["queryStringToObject"](illi) {
    try {
      {
        const iI1l1 = {},
          I11iil = illi.split("&");
        for (const I11ilI of I11iil) {
          const [iIilii, iIl1li] = I11ilI.split("=");
          iI1l1[decodeURIComponent(iIilii)] = iIl1li === undefined ? null : decodeURIComponent(iIl1li);
        }
        return iI1l1;
      }
    } catch {
      return {};
    }
  }
  ["parseResponseCookie"](iIl1ll) {
    const IiiIII = {};
    try {
      if (typeof iIl1ll === "object" && iIl1ll?.["headers"] && iIl1ll?.["headers"]["set-cookie"]) {
        {
          const Illil1 = iIl1ll.headers["set-cookie"];
          for (const Iil11I of Illil1) {
            const iI1ii = Iil11I.split(";")[0];
            IiiIII[iI1ii.substr(0, iI1ii.indexOf("="))] = iI1ii.substr(iI1ii.indexOf("=") + 1);
          }
        }
      }
    } catch {}
    return IiiIII;
  }
  ["getResponseCookie"](I11il1, lIliI = "") {
    let I1l1ll = "";
    const iI1ilI = this.parseResponseCookie(I11il1),
      I1l1li = Object.keys(iI1ilI);
    if (I1l1li.length > 0) I1l1li.forEach(IiiI1l => {
      I1l1ll += IiiI1l + "=" + iI1ilI[IiiI1l] + "; ";
    }), I1l1ll = I1l1ll.trim();else {
      if (lIliI) return lIliI;
    }
    return I1l1ll;
  }
  ["getCookieValue"](II1IlI, lI11ll) {
    if (!II1IlI || !lI11ll) return "";
    const lI11li = new RegExp(lI11ll + "=([^;]*)"),
      i1lii1 = lI11li.exec(II1IlI.trim().replace(/\s/g, ""));
    return i1lii1 && i1lii1[1] || "";
  }
  ["parseCookie"](IilIIl) {
    const l1IiI1 = {},
      IIiiI = IilIIl.split(";");
    for (const lIlIi of IIiiI) {
      {
        const [IIilI, I1i1Ii] = lIlIi.trim().split("=");
        l1IiI1[IIilI] = I1i1Ii;
      }
    }
    return l1IiI1;
  }
  ["getLatestIOSVersion"]() {
    return this._iOSVersionLatest || "";
  }
  ["formatTime"](lii111, I1i1Il = Date.now()) {
    const iIi1Il = new Date(I1i1Il);
    let iIi1Ii = lii111;
    const IlI111 = {
      "YYYY": iIi1Il.getFullYear(),
      "MM": String(iIi1Il.getMonth() + 1).padStart(2, "0"),
      "DD": String(iIi1Il.getDate()).padStart(2, "0"),
      "HH": String(iIi1Il.getHours()).padStart(2, "0"),
      "mm": String(iIi1Il.getMinutes()).padStart(2, "0"),
      "ss": String(iIi1Il.getSeconds()).padStart(2, "0"),
      "S": String(iIi1Il.getMilliseconds()).padStart(3, "0")
    };
    Object.keys(IlI111).forEach(i1liii => {
      iIi1Ii = iIi1Ii.replace(new RegExp(i1liii, "g"), IlI111[i1liii]);
    });
    return iIi1Ii;
  }
  async ["request"](i1liil) {
    let iiIII1 = {
        "success": false,
        "status": null,
        "data": null,
        "headers": null,
        "error": null,
        "connected": false
      },
      li1iII = this._requestDebugMode,
      lIIi1 = null;
    try {
      if (!i1liil || !i1liil.url) {
        console.log("❌ 调用请求方法无效，缺少必要的参数！");
        iiIII1.error = "缺少必要的请求参数";
        return iiIII1;
      }
      if (i1liil.hasOwnProperty("debug")) {
        li1iII = i1liil.debug;
        delete i1liil.debug;
      }
      const lllIIi = this._requestAxiosProxyConfig,
        li1iIl = this._requestDynamicProxyConfig,
        lIii1I = this._requestNoProxyList;
      if (i1liil.body) {
        i1liil.data = i1liil.body;
        delete i1liil.body;
      }
      for (const li1iIi of ["data", "params"]) {
        !i1liil[li1iIi] && delete i1liil[li1iIi];
      }
      i1liil.method = (i1liil.method || "get").toLowerCase();
      if (i1liil.proxy && typeof i1liil.proxy === "string") {
        {
          const lIIl1 = this._getProxyConfigWithAddress(i1liil.proxy);
          lIIl1 ? i1liil.proxy = lIIl1 : (console.log("❌ 代理配置无效，跳过使用代理"), delete i1liil.proxy);
        }
      }
      i1liil.data && typeof i1liil.data === "object" && (!i1liil.headers || !i1liil.headers["Content-Type"] || i1liil.headers["Content-Type"].includes("application/x-www-form-urlencoded")) && (i1liil.data = querystring.stringify(i1liil.data));
      if (i1liil.httpsTlsOptions && typeof i1liil.httpsTlsOptions === "object" && i1liil.url.includes("https://")) lIIi1 = i1liil.httpsTlsOptions, Object.assign(https.globalAgent.options, lIIi1), delete i1liil.httpsTlsOptions;else i1liil.hasOwnProperty("httpsTlsOptions") && delete i1liil.httpsTlsOptions;
      let lliI1l = false;
      if (!["proxy", "httpAgent", "httpsAgent"].some(iiIl1I => i1liil.hasOwnProperty(iiIl1I))) {
        if (lllIIi || li1iIl) {
          {
            let il111I = true;
            const lliI11 = this.parseUrl(i1liil.url).hostname || i1liil.url;
            for (const ilIil of lIii1I) {
              {
                const lIii1i = new RegExp("^" + ilIil.split("*").join(".*") + "$");
                if (lIii1i.test(lliI11.hostname)) {
                  {
                    il111I = false;
                    li1iII && console.log("ℹ️ 该代理请求命中 NO_PROXY 规则 ➜ " + ilIil);
                    break;
                  }
                }
              }
            }
            if (il111I) {
              {
                if (lllIIi) i1liil.proxy = lllIIi;else {
                  if (li1iIl) {
                    if (li1iIl.proxyConfig) i1liil.proxy = li1iIl.proxyConfig, lliI1l = true;else {
                      {
                        const lIliIi = await this.getProxyAddressWithApi(li1iIl.api),
                          lIii1l = this._getProxyConfigWithAddress(lIliIi);
                        if (lIii1l) Object.assign(li1iIl, {
                          "extractTimestamp": Date.now(),
                          "usedTimes": 0,
                          "proxyConfig": lIii1l
                        }), i1liil.proxy = lIii1l, lliI1l = true, this._requestDynamicProxyShowAddress && console.log(this._requestDynamicProxyPrintAddressFormat.replace(/<address>/g, this._getProxyAddressWithConfig(i1liil.proxy)));else {
                          if (!li1iIl.fetchFailContinue) {
                            iiIII1.error = "获取动态代理地址失败，已设置跳过请求";
                            return iiIII1;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      for (const liiIl of ["proxy", "httpAgent", "httpsAgent"]) {
        !i1liil[liiIl] && delete i1liil[liiIl];
      }
      if (i1liil.proxy) {
        this._loadModule("HttpsProxyAgent");
        i1liil.httpsAgent = this._genHttpsAgentWithProxyConfig(i1liil.proxy);
        delete i1liil.proxy;
      }
      await axios(i1liil).then(IiiI1I => {
        {
          if (lliI1l) {
            li1iIl.lastUseTimeStamp = Date.now();
            li1iIl.usedTimes++;
            const II1IiI = li1iIl.useLimit > 0 && li1iIl.usedTimes >= li1iIl.useLimit,
              IilIII = li1iIl.timeLimit > 0 && Date.now() - li1iIl.extractTimestamp >= li1iIl.timeLimit;
            if (II1IiI || IilIII) {
              Object.assign(li1iIl, {
                "proxyConfig": null,
                "lastUseTimeStamp": null,
                "extractTimestamp": null,
                "usedTimes": 0
              });
            }
          }
          iiIII1.success = true;
          iiIII1.status = IiiI1I.status;
          iiIII1.data = IiiI1I.data;
          iiIII1.headers = IiiI1I.headers;
          iiIII1.connected = true;
          li1iII && this._handleRequestDebugPrint(IiiI1I, true);
        }
      }).catch(liiIl1 => {
        if (lliI1l) {
          {
            li1iIl.lastUseTimeStamp = Date.now();
            li1iIl.usedTimes++;
            const IiI1il = li1iIl.useLimit > 0 && li1iIl.usedTimes >= li1iIl.useLimit,
              l11II1 = li1iIl.timeLimit > 0 && Date.now() - li1iIl.extractTimestamp >= li1iIl.timeLimit;
            (IiI1il || l11II1) && Object.assign(li1iIl, {
              "proxyConfig": null,
              "lastUseTimeStamp": null,
              "extractTimestamp": null,
              "usedTimes": 0
            });
          }
        }
        let III1I = null;
        if (liiIl1.response) {
          iiIII1.connected = true;
          const i1I1II = liiIl1.response?.["status"];
          liiIl1.response.data && (iiIII1.data = liiIl1.response.data);
          liiIl1.response.headers && (iiIII1.headers = liiIl1.response.headers);
          III1I = this._requestFailMessagesMap[i1I1II] || "请求失败 [Response code " + i1I1II + "]";
        } else {
          lliI1l && Object.assign(li1iIl, {
            "proxyConfig": null,
            "lastUseTimeStamp": null,
            "extractTimestamp": null,
            "usedTimes": 0
          });
          liiIl1.request ? III1I = (this._requestErrorMessagesMap[liiIl1.code] ?? "未知网络错误") + " [" + liiIl1.code + "]" : III1I = liiIl1.message || "未知错误状态";
        }
        (liiIl1.config?.["httpAgent"] || liiIl1.config?.["httpsAgent"]) && (III1I += "（🌐该请求通过代理发出）");
        iiIII1.error = III1I;
        iiIII1.status = liiIl1.response?.["status"] || null;
        li1iII && (this._handleRequestDebugPrint(liiIl1, false), console.log("❌ 请求失败原因 ➜ " + iiIII1.error));
      });
      if (lIIi1) {
        Object.keys(lIIi1).forEach(lIIli => {
          https.globalAgent.options[lIIli] = null;
        });
      }
    } catch (IlIlIi) {
      iiIII1.error = IlIlIi.message || IlIlIi;
      li1iII && console.log("❌ 在处理 HTTP 请求时遇到了错误 ➜ " + IlIlIi);
    }
    return iiIII1;
  }
  async ["get"](llll1l) {
    return await this.request(Object.assign({}, llll1l, {
      "method": "get"
    }));
  }
  async ["post"](i1lI1I) {
    return await this.request(Object.assign({}, i1lI1I, {
      "method": "post"
    }));
  }
  async ["put"](Iil) {
    return await this.request(Object.assign({}, Iil, {
      "method": "put"
    }));
  }
  async ["delete"](llI1i1) {
    return await this.request(Object.assign({}, llI1i1, {
      "method": "delete"
    }));
  }
  ["_handleRequestDebugPrint"](IlIlIl, i1I1Ii = true) {
    this._loadModule("TablePrint");
    if (!this._Table) return;
    const i1I1Il = this._Table;
    console.log("------------------------ 🔧 REQUEST DEBUG ------------------------------");
    try {
      let iIllll = null,
        IlI = null;
      iIllll = new i1I1Il({
        "columns": [{
          "title": "类型",
          "name": "type",
          "alignment": "left"
        }, {
          "title": "说明",
          "name": "info",
          "alignment": "left"
        }],
        "charLength": {
          "🟢": 2,
          "🔴": 2,
          "❌": 2
        }
      });
      iIllll.addRow({
        "type": "请求结果",
        "info": "" + (i1I1Ii ? "🟢" : IlIlIl?.["response"] ? "🔴" : "❌") + (IlIlIl?.["status"] ? " " + IlIlIl.status : IlIlIl?.["response"] ? " " + IlIlIl.response?.["status"] : "") + " - " + "".concat(IlIlIl?.["config"]?.["method"] || "未知").toUpperCase()
      });
      if (IlIlIl?.["config"]?.["url"]) try {
        IlI = new URL(IlIlIl.config.url);
        iIllll.addRow({
          "type": "请求地址",
          "info": IlI.origin
        });
        iIllll.addRow({
          "type": "请求路径",
          "info": IlI.pathname
        });
      } catch {
        iIllll.addRow({
          "type": "请求地址",
          "info": IlIlIl.config.url
        });
      }
      iIllll.printTable();
      if (IlI && IlI?.["search"] || IlIlIl?.["config"]?.["params"]) {
        try {
          {
            const ilIiIl = Object.assign({}, new URLSearchParams(IlI.search) || {}, IlIlIl?.["config"]?.["params"] || {});
            if (Object.keys(ilIiIl).length > 0) {
              {
                iIllll = new i1I1Il({
                  "columns": [{
                    "title": "名称",
                    "name": "label",
                    "alignment": "left"
                  }, {
                    "title": "值",
                    "name": "value",
                    "alignment": "left"
                  }]
                });
                for (let i1lI1l in ilIiIl) {
                  iIllll.addRow({
                    "label": decodeURIComponent(i1lI1l),
                    "value": decodeURIComponent(ilIiIl[i1lI1l])
                  });
                }
                console.log("\n✧ 请求参数");
                iIllll.printTable();
              }
            }
          }
        } catch {}
      }
      if (IlIlIl?.["config"]?.["httpAgent"] || IlIlIl?.["config"]?.["httpsAgent"]) {
        {
          const I1llll = (IlIlIl.config?.["httpAgent"] || IlIlIl.config?.["httpsAgent"])?.["proxy"],
            IlI11l = {
              "protocol": I1llll.protocol.replace(":", ""),
              "hostname": I1llll.hostname
            };
          I1llll.port && (IlI11l.port = I1llll.port);
          if (I1llll instanceof URL) {
            (I1llll.username || I1llll.password) && (IlI11l.username = I1llll.username, IlI11l.password = I1llll.password);
          } else {
            {
              if (I1llll.auth) {
                {
                  const Ill = I1llll.auth.split(":");
                  IlI11l.username = Ill[0];
                  IlI11l.password = Ill[1];
                }
              }
            }
          }
          iIllll = new i1I1Il({
            "columns": [{
              "title": "名称",
              "name": "label",
              "alignment": "left"
            }, {
              "title": "值",
              "name": "value",
              "alignment": "left"
            }]
          });
          for (let llI1l1 in IlI11l) {
            let iIi1I1 = IlI11l[llI1l1];
            typeof iIi1I1 === "object" && (iIi1I1 = JSON.stringify(iIi1I1));
            iIllll.addRow({
              "label": llI1l1,
              "value": iIi1I1
            });
          }
          console.log("\n✧ HTTP 代理配置");
          iIllll.printTable();
        }
      }
      if (IlIlIl?.["config"]?.["headers"]) {
        const iil11 = IlIlIl.config.headers;
        iIllll = new i1I1Il({
          "columns": [{
            "title": "名称",
            "name": "label",
            "alignment": "left"
          }, {
            "title": "值",
            "name": "value",
            "alignment": "left",
            "maxLen": 80
          }]
        });
        for (let Iill1i in iil11) {
          let l11l11 = iil11[Iill1i];
          typeof l11l11 === "object" && (l11l11 = JSON.stringify(l11l11));
          iIllll.addRow({
            "label": Iill1i,
            "value": l11l11
          });
        }
        console.log("\n✧ 请求 Headers");
        iIllll.printTable();
      }
      if (IlIlIl?.["config"]?.["data"]) {
        let Iill1l = IlIlIl.config.data;
        if (typeof Iill1l === "object") Iill1l = JSON.stringify(JSON.parse(Iill1l));else {
          if (typeof Iill1l === "string") {
            try {
              const i1i1I = JSON.parse(Iill1l);
              Iill1l = JSON.stringify(i1i1I);
            } catch {
              Iill1l = JSON.stringify(Iill1l).slice(1, -1);
            }
          }
        }
        console.log("\n✧ 请求 Body\n" + Iill1l);
      }
      if (!i1I1Ii && !IlIlIl?.["response"]) {
        console.log("\n------------------------------------------------------------------------");
        return;
      }
      if (IlIlIl?.["headers"]) {
        {
          const IlI11I = IlIlIl.headers;
          iIllll = new i1I1Il({
            "columns": [{
              "title": "名称",
              "name": "label",
              "alignment": "left"
            }, {
              "title": "值",
              "name": "value",
              "alignment": "left",
              "maxLen": 80
            }]
          });
          for (let l11l1i in IlI11I) {
            {
              let l11l1l = IlI11I[l11l1i];
              if (typeof l11l1l !== "string") {
                l11l1l = JSON.stringify(l11l1l);
              }
              iIllll.addRow({
                "label": l11l1i,
                "value": l11l1l
              });
            }
          }
          console.log("\n✧ 响应 Headers");
          iIllll.printTable();
        }
      }
      if (IlIlIl?.["data"]) {
        {
          let Ii1i = IlIlIl.data;
          if (typeof Ii1i === "object") Ii1i = JSON.stringify(Ii1i);else {
            if (typeof Ii1i === "string") try {
              const llI1lI = JSON.parse(Ii1i);
              Ii1i = JSON.stringify(llI1lI);
            } catch {
              Ii1i = JSON.stringify(Ii1i).slice(1, -1);
            }
          }
          console.log("\n✧ 响应 Body\n" + Ii1i);
        }
      }
    } catch (il11i) {
      console.log("❌ 处理 REQUEST DEBUG PRINT 时遇到了错误 ➜ " + (il11i.message || il11i));
    }
    console.log("\n------------------------------------------------------------------------");
  }
  async ["getProxyAddressWithApi"](iiIIl) {
    let i1iI = "";
    try {
      const lliii = /\b(?:\d{1,3}\.){3}\d{1,3}:\d{1,5}\b/g,
        iiIII = {
          "url": iiIIl,
          "method": "post",
          "proxy": null,
          "timeout": 30000
        };
      let IIIii1 = 0,
        llI1il = null;
      const IiI1l1 = 1;
      while (IIIii1 < IiI1l1) {
        const il111 = await this.request(iiIII);
        if (!il111.success) {
          llI1il = il111.error;
          IIIii1++;
          continue;
        }
        if (!il111.data) {
          llI1il = "无响应数据";
          IIIii1++;
          continue;
        }
        const llI1ii = il111.data;
        if (typeof llI1ii === "object") {
          if (llI1ii?.["data"]) {
            let Ilii1II1 = llI1ii.data;
            if (Array.isArray(Ilii1II1) && Ilii1II1.length > 0) {
              Ilii1II1 = Ilii1II1[0];
              if (Ilii1II1?.["ip"] && Ilii1II1?.["port"]) {
                i1iI = Ilii1II1.ip + ":" + Ilii1II1.port;
              } else Ilii1II1?.["IP"] && Ilii1II1?.["Port"] && (i1iI = Ilii1II1.IP + ":" + Ilii1II1.Port);
            } else {
              if (Ilii1II1?.["proxy_list"] && Array.isArray(Ilii1II1.proxy_list) && Ilii1II1.proxy_list.length > 0) {
                const ii1IIii1 = Ilii1II1.proxy_list[0];
                typeof ii1IIii1 === "object" && ii1IIii1?.["ip"] && ii1IIii1?.["port"] ? i1iI = ii1IIii1.ip + ":" + ii1IIii1.port : i1iI = ii1IIii1;
              }
            }
            i1iI && !lliii.test(i1iI) && (i1iI = "");
          }
          !i1iI && (llI1il = "接口响应数据异常：" + JSON.stringify(llI1ii));
        } else {
          const i1lill1i = llI1ii.match(lliii);
          i1lill1i && (i1iI = i1lill1i[0]);
          !i1iI && (llI1il = "接口响应数据异常：" + llI1ii);
        }
        if (i1iI) return i1iI;
        IIIii1++;
      }
      IIIii1 >= IiI1l1 && console.log("⚠ 提取代理地址失败 ➜ " + llI1il);
    } catch (I1Iill1) {
      console.log("❌ 在处理请求代理API获取代理地址时遇到了错误\n" + I1Iill1);
    }
    return i1iI;
  }
  ["_getProxyConfigWithAddress"](iIililIi = "") {
    try {
      if (!iIililIi) return null;
      !iIililIi.includes("://") && (iIililIi = "http://" + iIililIi);
      const IIIl1i11 = this.parseUrl(iIililIi);
      if (IIIl1i11?.["hostname"]) {
        {
          const lilII11 = {
            "protocol": IIIl1i11.protocol.replace(":", "") === "https" ? "https" : "http",
            "host": IIIl1i11.hostname,
            "port": parseInt(IIIl1i11?.["port"] || "8080")
          };
          (IIIl1i11?.["username"] || IIIl1i11?.["password"]) && (lilII11.auth = {
            "username": IIIl1i11?.["username"] || "",
            "password": IIIl1i11?.["password"] || ""
          });
          return lilII11;
        }
      }
    } catch {}
    return null;
  }
  ["_getProxyAddressWithConfig"](IIII11l1 = null) {
    try {
      if (!IIII11l1) return null;
      const i1lill11 = Object.assign({}, IIII11l1);
      let IIlillli = "";
      if (i1lill11.auth) {
        IIlillli = (i1lill11.auth?.["username"] || "") + ":" + (i1lill11.auth?.["password"] || "") + "@";
      }
      return i1lill11.protocol + "://" + IIlillli + i1lill11.host + ":" + i1lill11.port;
    } catch {
      return JSON.stringify(IIII11l1);
    }
  }
  ["_genHttpsAgentWithProxyConfig"](lIlIllll) {
    try {
      if (!this._HttpsProxyAgent) return null;
      if (!lIlIllll) return null;
      let ii1IIil1 = (lIlIllll?.["protocol"] || "http") + "://";
      lIlIllll?.["auth"] && (ii1IIil1 += (lIlIllll.auth?.["username"] || "") + ":" + (lIlIllll.auth?.["password"] || "") + "@");
      ii1IIil1 += lIlIllll?.["host"] + ":" + (lIlIllll?.["port"] || "8080");
      return new this._HttpsProxyAgent(ii1IIil1);
    } catch (l1lIIII) {
      console.log("❌ 加载代理时遇到了错误 ➜ " + (l1lIIII.message || l1lIIII));
    }
    return null;
  }
  async ["concTaskNormal"](IiIl11l1 = "3", IIII11li = 100, iIIllIiI) {
    let I1IiliI = false,
      iiI1iI1I = 0,
      lIlIllli = 0;
    async function l1Ili1li(i1II111i) {
      const IIIll111 = await iIIllIiI(i1II111i);
      if (IIIll111) {
        if (typeof IIIll111 === "boolean") I1IiliI = true;else {
          if (typeof IIIll111 === "object") {
            IIIll111?.["runEnd"] && (I1IiliI = true);
          }
        }
      }
      iiI1iI1I--;
      IIII11ll();
    }
    async function IIII11ll() {
      while (iiI1iI1I < IiIl11l1 && IIII11li > 0 && !I1IiliI) {
        IIII11li--;
        iiI1iI1I++;
        lIlIllli++;
        await l1Ili1li(lIlIllli);
      }
      I1IiliI && (await new Promise(l1i111ii => {
        {
          const l1lIII1 = setInterval(() => {
            iiI1iI1I === 0 && (clearInterval(l1lIII1), l1i111ii());
          }, 100);
        }
      }));
    }
    const iIIllIi1 = Math.min(IIII11li, IiIl11l1),
      i1lill1l = [];
    for (let IiIl11lI = 0; IiIl11lI < iIIllIi1; IiIl11lI++) {
      IIII11li--;
      iiI1iI1I++;
      lIlIllli++;
      i1lill1l.push(l1Ili1li(lIlIllli));
    }
    await Promise.all(i1lill1l);
    IIII11ll();
    await new Promise(l1li1Il1 => {
      {
        const IIiIII1 = setInterval(() => {
          (iiI1iI1I === 0 || I1IiliI) && (clearInterval(IIiIII1), l1li1Il1());
        }, 100);
      }
    });
  }
  ["setCookie"](I1Iilli) {
    this._Cookie = I1Iilli;
  }
  ["unsetCookie"]() {
    this._Cookie = "";
    this._UserAgent = "";
  }
  ["getCookie"]() {
    return this._Cookie;
  }
  ["getLatestAppVersion"]() {
    return this._latestAppVersionData.version || "";
  }
  ["getLatestAppBuildVersion"]() {
    return this._latestAppVersionData.build || "";
  }
  ["getLatestLiteAppVersion"]() {
    return this._latestLiteAppVersionData.version || "";
  }
  ["getLatestLiteAppBuildVersion"]() {
    return this._latestLiteAppVersionData.build || "";
  }
  ["getErrorMsg"](l1Ili1i1, I1Iilll = ["msg", "message", "errMsg", "errMessage", "errorMessage", "bizMsg", "subMsg", "echo", "error", "resp_msg", "txt", "rlt", "displayMsg", "resultMsg", "desc"], IIl1l1i1 = "") {
    if (!l1Ili1i1) return IIl1l1i1;
    for (let l1li1Iii of I1Iilll) {
      if (l1Ili1i1.hasOwnProperty(l1li1Iii)) return l1Ili1i1[l1li1Iii];
    }
    return IIl1l1i1;
  }
  ["maskUserName"](lilII1i = "", IIl1l1iI = "*") {
    if (!lilII1i) return "";
    if (lilII1i.length <= 1) return IIl1l1iI;
    if (lilII1i.length < 5) return lilII1i.slice(0, 1) + IIl1l1iI.repeat(lilII1i.length - 1);
    return lilII1i.slice(0, 2) + IIl1l1iI.repeat(lilII1i.length - 4) + lilII1i.slice(-2);
  }
  ["genUuid"](IlIl11l = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", IiIiiiii = "0123456789abcdef") {
    let l1IiIilI = "";
    for (let IIl1l1ii of IlIl11l) {
      {
        if (IIl1l1ii == "x") {
          l1IiIilI += IiIiiiii.charAt(Math.floor(Math.random() * IiIiiiii.length));
        } else IIl1l1ii == "X" ? l1IiIilI += IiIiiiii.charAt(Math.floor(Math.random() * IiIiiiii.length)).toUpperCase() : l1IiIilI += IIl1l1ii;
      }
    }
    return l1IiIilI;
  }
  ["genUA"](i11lI1l1 = "", IiIiiill = "jd") {
    if (i11lI1l1 && this._UserAgentMap.has(i11lI1l1)) return this._UserAgentMap.get(i11lI1l1);
    const IlI1i1i = {
        "jd": {
          "app": "jdapp",
          "appBuild": this._latestAppVersionData.build,
          "clientVersion": this._latestAppVersionData.version
        },
        "lite": {
          "app": "jdltapp",
          "appBuild": this._latestLiteAppVersionData.build,
          "clientVersion": this._latestLiteAppVersionData.version
        }
      },
      iiI1Illi = IiIiiill === "lite" ? "lite" : "jd",
      {
        app: iiI1Illl,
        appBuild: IIl1l1l1,
        clientVersion: l1I11lii
      } = IlI1i1i[iiI1Illi],
      l1I11lil = [this._latestIOSVersion].map(iililIi => {
        {
          let i11lI1ll = iililIi.split(".");
          if (i11lI1ll.length > 2) i11lI1ll.pop();
          return i11lI1ll.join(".");
        }
      }),
      IlI11I1i = l1I11lil[Math.floor(Math.random() * l1I11lil.length)],
      IliIIIlI = this.genUuid(),
      IIiIIII = !!i11lI1l1 ? JSON.stringify(this.getCipherConf({
        "ud": CryptoJS.SHA1(i11lI1l1).toString(),
        "sv": IlI11I1i,
        "iad": ""
      }, iiI1Illi)) : "",
      IlI11I1l = "iPhone; CPU iPhone OS " + IlI11I1i.replace(".", "_") + " like Mac OS X",
      IiIiiili = [iiI1Illl, "iPhone", l1I11lii, "", "rn/" + IliIIIlI, "M/5.0", "appBuild/" + IIl1l1l1, "jdSupportDarkMode/0", "ef/1", IIiIIII ? "ep/" + encodeURIComponent(IIiIIII) : "", "Mozilla/5.0 (" + IlI11I1l + ") AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148", "supportJDSHWK/1", ""],
      i11lI1lI = IiIiiili.join(";");
    i11lI1l1 && this._UserAgentMap.set(i11lI1l1, i11lI1lI);
    if (this._Cookie) this._UserAgent = i11lI1lI;
    return i11lI1lI;
  }
  ["getJEH"](i11lI1li) {
    !i11lI1li && (i11lI1li = "JD4iPhone/" + this.getLatestAppBuildVersion() + " (iPhone; iOS " + this.getLatestIOSVersion() + "; Scale/3.00)");
    return encodeURIComponent(JSON.stringify(this.getCipherConf({
      "User-Agent": encodeURIComponent(i11lI1li)
    })));
  }
  ["getJEC"](IIl1l1ll) {
    return encodeURIComponent(JSON.stringify(this.getCipherConf({
      "pin": encodeURIComponent(IIl1l1ll)
    })));
  }
  ["getCipherConf"](ii1i1i1i, iililII = "jd") {
    if (ii1i1i1i && typeof ii1i1i1i === "object") for (let il1iIiiI in ii1i1i1i) {
      ii1i1i1i[il1iIiiI] = this.Base64.encode(ii1i1i1i[il1iIiiI]);
    } else ii1i1i1i && typeof ii1i1i1i === "string" ? ii1i1i1i = this.Base64.encode(ii1i1i1i) : ii1i1i1i = {};
    return {
      "ciphertype": 5,
      "cipher": ii1i1i1i,
      "ts": Math.floor(Date.now() / 1000),
      "hdid": "JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw=",
      "version": "1.0.3",
      "appname": iililII === "lite" ? "com.jd.jdmobilelite" : "com.360buy.jdmobile",
      "ridx": -1
    };
  }
  async ["getLoginStatus"](iIllIil = this._Cookie) {
    if (!iIllIil) return console.log("🚫 getLoginStatus 请求失败 ➜ 未设置Cookie"), undefined;
    try {
      const il1iIiil = {
        "url": "https://plogin.m.jd.com/cgi-bin/ml/islogin",
        "method": "GET",
        "headers": {
          "Accept": "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-CN,zh-Hans;q=0.9",
          "Cookie": iIllIil,
          "Host": "plogin.m.jd.com",
          "User-Agent": this._UserAgent || this._defaultUserAgent
        },
        "timeout": 30000,
        "debug": false
      };
      let iiiIIiII = 0,
        il1iIiii = null;
      const IIlillii = 1;
      while (iiiIIiII < IIlillii) {
        const IliIIIi1 = await this.request(il1iIiil);
        if (!IliIIIi1.success) {
          {
            il1iIiii = "🚫 getLoginStatus 请求失败 ➜ " + IliIIIi1.error;
            iiiIIiII++;
            continue;
          }
        }
        if (!IliIIIi1.data) {
          il1iIiii = "🚫 getLoginStatus 请求异常 ➜ 无响应数据";
          iiiIIiII++;
          continue;
        }
        const liIi1IIl = IliIIIi1.data?.["islogin"];
        if (liIi1IIl === "1") {
          return true;
        } else {
          if (liIi1IIl === "0") return false;
        }
        iiiIIiII++;
      }
      iiiIIiII >= IIlillii && console.log(il1iIiii);
    } catch (il1li1i1) {
      console.log("❌ getLoginStatus 在处理请求中遇到了错误\n" + il1li1i1);
    }
    return undefined;
  }
  async ["joinShopMember"](illiIIi, iill11i1 = this._Cookie, iIIii1I1 = "") {
    if (!iill11i1) return console.log("🚫 joinShopMember 请求失败 ➜ 未设置Cookie"), undefined;
    if (!illiIIi) {
      return undefined;
    }
    try {
      this._loadModule("h5st");
      if (!this._H5st) {
        return undefined;
      }
      illiIIi = "".concat(illiIIi);
      const il1iIil1 = {
        "venderId": illiIIi,
        "bindByVerifyCodeFlag": 1,
        "registerExtend": {},
        "writeChildFlag": 0,
        "channel": 406,
        "appid": "27004",
        "needSecurity": true,
        "bizId": "shopmember_m_jd_com"
      };
      if (!iIIii1I1) {
        this._shopMemberActivityIds.has(illiIIi) && (iIIii1I1 = this._shopMemberActivityIds.get(illiIIi));
      }
      iIIii1I1 && (il1iIil1.activityId = iIIii1I1);
      const IlI11I1I = {
          "appId": "27004",
          "appid": "shopmember_m_jd_com",
          "functionId": "bindWithVender",
          "clientVersion": "9.2.0",
          "client": "H5",
          "body": il1iIil1,
          "version": "4.7",
          "t": true,
          "ua": this._UserAgent || this._defaultUserAgent
        },
        l1I11lli = await this._H5st.getH5st(IlI11I1I);
      if (!l1I11lli.paramsData) return undefined;
      const lIlIlli1 = {
          "url": "https://api.m.jd.com/client.action",
          "method": "POST",
          "headers": {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh-Hans;q=0.9",
            "Origin": "https://pages.jd.com",
            "Referer": "https://pages.jd.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": this._UserAgent || this._defaultUserAgent,
            "Cookie": iill11i1
          },
          "data": Object.assign({}, l1I11lli.paramsData, {
            "area": "",
            "screen": "1290*2796",
            "uuid": "88888"
          }),
          "timeout": 30000
        },
        IlI11I11 = await this.request(lIlIlli1);
      if (!IlI11I11.success) return console.log("🚫 joinShopMember 请求失败 ➜ " + IlI11I11.error), undefined;
      if (!IlI11I11.data) return console.log("🚫 joinShopMember 请求异常 ➜ 无响应数据"), undefined;
      const lIlIlliI = IlI11I11.data;
      if (lIlIlliI?.["success"] === true) {
        if (lIlIlliI?.["result"] && lIlIlliI.result?.["giftInfo"]) for (let IIlillil of lIlIlliI.result?.["giftInfo"]?.["giftList"]) {
          console.log(" >> 入会获得：" + IIlillil.discountString + IIlillil.prizeName);
        }
        if (lIlIlliI?.["message"] === "加入店铺会员成功") return true;else {
          if (lIlIlliI?.["message"] === "活动太火爆，请稍后再试") console.log("🚫 加入店铺会员失败 ➜ " + lIlIlliI.message);else return console.log("🚫 加入店铺会员失败 ➜ " + lIlIlliI?.["message"]), false;
        }
      } else {
        if (lIlIlliI?.["message"]) return console.log("🚫 加入店铺会员失败 ➜ " + lIlIlliI.message), false;else console.log("🚫 加入店铺会员失败 ➜ " + JSON.stringify(lIlIlliI));
      }
    } catch (l1I11llI) {
      console.log("❌ joinShopMember 在处理请求中遇到了错误\n" + l1I11llI);
    }
    return undefined;
  }
  async ["getShopMemberStatus"](IliIIIii, iIllIl1 = this._Cookie) {
    if (!iIllIl1) return console.log("🚫 getShopMemberStatus 请求失败 ➜ 未设置Cookie"), undefined;
    if (!IliIIIii) return undefined;
    try {
      {
        this._loadModule("h5st");
        if (!this._H5st) return undefined;
        IliIIIii = "".concat(IliIIIii);
        const il1iIill = {
            "appId": "27004",
            "appid": "shopmember_m_jd_com",
            "functionId": "getShopOpenCardInfo",
            "clientVersion": "9.2.0",
            "client": "H5",
            "body": {
              "venderId": IliIIIii,
              "payUpShop": true,
              "queryVersion": "10.5.2",
              "appid": "27004",
              "needSecurity": true,
              "bizId": "shopmember_m_jd_com",
              "channel": 406
            },
            "version": "4.7",
            "t": true,
            "ua": this._UserAgent || this._defaultUserAgent
          },
          I1iiiIl1 = await this._H5st.getH5st(il1iIill);
        if (!I1iiiIl1.paramsData) return undefined;
        const iill11lI = {
            "url": "https://api.m.jd.com/client.action",
            "method": "POST",
            "headers": {
              "Accept": "*/*",
              "Accept-Encoding": "gzip, deflate, br",
              "Accept-Language": "zh-CN,zh-Hans;q=0.9",
              "Origin": "https://pages.jd.com",
              "Referer": "https://pages.jd.com/",
              "Sec-Fetch-Dest": "empty",
              "Sec-Fetch-Mode": "cors",
              "Content-Type": "application/x-www-form-urlencoded",
              "User-Agent": this._UserAgent || this._defaultUserAgent,
              "Cookie": iIllIl1
            },
            "data": Object.assign({}, I1iiiIl1.paramsData, {
              "area": "",
              "screen": "1290*2796",
              "uuid": "88888"
            }),
            "timeout": 30000
          },
          lI1iiiil = await this.request(iill11lI);
        if (!lI1iiiil.success) {
          console.log("🚫 getShopMemberStatus 请求失败 ➜ " + lI1iiiil.error);
          return undefined;
        }
        if (!lI1iiiil.data) return console.log("🚫 getShopMemberStatus 请求异常 ➜ 无响应数据"), undefined;
        const l11Il1II = lI1iiiil.data;
        if (l11Il1II?.["success"] === true) {
          {
            let iIii1ii = l11Il1II.result;
            Array.isArray(iIii1ii) && (iIii1ii = iIii1ii[0]);
            const IillliII = iIii1ii?.["interestsRuleList"]?.[0]?.["interestsInfo"]?.["activityId"];
            IillliII && this._shopMemberActivityIds.set(IliIIIii, IillliII);
            return iIii1ii?.["userInfo"]?.["openCardStatus"] === 1 ? true : false;
          }
        } else {
          if (l11Il1II?.["message"]) {
            console.log("🚫 获取店铺会员状态异常 ➜ " + l11Il1II.message);
          } else console.log("🚫 获取店铺会员状态异常 ➜ " + JSON.stringify(l11Il1II));
        }
      }
    } catch (llIl11Ii) {
      console.log("❌ getShopMemberStatus 在处理请求中遇到了错误\n" + llIl11Ii);
    }
    return undefined;
  }
  async ["getShopDetail"](IlliiIll = {
    "venderId": "",
    "shopId": ""
  }, iill11l1 = this._Cookie) {
    const {
      venderId: llIl11Il,
      shopId: I11i1iii
    } = IlliiIll;
    if (!llIl11Il && !I11i1iii) return {};
    try {
      {
        const l11lli1i = {
            "url": "https://api.m.jd.com/client.action",
            "method": "POST",
            "headers": {
              "Accept": "*/*",
              "Accept-Encoding": "gzip, deflate, br",
              "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,en-GB;q=0.6",
              "Content-Type": "application/x-www-form-urlencoded",
              "Origin": "https://shop.m.jd.com",
              "Referer": "https://shop.m.jd.com/",
              "Host": "api.m.jd.com",
              "Sec-Fetch-Dest": "empty",
              "Sec-Fetch-Mode": "cors",
              "Sec-Fetch-Site": "same-site",
              "User-Agent": this._defaultUserAgent,
              "X-Referer-Page": "https://shop.m.jd.com/shop/introduce",
              "X-Rp-Client": "h5_1.0.0",
              "Cookie": iill11l1 || ""
            },
            "data": {
              "functionId": "whx_getMShopDetail",
              "body": JSON.stringify({
                "shopId": "".concat(I11i1iii || ""),
                "venderId": "".concat(llIl11Il || ""),
                "source": "m-shop"
              }),
              "t": Date.now().toString(),
              "appid": "shop_m_jd_com",
              "clientVersion": "11.0.0",
              "client": "wh5",
              "area": "",
              "uuid": ""
            },
            "timeout": 30000
          },
          I1iiiIil = await this.request(l11lli1i);
        if (!I1iiiIil.success) return console.log("🚫 getShopDetail 请求失败 ➜ " + I1iiiIil.error), {};
        if (!I1iiiIil.data) return console.log("🚫 getShopDetail 请求异常 ➜ 无响应数据"), {};
        const iIii1iI = I1iiiIil.data;
        if (iIii1iI.code === "200" && iIii1iI.success === true && iIii1iI.data) return iIii1iI?.["data"] || {};
      }
    } catch (lI1iiiiI) {
      console.log("❌ getShopDetail 在处理请求中遇到了错误\n" + lI1iiiiI);
    }
    return {};
  }
  async ["getShopId"](iiliiii1, l11Il1I1 = this._Cookie) {
    if (!iiliiii1) {
      return null;
    }
    try {
      {
        const I11i1il1 = await this.getShopDetail({
          "venderId": iiliiii1
        }, l11Il1I1);
        return I11i1il1?.["shopBaseInfo"]?.["shopId"] || null;
      }
    } catch (I11il1ll) {
      console.log("❌ getShopId 在处理请求中遇到了错误\n" + I11il1ll);
    }
    return null;
  }
  async ["getVenderId"](iIii1i1, IlI1ilii = this._Cookie) {
    if (!iIii1i1) {
      return null;
    }
    try {
      const IillliIl = await this.getShopDetail({
        "shopId": iIii1i1
      }, IlI1ilii);
      return IillliIl?.["shopBaseInfo"]?.["venderId"] || null;
    } catch (lI1l11ll) {
      console.log("❌ getVenderId 在处理请求中遇到了错误\n" + lI1l11ll);
    }
    return null;
  }
  async ["getShopName"](I11il1il = {
    "venderId": "",
    "shopId": ""
  }, Ili1i1lI = this._Cookie) {
    const {
      venderId: I11il1ii,
      shopId: IlI1ilil
    } = I11il1il;
    if (!I11il1ii && !IlI1ilil) return null;
    try {
      const I11i1ii1 = await this.getShopDetail(I11il1il, Ili1i1lI);
      return I11i1ii1?.["shopBaseInfo"]?.["shopName"] || null;
    } catch (lI1iiil1) {
      console.log("❌ getShopName 在处理请求中遇到了错误\n" + lI1iiil1);
    }
    return null;
  }
  async ["followShop"](l11lli11, IIl11iIl, I11il1l1 = this._Cookie) {
    if (!I11il1l1) {
      console.log("🚫 followShop 请求失败 ➜ 未设置Cookie");
      return undefined;
    }
    if (!l11lli11 && typeof l11lli11 !== "boolean" || !IIl11iIl) return undefined;
    try {
      {
        const iIlliI1i = {
            "url": "https://api.m.jd.com/client.action",
            "method": "POST",
            "headers": {
              "Accept": "application/json, text/plain, */*",
              "Accept-Encoding": "gzip, deflate, br",
              "Content-Type": "application/x-www-form-urlencoded",
              "Origin": "https://shop.m.jd.com",
              "Referer": "https://shop.m.jd.com/",
              "Connection": "keep-alive",
              "Accept-Language": "zh-cn",
              "Cookie": I11il1l1,
              "User-Agent": this._defaultUserAgent
            },
            "data": {
              "functionId": "whx_followShop",
              "body": JSON.stringify({
                "shopId": IIl11iIl,
                "follow": l11lli11
              }),
              "t": Date.now(),
              "appid": "shop_m_jd_com",
              "clientVersion": "11.0.0",
              "client": "wh5"
            },
            "timeout": 30000
          },
          lI1iiill = await this.request(iIlliI1i);
        if (!lI1iiill.success) return console.log("🚫 followShop 请求失败 ➜ " + lI1iiill.error), undefined;
        if (!lI1iiill.data) return console.log("🚫 followShop 请求异常 ➜ 无响应数据"), undefined;
        const iIlliI1l = lI1iiill.data;
        if (iIlliI1l?.["code"] === "0") {
          {
            if (iIlliI1l?.["result"]?.["code"] === "0") {
              return true;
            } else return false;
          }
        } else {
          if (iIlliI1l?.["msg"]) {
            return false;
          } else console.log("🚫 " + (l11lli11 ? "关注" : "取关") + "店铺异常 ➜ " + JSON.stringify(iIlliI1l));
        }
      }
    } catch (i1111I11) {
      console.log("❌ followShop 在处理请求中遇到了错误\n" + i1111I11);
    }
    return undefined;
  }
  ["useAppTls"](iiliiili = {}) {
    return Object.assign({}, this._appHttpsTlsOptions, iiliiili);
  }
  async ["concTask"](ii1il11i = "3", ii1i1i11, l1iIiIIi) {
    const ii1il11l = ii1i1i11.slice();
    let IlliiIil = false,
      IlliiIii = 0,
      l1iIiIIl = 0;
    async function I11il1iI(l1li1Ill, iIllIllI) {
      {
        const i111illl = await l1iIiIIi(l1li1Ill, iIllIllI);
        if (i111illl) {
          if (typeof i111illl === "boolean") {
            IlliiIil = true;
          } else {
            if (typeof i111illl === "object") {
              {
                if (i111illl?.["runEnd"]) {
                  IlliiIil = true;
                }
              }
            }
          }
        }
        IlliiIii--;
        I1iiiIll();
      }
    }
    async function I1iiiIll() {
      while (IlliiIii < ii1il11i && ii1il11l.length > 0 && !IlliiIil) {
        const il111lIi = ii1il11l.shift();
        IlliiIii++;
        l1iIiIIl++;
        await I11il1iI(il111lIi, l1iIiIIl);
      }
      IlliiIil && (await new Promise(IilIl1l1 => {
        const iIllIlii = setInterval(() => {
          {
            if (IlliiIii === 0) {
              clearInterval(iIllIlii);
              IilIl1l1();
            }
          }
        }, 100);
      }));
    }
    const IlliiIlI = Math.min(ii1il11l.length, ii1il11i),
      iIlliI1I = [];
    for (let IilI1ii1 = 0; IilI1ii1 < IlliiIlI; IilI1ii1++) {
      const i1II11II = ii1il11l.shift();
      IlliiIii++;
      l1iIiIIl++;
      iIlliI1I.push(I11il1iI(i1II11II, l1iIiIIl));
    }
    await Promise.all(iIlliI1I);
    I1iiiIll();
    await new Promise(IilIl1lI => {
      const i111ill1 = setInterval(() => {
        if (IlliiIii === 0 || IlliiIil) {
          clearInterval(i111ill1);
          IilIl1lI();
        }
      }, 100);
    });
  }
  async ["getSign"](IilIl1ii, i111ilii) {
    if (!this._hasInitAppSignConfig) {
      this._initAppSignConfig();
      this._hasInitAppSignConfig = true;
    }
    let i1II11Ii = "";
    try {
      {
        const l11I1iIl = this._appSignConfig;
        if (l11I1iIl.genSign) {
          try {
            i1II11Ii = l11I1iIl.genSign(IilIl1ii, i111ilii);
          } catch (iIIllIIi) {
            console.log("🚫 getSign 获取本地签名遇到了错误 ➜ " + (iIIllIIi.message || iIIllIIi));
          }
          if (i1II11Ii) return i1II11Ii;else {
            console.log("🚫 getSign 本地签名获取失败");
          }
        }
        let Il1Iil11 = {
          [l11I1iIl.functionIdField]: IilIl1ii,
          [l11I1iIl.bodyField]: i111ilii
        };
        const IilI1iil = {
          "url": l11I1iIl.requestApi,
          "method": l11I1iIl.requestMethod.toLowerCase(),
          "headers": {
            "Content-Type": l11I1iIl.requestContentType
          },
          "data": null,
          "timeout": 60000,
          "proxy": null,
          "debug": false
        };
        l11I1iIl.requestMethod === "GET" ? (l11I1iIl.requestApi += "?" + this.objectToQueryString(Il1Iil11), delete IilI1iil.data, delete IilI1iil.headers["Content-Type"]) : l11I1iIl.requestContentType.indexOf("application/x-www-form-urlencoded") !== -1 ? (typeof Il1Iil11[l11I1iIl.bodyField] === "object" && (Il1Iil11[l11I1iIl.bodyField] = JSON.stringify(Il1Iil11[l11I1iIl.bodyField])), IilI1iil.data = this.objectToQueryString(Il1Iil11)) : IilI1iil.data = JSON.stringify(Il1Iil11);
        const ii1IIill = await this.request(IilI1iil);
        if (!ii1IIill.success) return console.log("🚫 getSign 请求失败 ➜ " + ii1IIill.error), i1II11Ii;else {}
        if (!ii1IIill.data) return console.log("🚫 getSign 请求异常 ➜ 无响应数据"), i1II11Ii;
        try {
          if (typeof ii1IIill.data === "object") {
            let iIIllIIl = ii1IIill?.["data"];
            iIIllIIl?.["data"] && (iIIllIIl = iIIllIIl.data);
            if (iIIllIIl?.["body"] && this._checkSignStrFormat(iIIllIIl.body)) {
              i1II11Ii = iIIllIIl.body;
            } else {
              if (iIIllIIl?.["convertUrl"] && this._checkSignStrFormat(iIIllIIl.convertUrl)) i1II11Ii = iIIllIIl.convertUrl;else iIIllIIl?.["convertUrlNew"] && this._checkSignStrFormat(iIIllIIl.convertUrlNew) && (i1II11Ii = iIIllIIl.convertUrlNew);
            }
            !i1II11Ii && console.log("🚫 getSign 响应数据解析异常 ➜ " + JSON.stringify(iIIllIIl));
          } else this._checkSignStrFormat(ii1IIill) ? i1II11Ii = ii1IIill : console.log("🚫 getSign 响应数据解析异常 ➜ " + ii1IIill);
        } catch {
          console.log("🚫 getSign 响应数据解析异常 ➜ " + JSON.stringify(data));
        }
      }
    } catch (llIiiiII) {
      console.log("🚫 getSign 在处理请求中遇到了错误\n" + llIiiiII);
    }
    return i1II11Ii;
  }
  ["_checkSignStrFormat"](iilil1l) {
    const iIii1li = ["body=", "st=", "sign=", "sv="];
    for (let IilI1il1 = 0; IilI1il1 < iIii1li.length; IilI1il1++) {
      if (!iilil1l.includes(iIii1li[IilI1il1])) return false;
    }
    return true;
  }
  ["_loadModule"](iilil1i) {
    switch (iilil1i) {
      case "h5st":
        if (!this._H5st) try {
          const {
            H5st: iIllIlll
          } = require(this._jdCryptoModelPath);
          this._H5st = iIllIlll;
        } catch (lliIilli) {
          console.log("❌ h5st 组件加载失败");
        }
        break;
      case "TablePrint":
        if (!this._Table) {
          try {
            const {
              Table: iIllIlli
            } = require("console-table-printer");
            this._Table = iIllIlli;
          } catch (l11Il1Ii) {
            console.log("❌ TablePrint 组件加载失败");
          }
        }
        break;
      case "HttpsProxyAgent":
        if (!this._HttpsProxyAgent) {
          try {
            {
              const {
                HttpsProxyAgent: IilI1ill
              } = require("https-proxy-agent");
              this._HttpsProxyAgent = IilI1ill;
            }
          } catch (I11i1ill) {
            try {
              {
                const II111IIi = require("https-proxy-agent");
                this._HttpsProxyAgent = II111IIi;
              }
            } catch (IilI1ili) {
              console.log("❌ https-proxy-agent 代理模块加载失败");
            }
          }
        }
        break;
      default:
        break;
    }
  }
}
class Base64Algorithm {
  static ["_utf8Encode"](iil1I11) {
    iil1I11 = iil1I11.replace(/rn/g, "n");
    let IIII11II = "",
      IlI1iIl;
    for (let IIII11Ii = 0; IIII11Ii < iil1I11.length; IIII11Ii++) {
      IlI1iIl = iil1I11.charCodeAt(IIII11Ii);
      if (IlI1iIl < 128) IIII11II += String.fromCharCode(IlI1iIl);else IlI1iIl > 127 && IlI1iIl < 2048 ? (IIII11II += String.fromCharCode(IlI1iIl >> 6 | 192), IIII11II += String.fromCharCode(IlI1iIl & 63 | 128)) : (IIII11II += String.fromCharCode(IlI1iIl >> 12 | 224), IIII11II += String.fromCharCode(IlI1iIl >> 6 & 63 | 128), IIII11II += String.fromCharCode(IlI1iIl & 63 | 128));
    }
    return IIII11II;
  }
  static ["_utf8Decode"](liI1i1ii) {
    let liI1i1il = "",
      lIlIllII,
      l1lIIll,
      l1lIIli,
      ii1IIiII = 0;
    while (ii1IIiII < liI1i1ii.length) {
      lIlIllII = liI1i1ii.charCodeAt(ii1IIiII);
      if (lIlIllII < 128) liI1i1il += String.fromCharCode(lIlIllII), ii1IIiII++;else {
        if (lIlIllII > 191 && lIlIllII < 224) l1lIIll = liI1i1ii.charCodeAt(ii1IIiII + 1), liI1i1il += String.fromCharCode((lIlIllII & 31) << 6 | l1lIIll & 63), ii1IIiII += 2;else {
          l1lIIll = liI1i1ii.charCodeAt(ii1IIiII + 1);
          l1lIIli = liI1i1ii.charCodeAt(ii1IIiII + 2);
          liI1i1il += String.fromCharCode((lIlIllII & 15) << 12 | (l1lIIll & 63) << 6 | l1lIIli & 63);
          ii1IIiII += 3;
        }
      }
    }
    return liI1i1il;
  }
  static ["encode"](ii1IIiIi, l1lIIil = "KLMNOPQRSTABCDEFGHIJUVWXYZabcdopqrstuvwxefghijklmnyz0123456789+/") {
    let iliIll1i = "",
      IiIl11Ii,
      iliIll1l,
      iliIll11,
      I11IIii1,
      IIliIi11,
      iIililii,
      liI1i1i1,
      iil1I1i = 0;
    ii1IIiIi = this._utf8Encode(ii1IIiIi);
    while (iil1I1i < ii1IIiIi.length) {
      {
        IiIl11Ii = ii1IIiIi.charCodeAt(iil1I1i++);
        iliIll1l = ii1IIiIi.charCodeAt(iil1I1i++);
        iliIll11 = ii1IIiIi.charCodeAt(iil1I1i++);
        I11IIii1 = IiIl11Ii >> 2;
        IIliIi11 = (IiIl11Ii & 3) << 4 | iliIll1l >> 4;
        iIililii = (iliIll1l & 15) << 2 | iliIll11 >> 6;
        liI1i1i1 = iliIll11 & 63;
        if (isNaN(iliIll1l)) iIililii = liI1i1i1 = 64;else isNaN(iliIll11) && (liI1i1i1 = 64);
        iliIll1i = iliIll1i + l1lIIil.charAt(I11IIii1) + l1lIIil.charAt(IIliIi11) + l1lIIil.charAt(iIililii) + l1lIIil.charAt(liI1i1i1);
      }
    }
    while (iliIll1i.length % 4 > 1) iliIll1i += "=";
    return iliIll1i;
  }
  static ["decode"](lliI1Iii, lll111ii = "KLMNOPQRSTABCDEFGHIJUVWXYZabcdopqrstuvwxefghijklmnyz0123456789+/") {
    let llIiii1I = "",
      lliI1Iil,
      liIi1I1I,
      l1Ili1Ii,
      l1lIIiI,
      l1Ili1Il,
      Ilii1Ill,
      Ilii1Ili,
      lll111il = 0;
    while (lll111il < lliI1Iii.length) {
      l1lIIiI = lll111ii.indexOf(lliI1Iii.charAt(lll111il++));
      l1Ili1Il = lll111ii.indexOf(lliI1Iii.charAt(lll111il++));
      Ilii1Ill = lll111ii.indexOf(lliI1Iii.charAt(lll111il++));
      Ilii1Ili = lll111ii.indexOf(lliI1Iii.charAt(lll111il++));
      lliI1Iil = l1lIIiI << 2 | l1Ili1Il >> 4;
      liIi1I1I = (l1Ili1Il & 15) << 4 | Ilii1Ill >> 2;
      l1Ili1Ii = (Ilii1Ill & 3) << 6 | Ilii1Ili;
      llIiii1I += String.fromCharCode(lliI1Iil);
      if (Ilii1Ill != 64) llIiii1I += String.fromCharCode(liIi1I1I);
      if (Ilii1Ili != 64) llIiii1I += String.fromCharCode(l1Ili1Ii);
    }
    llIiii1I = this._utf8Decode(llIiii1I);
    return llIiii1I;
  }
}
class LocalStorageCache {
  constructor(IIiIIiI = null, IiIiiiIl = 0, IiIiiiIi = null) {
    this.saveFile = IIiIIiI;
    this.defaultTTL = IiIiiiIl;
    this.reloadInterval = IiIiiiIi;
    this.lastLoad = 0;
    this.data = new Map();
    this.pendingWrites = false;
    this.writeDebounceTime = 5000;
    this.load();
  }
  ["load"]() {
    if (this.saveFile && fs.existsSync(this.saveFile)) try {
      const iIililli = fs.readFileSync(this.saveFile, "utf8"),
        I11IIilI = JSON.parse(iIililli);
      this.data = new Map(Object.entries(I11IIilI));
    } catch (lll111ll) {}
    this.lastLoad = this.now();
  }
  ["save"]() {
    if (this.saveFile && !this.pendingWrites) {
      this.pendingWrites = true;
      try {
        {
          const liIIIIiI = JSON.stringify(Object.fromEntries(this.data));
          fs.writeFileSync(this.saveFile, liIIIIiI, "utf8");
        }
      } catch {}
      this.pendingWrites = false;
    }
  }
  ["clear"]() {
    this.data.clear();
  }
  ["_checkAndReload"](IIII11I1 = this.now()) {
    if (!this.reloadInterval || !this.saveFile) return;
    IIII11I1 - this.lastLoad > this.reloadInterval && this.load();
  }
  ["now"]() {
    return Date.now();
  }
  ["put"](lll111lI, il111lll = null, l1Ili1I1 = 0, il111lli) {
    this._checkAndReload();
    l1Ili1I1 = l1Ili1I1 === 0 ? this.defaultTTL : l1Ili1I1;
    const illIlI11 = l1Ili1I1 === 0 ? 0 : this.now() + l1Ili1I1;
    let liIIIIil = null;
    this.data.has(lll111lI) && (liIIIIil = this.data.get(lll111lI).val);
    if (il111lll !== null) {
      this.data.set(lll111lI, {
        "expires": illIlI11,
        "val": il111lll
      });
    } else this.data.delete(lll111lI);
    this.save();
    if (il111lli && liIIIIil) il111lli(liIIIIil);
    return liIIIIil;
  }
  ["get"](i1lillIi, liIiilll) {
    this._checkAndReload();
    let I1i1I1lI = null;
    if (this.data.has(i1lillIi)) {
      {
        const II11IlI = this.data.get(i1lillIi);
        II11IlI.expires === 0 || this.now() < II11IlI.expires ? I1i1I1lI = II11IlI.val : (I1i1I1lI = null, this.nuke(i1lillIi));
      }
    }
    if (liIiilll) liIiilll(I1i1I1lI);
    return I1i1I1lI;
  }
  ["del"](lI1III1i, l1lIIIil) {
    this._checkAndReload();
    let iIIii1li = null;
    if (this.data.has(lI1III1i)) {
      iIIii1li = this.data.get(lI1III1i).val;
      this.data.delete(lI1III1i);
      this.save();
    }
    if (l1lIIIil) l1lIIIil(iIIii1li);
    return iIIii1li;
  }
  ["nuke"](I1liIIil) {
    this._checkAndReload();
    if (this.data.has(I1liIIil)) {
      this.data.delete(I1liIIil);
      this.save();
    }
  }
}
module.exports = new Common();