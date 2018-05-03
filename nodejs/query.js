const fs = require("fs");

function query(idcard) {

  // 城市编码, 出生日期
  let city_id = idcard.substring(0, 6);
  let birth = idcard.substring(6, 14);
  let sex = parseInt(idcard[16] % 2);

  // 根据规则校验身份证是否符合规则
  let idcard_tuple = idcard.split('').map((s) => parseInt(s));
  let coefficient = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  let sum_value=0;
  for (let i=0; i<17; i++) {
    sum_value = sum_value + idcard_tuple[i] * coefficient[i];
  }
  let remainder = sum_value % 11;
  let maptable = {0: '1', 1: '0', 2: 'x', 3: '9', 4: '8', 5: '7', 6: '6', 7: '5', 8: '4', 9: '3', 10: '2'}

  let isValid;
  if (maptable[remainder] == idcard[17]) {
    isValid = true;
  } else {
    isValid = false;
  }

  var data=JSON.parse(fs.readFileSync("data.json"));
  let city_name = data[city_id];
  
  return {
    "isValid": isValid,
    "sex": sex,
    "birth": birth,
    "addr": city_name,
  }
}

let res = query("431025197610125362");
console.log(res);