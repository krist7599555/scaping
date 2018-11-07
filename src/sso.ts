import axios from "axios";
import { sso } from "../CONFIG";

export async function login(username: string, password: string) {
  const { api, DeeAppId, DeeAppSecret, DeeTicket } = sso;
  if (!username) throw [400, "username can't be empty"];
  if (!password) throw [400, "password can't be empty"];
  if (!/[0-9]{10}/.test(username)) throw [400, "wrong format username"];
  let { data } = await axios({
    url: api + "/login",
    headers: {
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
      Accept: "application/json, text/javascript, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Accept-Language": "en,da;q=0.9"
    },
    params: {
      username: username.slice(0, 8),
      password: password,
      service: "https://cutu73.tk",
      serviceName: "CU-TU 73 Server"
    }
  });
  if (data.type == "error") throw data.content || "sso login error";
  let ticket: string = data.ticket;
  return await axios({
    url: api + "/serviceValidation",
    headers: {
      DeeAppId,
      DeeAppSecret,
      DeeTicket: ticket
    }
  }).then(({ data }) => {
    let { firstname, lastname, firstnameth, lastnameth, ouid } = data;
    const facultys: any = {
      "21": { th: "วิศวกรรมศาสตร์", en: "FACULTY OF ENGINEERING" },
      "22": { th: "อักษรศาสตร์", en: "FACULTY OF ARTS" },
      "23": { th: "วิทยาศาสตร์", en: "FACULTY OF SCIENCE" },
      "24": { th: "รัฐศาสตร์", en: "FACULTY OF POLITICAL SCIENCE" },
      "25": { th: "สถาปัตยกรรมศาสตร์", en: "FACULTY OF ARCHITECTURE" },
      "26": {
        th: "พาณิชยศาสตร์และการบัญชี",
        en: "FACULTY OF COMMERCE AND ACCOUNTANCY"
      },
      "27": { th: "ครุศาสตร์", en: "FACULTY OF EDUCATION" },
      "28": { th: "นิเทศศาสตร์", en: "FACULTY OF COMMUNICATION ARTS" },
      "29": { th: "เศรษฐศาสตร์", en: "FACULTY OF ECONOMICS" },
      "30": { th: "แพทยศาสตร์", en: "FACULTY OF MEDICINE" },
      "31": { th: "สัตวแพทยศาสตร์", en: "FACULTY OF VETERINARY SCIENCE" },
      "32": { th: "ทันตแพทยศาสตร์", en: "FACULTY OF DENTISTRY" },
      "33": { th: "เภสัชศาสตร์", en: "FACULTY OF PHARMACEUTICAL SCIENCES" },
      "34": { th: "นิติศาสตร์", en: "FACULTY OF LAW" },
      "35": { th: "ศิลปกรรมศาสตร์", en: "FACULTY OF FINE AND APPLIED ARTS" },
      "36": { th: "พยาบาลศาสตร์", en: "FACULTY OF NURSING" },
      "37": { th: "สหเวชศาสตร์", en: "FACULTY OF ALLIED HEALTH SCIENCES" },
      "38": { th: "จิตวิทยา", en: "FACULTY OF PSYCHOLOGY" },
      "39": { th: "วิทยาศาสตร์การกีฬา", en: "FACULTY OF SPORTS SCIENCE" },
      "40": { th: "สํานักวิชาทรัพยากรการเกษตร", en: "SCHOOL OF AGRICULTURAL" }
    };
    let faculty = ouid.slice(-2);
    let { th, en } = facultys[faculty];
    return {
      firstname,
      lastname,
      รหัสนิสิต: ouid,
      ชื่อ: firstnameth,
      สกุล: lastnameth,
      คณะ: th,
      รหัสคณะ: faculty,
      faculty: en.toLowerCase(),
      ปี: String(62 - Number(ouid.slice(0, 2)))
    };
  });
}
