import $ from "cheerio";
import axios from "axios";
import _ from "lodash";
import { exec as _exec, ChildProcess } from "child_process";

// import util from "util"; // VER1
// const exec = util.promisify(_exec);

// VER2
var exec = function(
  command: string
): Promise<{ stderr: string; stdout: string }> {
  return new Promise((res, rej) => {
    _exec(
      command,
      { maxBuffer: 1024 * 500 },
      (error, stdout: string, stderr: string) => {
        if (error) return rej(error);
        return res({ stderr, stdout });
      }
    );
  });
};

const url = (destination: string) => `
curl '${destination}' \
  -H 'authority: mobile.facebook.com' -H 'pragma: no-cache' -H 'cache-control: no-cache' -H 'upgrade-insecure-requests: 1' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' -H 'accept-language: en,da;q=0.9' \
  -H 'cookie: datr=JxfgW1pYzb1vb6gJnMllRtmi; sb=KBfgW3PAYAMgL4Pv0L7d2NBF; locale=en_GB; fr=2HOV3tK6sLm7UdBzr.AWW_rTgYuWICv8lbncVxed57T78.Bb4Bco.s-.AAA.0.0.Bb4CFn.AWXMkibp; c_user=100001545890948; xs=20%3An160eyIAmzTsbA%3A2%3A1541415272%3A6984%3A11986; pl=n; wd=1440x744;' \
  --compressed
`;

interface FacebookUser {
  img?: string;
  imgRaw?: string;
  link: string;
  strId: string;
  numId: string;
  displayname: string;
  detail: string[];
}

export async function search(q: string, img: boolean = true) {
  if (!q) throw [400, "no search parameters ?q="];
  let { stdout, stderr } = await exec(
    url("https://mobile.facebook.com/search/top/?q=" + q.replace(" ", "%20"))
  );
  let res = _.map(
    $("div[data-module-role=ENTITY_USER] ._4g34._uoh a", stdout),
    (usr): FacebookUser => {
      let { href: strId, "data-store": dataStore } = usr.attribs;
      strId = strId.slice(1, strId.indexOf("?"));
      let link = "https://fb.com/" + strId;
      let numId = String(JSON.parse(dataStore).result_id);
      let img = `https://graph.facebook.com/${numId}/picture?width=400&height=400`
      let imgRaw = img + '&redirect=false'
      // let imgRaw = (await axios.get(img + '&redirect=false')).data.url;
      let [displayname, detail1, detail2, mutualFriend] = usr.children.map(
        (atr): string => {
          while (atr && atr.type != "text" && atr.children) {
            atr = atr.children[0];
          }
          return atr ? String(atr.data) : "";
        }
      );
      return {
        img,
        imgRaw,
        displayname,
        strId,
        numId,
        link,
        detail: [detail1, detail2].filter(Boolean)
      };
    }
  );
  return res;
}
